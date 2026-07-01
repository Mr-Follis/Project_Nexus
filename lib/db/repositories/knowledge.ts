import { and, desc, eq, ilike, or } from "drizzle-orm";

import {
  entities,
  entitySources,
  games,
  mapMarkers,
  recordVersions,
  sources,
  submissions,
  type entityType,
  type recordStatus,
  type submissionStatus
} from "@/db/schema";
import { getDb } from "@/lib/db/client";
import {
  entityInputSchema,
  entitySourceInputSchema,
  gameInputSchema,
  sourceInputSchema,
  type EntityInput,
  type EntitySourceInput,
  type GameInput,
  type SourceInput
} from "@/lib/validation/knowledge";
import {
  buildModerationAuditEvent,
  buildSubmissionEntityAuditEvent,
  buildSubmissionEntityDraft,
  isValidModerationTransition,
  moderationUpdateSchema,
  shouldCreateEntityFromApproval,
  type ModerationUpdateInput
} from "@/lib/validation/moderation";
import {
  buildEntityStatusAuditEvent,
  entityStatusUpdateSchema,
  type EntityStatusUpdateInput
} from "@/lib/validation/entity-admin";

type RecordStatus = (typeof recordStatus.enumValues)[number];
type EntityType = (typeof entityType.enumValues)[number];
type SubmissionStatus = (typeof submissionStatus.enumValues)[number];

export async function listGames(options: { status?: RecordStatus } = {}) {
  const db = getDb();

  if (options.status) {
    return db
      .select()
      .from(games)
      .where(eq(games.status, options.status))
      .orderBy(desc(games.updatedAt));
  }

  return db.select().from(games).orderBy(desc(games.updatedAt));
}

export async function listPublicGames() {
  return listGames({ status: "published" });
}

export async function getGameBySlug(slug: string) {
  const db = getDb();
  const [game] = await db
    .select()
    .from(games)
    .where(eq(games.slug, slug))
    .limit(1);

  return game ?? null;
}

export async function getPublicGameBySlug(slug: string) {
  const db = getDb();
  const [game] = await db
    .select()
    .from(games)
    .where(and(eq(games.slug, slug), eq(games.status, "published")))
    .limit(1);

  return game ?? null;
}

export async function upsertGame(input: GameInput) {
  const db = getDb();
  const data = gameInputSchema.parse(input);

  const [game] = await db
    .insert(games)
    .values(data)
    .onConflictDoUpdate({
      target: games.slug,
      set: {
        title: data.title,
        description: data.description,
        releaseDate: data.releaseDate,
        platforms: data.platforms,
        status: data.status,
        updatedAt: new Date()
      }
    })
    .returning();

  return game;
}

export async function listEntities(options: {
  gameId: string;
  type?: EntityType;
  status?: RecordStatus;
}) {
  const db = getDb();
  const filters = [eq(entities.gameId, options.gameId)];

  if (options.type) {
    filters.push(eq(entities.type, options.type));
  }

  if (options.status) {
    filters.push(eq(entities.status, options.status));
  }

  return db
    .select()
    .from(entities)
    .where(and(...filters))
    .orderBy(desc(entities.updatedAt));
}

export async function listPublicEntities(options: {
  gameId: string;
  type?: EntityType;
}) {
  return listEntities({
    ...options,
    status: "published"
  });
}

export async function getPublicEntityBySlug(options: {
  gameId: string;
  slug: string;
}) {
  const db = getDb();
  const [entity] = await db
    .select()
    .from(entities)
    .where(
      and(
        eq(entities.gameId, options.gameId),
        eq(entities.slug, options.slug),
        eq(entities.status, "published")
      )
    )
    .limit(1);

  return entity ?? null;
}

export async function listSourcesForEntity(entityId: string) {
  const db = getDb();

  return db
    .select({
      source: sources,
      claim: entitySources.claim,
      fieldName: entitySources.fieldName
    })
    .from(entitySources)
    .innerJoin(sources, eq(entitySources.sourceId, sources.id))
    .where(eq(entitySources.entityId, entityId))
    .orderBy(desc(entitySources.createdAt));
}

export async function searchPublicEntities(options: {
  query: string;
  gameId?: string;
  limit?: number;
}) {
  const db = getDb();
  const pattern = `%${options.query}%`;
  const filters = [
    eq(entities.status, "published"),
    or(
      ilike(entities.name, pattern),
      ilike(entities.summary, pattern),
      ilike(entities.description, pattern)
    )
  ];

  if (options.gameId) {
    filters.push(eq(entities.gameId, options.gameId));
  }

  return db
    .select()
    .from(entities)
    .where(and(...filters))
    .orderBy(desc(entities.updatedAt))
    .limit(options.limit ?? 20);
}

export async function listPublicMapMarkers(options: {
  gameId: string;
  markerType?: string;
}) {
  const db = getDb();
  const filters = [
    eq(mapMarkers.gameId, options.gameId),
    eq(mapMarkers.status, "published")
  ];

  if (options.markerType) {
    filters.push(eq(mapMarkers.markerType, options.markerType));
  }

  return db
    .select()
    .from(mapMarkers)
    .where(and(...filters))
    .orderBy(desc(mapMarkers.updatedAt));
}

export async function createSubmission(input: {
  gameId: string;
  submissionType: string;
  title: string;
  description?: string;
  evidenceUrl?: string;
  screenshotUrl?: string;
}) {
  const db = getDb();
  const [submission] = await db.insert(submissions).values(input).returning();

  return submission;
}

export async function listModerationSubmissions(
  options: { status?: SubmissionStatus; limit?: number } = {}
) {
  const db = getDb();
  const baseQuery = db
    .select({
      submission: submissions,
      game: {
        id: games.id,
        title: games.title,
        slug: games.slug
      }
    })
    .from(submissions)
    .innerJoin(games, eq(submissions.gameId, games.id));

  if (options.status) {
    return baseQuery
      .where(eq(submissions.status, options.status))
      .orderBy(desc(submissions.updatedAt))
      .limit(options.limit ?? 50);
  }

  return baseQuery
    .orderBy(desc(submissions.updatedAt))
    .limit(options.limit ?? 50);
}

export async function getSubmissionById(id: string) {
  const db = getDb();
  const [submission] = await db
    .select()
    .from(submissions)
    .where(eq(submissions.id, id))
    .limit(1);

  return submission ?? null;
}

export async function updateSubmissionModeration(
  id: string,
  input: ModerationUpdateInput,
  options: { reviewerId: string }
) {
  const data = moderationUpdateSchema.parse(input);
  const currentSubmission = await getSubmissionById(id);

  if (!currentSubmission) {
    return null;
  }

  if (
    data.status &&
    !isValidModerationTransition(currentSubmission.status, data.status)
  ) {
    throw new Error(
      `Cannot transition submission from ${currentSubmission.status} to ${data.status}.`
    );
  }

  const db = getDb();
  const nextStatus = data.status ?? currentSubmission.status;
  const createEntityFromApproval = shouldCreateEntityFromApproval({
    currentStatus: currentSubmission.status,
    nextStatus,
    hasProposedEntity: Boolean(currentSubmission.proposedEntityId)
  });

  return db.transaction(async (tx) => {
    const setValues: Partial<typeof submissions.$inferInsert> = {
      updatedAt: new Date()
    };

    if (data.status) {
      setValues.status = data.status;
    }

    if (data.moderatorNotes !== undefined) {
      setValues.moderatorNotes = data.moderatorNotes;
    }

    // Approval-to-record: an approved submission becomes an unpublished draft
    // entity linked back to the submission, ready for editorial review.
    if (createEntityFromApproval) {
      const draft = entityInputSchema.parse(
        buildSubmissionEntityDraft({
          gameId: currentSubmission.gameId,
          submissionType: currentSubmission.submissionType,
          title: currentSubmission.title,
          description: currentSubmission.description
        })
      );
      const slug = await resolveAvailableEntitySlug(
        tx,
        currentSubmission.gameId,
        draft.slug,
        id
      );

      const [entity] = await tx
        .insert(entities)
        .values({
          ...draft,
          slug,
          lastVerifiedAt: draft.lastVerifiedAt
            ? new Date(draft.lastVerifiedAt)
            : undefined
        })
        .returning();

      setValues.proposedEntityId = entity.id;

      await tx.insert(recordVersions).values(
        buildSubmissionEntityAuditEvent({
          entityId: entity.id,
          submissionId: id,
          reviewerId: options.reviewerId
        })
      );
    }

    const [submission] = await tx
      .update(submissions)
      .set(setValues)
      .where(eq(submissions.id, id))
      .returning();

    await tx.insert(recordVersions).values(
      buildModerationAuditEvent({
        submissionId: id,
        oldStatus: currentSubmission.status,
        newStatus: nextStatus,
        reviewerId: options.reviewerId,
        note: data.moderatorNotes
      })
    );

    return submission;
  });
}

/**
 * Returns a slug unique within the game, appending a short submission-derived
 * suffix when the preferred slug is already taken so approval never fails the
 * (game_id, slug) uniqueness constraint.
 */
async function resolveAvailableEntitySlug(
  tx: Parameters<Parameters<ReturnType<typeof getDb>["transaction"]>[0]>[0],
  gameId: string,
  baseSlug: string,
  submissionId: string
) {
  const [existing] = await tx
    .select({ id: entities.id })
    .from(entities)
    .where(and(eq(entities.gameId, gameId), eq(entities.slug, baseSlug)))
    .limit(1);

  if (!existing) {
    return baseSlug;
  }

  const suffix = submissionId.replace(/-/g, "").slice(0, 8);
  return `${baseSlug.slice(0, 111)}-${suffix}`;
}

export async function listAdminEntities(options: { limit?: number } = {}) {
  const db = getDb();

  return db
    .select({
      entity: entities,
      game: {
        id: games.id,
        title: games.title,
        slug: games.slug
      }
    })
    .from(entities)
    .innerJoin(games, eq(entities.gameId, games.id))
    .orderBy(desc(entities.updatedAt))
    .limit(options.limit ?? 25);
}

export async function getEntityById(id: string) {
  const db = getDb();
  const [entity] = await db
    .select()
    .from(entities)
    .where(eq(entities.id, id))
    .limit(1);

  return entity ?? null;
}

export async function updateEntityStatus(
  id: string,
  input: EntityStatusUpdateInput,
  options: { reviewerId: string }
) {
  const data = entityStatusUpdateSchema.parse(input);
  const current = await getEntityById(id);

  if (!current) {
    return null;
  }

  const db = getDb();

  return db.transaction(async (tx) => {
    const [entity] = await tx
      .update(entities)
      .set({ status: data.status, updatedAt: new Date() })
      .where(eq(entities.id, id))
      .returning();

    await tx.insert(recordVersions).values(
      buildEntityStatusAuditEvent({
        entityId: id,
        oldStatus: current.status,
        newStatus: data.status,
        reviewerId: options.reviewerId
      })
    );

    return entity;
  });
}

export async function createEntity(input: EntityInput) {
  const db = getDb();
  const data = entityInputSchema.parse(input);

  const [entity] = await db
    .insert(entities)
    .values({
      ...data,
      lastVerifiedAt: data.lastVerifiedAt
        ? new Date(data.lastVerifiedAt)
        : undefined
    })
    .returning();

  return entity;
}

export async function createSource(input: SourceInput) {
  const db = getDb();
  const data = sourceInputSchema.parse(input);

  const [source] = await db
    .insert(sources)
    .values({
      ...data,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
      accessedAt: data.accessedAt ? new Date(data.accessedAt) : undefined
    })
    .returning();

  return source;
}

export async function attachSourceToEntity(input: EntitySourceInput) {
  const db = getDb();
  const data = entitySourceInputSchema.parse(input);

  const [entitySource] = await db
    .insert(entitySources)
    .values(data)
    .onConflictDoNothing()
    .returning();

  return entitySource ?? null;
}
