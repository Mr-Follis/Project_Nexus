import { and, desc, eq, ilike, inArray, isNull, or, sql } from "drizzle-orm";

import {
  entities,
  entitySources,
  games,
  mapMarkers,
  mediaAssets,
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
import {
  buildRecordCreateAuditEvent,
  buildRecordDeleteAuditEvent,
  buildRecordEditAuditEvent,
  diffRecordFields,
  entityCreateSchema,
  entityEditSchema,
  gameCreateSchema,
  gameEditSchema,
  sourceCreateSchema,
  sourceEditSchema,
  type EntityCreateInput,
  type EntityEditInput,
  type GameCreateInput,
  type GameEditInput,
  type SourceCreateInput,
  type SourceEditInput
} from "@/lib/validation/record-admin";

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

export async function getGameById(id: string) {
  const db = getDb();
  const [game] = await db.select().from(games).where(eq(games.id, id)).limit(1);

  return game ?? null;
}

export async function updateGameStatus(
  id: string,
  status: RecordStatus,
  options: { reviewerId: string }
) {
  const current = await getGameById(id);

  if (!current) {
    return null;
  }

  const db = getDb();

  return db.transaction(async (tx) => {
    const [game] = await tx
      .update(games)
      .set({ status, updatedAt: new Date() })
      .where(eq(games.id, id))
      .returning();

    await tx.insert(recordVersions).values({
      ...buildEntityStatusAuditEvent({
        entityId: id,
        oldStatus: current.status,
        newStatus: status,
        reviewerId: options.reviewerId
      }),
      tableName: "games"
    });

    return game;
  });
}

export async function createAdminGame(
  input: GameCreateInput,
  options: { reviewerId: string }
) {
  const data = gameCreateSchema.parse(input);
  const db = getDb();

  return db.transaction(async (tx) => {
    const [game] = await tx.insert(games).values(data).returning();

    await tx.insert(recordVersions).values(
      buildRecordCreateAuditEvent({
        tableName: "games",
        recordId: game.id,
        data,
        reviewerId: options.reviewerId
      })
    );

    return game;
  });
}

export async function updateAdminGame(
  id: string,
  input: GameEditInput,
  options: { reviewerId: string }
) {
  const data = gameEditSchema.parse(input);
  const current = await getGameById(id);

  if (!current) {
    return null;
  }

  const diff = diffRecordFields(current, data);

  if (diff.changedFields.length === 0) {
    return current;
  }

  const db = getDb();

  return db.transaction(async (tx) => {
    const setValues: Partial<typeof games.$inferInsert> = {
      updatedAt: new Date()
    };

    if (data.title !== undefined) {
      setValues.title = data.title;
    }

    if (data.slug !== undefined) {
      setValues.slug = data.slug;
    }

    if (data.description !== undefined) {
      setValues.description = data.description;
    }

    if (data.releaseDate !== undefined) {
      setValues.releaseDate = data.releaseDate;
    }

    if (data.platforms !== undefined) {
      setValues.platforms = data.platforms;
    }

    const [game] = await tx
      .update(games)
      .set(setValues)
      .where(eq(games.id, id))
      .returning();

    await tx.insert(recordVersions).values(
      buildRecordEditAuditEvent({
        tableName: "games",
        recordId: id,
        ...diff,
        reviewerId: options.reviewerId
      })
    );

    return game;
  });
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

/**
 * Read-only counts for public presentation (hero stat strips). Everything is
 * scoped to published records of one published game.
 */
export async function getPublicContentStats(gameSlug: string) {
  const db = getDb();
  const game = await getPublicGameBySlug(gameSlug);

  if (!game) {
    return null;
  }

  const [byType, [mediaCount], [sourceCount]] = await Promise.all([
    db
      .select({ type: entities.type, count: sql<number>`count(*)::int` })
      .from(entities)
      .where(
        and(eq(entities.gameId, game.id), eq(entities.status, "published"))
      )
      .groupBy(entities.type),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(mediaAssets)
      .where(
        and(
          eq(mediaAssets.gameId, game.id),
          eq(mediaAssets.status, "published")
        )
      ),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(sources)
      .where(and(eq(sources.gameId, game.id), eq(sources.type, "official")))
  ]);

  const entityCounts: Record<string, number> = {};
  let totalEntities = 0;

  for (const row of byType) {
    entityCounts[row.type] = row.count;
    totalEntities += row.count;
  }

  return {
    game,
    totalEntities,
    entityCounts,
    mediaCount: mediaCount?.count ?? 0,
    officialSourceCount: sourceCount?.count ?? 0
  };
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

export async function createAdminEntity(
  input: EntityCreateInput,
  options: { reviewerId: string }
) {
  const data = entityCreateSchema.parse(input);
  const db = getDb();

  return db.transaction(async (tx) => {
    const [entity] = await tx.insert(entities).values(data).returning();

    await tx.insert(recordVersions).values(
      buildRecordCreateAuditEvent({
        tableName: "entities",
        recordId: entity.id,
        data,
        reviewerId: options.reviewerId
      })
    );

    return entity;
  });
}

export async function updateAdminEntity(
  id: string,
  input: EntityEditInput,
  options: { reviewerId: string }
) {
  const data = entityEditSchema.parse(input);
  const current = await getEntityById(id);

  if (!current) {
    return null;
  }

  const diff = diffRecordFields(current, data);

  if (diff.changedFields.length === 0) {
    return current;
  }

  const db = getDb();

  return db.transaction(async (tx) => {
    const setValues: Partial<typeof entities.$inferInsert> = {
      updatedAt: new Date()
    };

    if (data.type !== undefined) {
      setValues.type = data.type;
    }

    if (data.name !== undefined) {
      setValues.name = data.name;
    }

    if (data.slug !== undefined) {
      setValues.slug = data.slug;
    }

    if (data.summary !== undefined) {
      setValues.summary = data.summary;
    }

    if (data.description !== undefined) {
      setValues.description = data.description;
    }

    if (data.verification !== undefined) {
      setValues.verification = data.verification;
    }

    if (data.confidenceScore !== undefined) {
      setValues.confidenceScore = data.confidenceScore;
    }

    const [entity] = await tx
      .update(entities)
      .set(setValues)
      .where(eq(entities.id, id))
      .returning();

    await tx.insert(recordVersions).values(
      buildRecordEditAuditEvent({
        tableName: "entities",
        recordId: id,
        ...diff,
        reviewerId: options.reviewerId
      })
    );

    return entity;
  });
}

export async function listAdminSources(options: { limit?: number } = {}) {
  const db = getDb();

  return db
    .select({
      source: sources,
      game: {
        id: games.id,
        title: games.title,
        slug: games.slug
      }
    })
    .from(sources)
    .leftJoin(games, eq(sources.gameId, games.id))
    .orderBy(desc(sources.createdAt))
    .limit(options.limit ?? 25);
}

export async function getSourceById(id: string) {
  const db = getDb();
  const [source] = await db
    .select()
    .from(sources)
    .where(eq(sources.id, id))
    .limit(1);

  return source ?? null;
}

export async function createAdminSource(
  input: SourceCreateInput,
  options: { reviewerId: string }
) {
  const data = sourceCreateSchema.parse(input);
  const db = getDb();

  return db.transaction(async (tx) => {
    const [source] = await tx
      .insert(sources)
      .values({
        ...data,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
        accessedAt: data.accessedAt ? new Date(data.accessedAt) : undefined
      })
      .returning();

    await tx.insert(recordVersions).values(
      buildRecordCreateAuditEvent({
        tableName: "sources",
        recordId: source.id,
        data,
        reviewerId: options.reviewerId
      })
    );

    return source;
  });
}

export async function updateAdminSource(
  id: string,
  input: SourceEditInput,
  options: { reviewerId: string }
) {
  const data = sourceEditSchema.parse(input);
  const current = await getSourceById(id);

  if (!current) {
    return null;
  }

  const diff = diffRecordFields(current, data);

  if (diff.changedFields.length === 0) {
    return current;
  }

  const db = getDb();

  return db.transaction(async (tx) => {
    const setValues: Partial<typeof sources.$inferInsert> = {};

    if (data.type !== undefined) {
      setValues.type = data.type;
    }

    if (data.title !== undefined) {
      setValues.title = data.title;
    }

    if (data.url !== undefined) {
      setValues.url = data.url;
    }

    if (data.author !== undefined) {
      setValues.author = data.author;
    }

    if (data.publishedAt !== undefined) {
      setValues.publishedAt =
        data.publishedAt === null ? null : new Date(data.publishedAt);
    }

    if (data.accessedAt !== undefined) {
      setValues.accessedAt =
        data.accessedAt === null ? null : new Date(data.accessedAt);
    }

    if (data.reliabilityScore !== undefined) {
      setValues.reliabilityScore = data.reliabilityScore;
    }

    if (data.permissionNotes !== undefined) {
      setValues.permissionNotes = data.permissionNotes;
    }

    if (data.notes !== undefined) {
      setValues.notes = data.notes;
    }

    const [source] = await tx
      .update(sources)
      .set(setValues)
      .where(eq(sources.id, id))
      .returning();

    await tx.insert(recordVersions).values(
      buildRecordEditAuditEvent({
        tableName: "sources",
        recordId: id,
        ...diff,
        reviewerId: options.reviewerId
      })
    );

    return source;
  });
}

/**
 * Linked sources for a batch of entities in one query, keyed for the admin
 * page. Includes the entity_sources id so links can be detached.
 */
export async function listAdminEntitySources(entityIds: string[]) {
  if (entityIds.length === 0) {
    return [];
  }

  const db = getDb();

  return db
    .select({
      id: entitySources.id,
      entityId: entitySources.entityId,
      claim: entitySources.claim,
      fieldName: entitySources.fieldName,
      source: sources
    })
    .from(entitySources)
    .innerJoin(sources, eq(entitySources.sourceId, sources.id))
    .where(inArray(entitySources.entityId, entityIds))
    .orderBy(desc(entitySources.createdAt));
}

export async function attachAdminEntitySource(
  input: EntitySourceInput,
  options: { reviewerId: string }
) {
  const data = entitySourceInputSchema.parse(input);
  const db = getDb();

  return db.transaction(async (tx) => {
    // The (entity, source, field) unique constraint treats NULL field names
    // as distinct, so duplicates must be rejected explicitly for the common
    // whole-record link where no field name is given.
    const [existing] = await tx
      .select({ id: entitySources.id })
      .from(entitySources)
      .where(
        and(
          eq(entitySources.entityId, data.entityId),
          eq(entitySources.sourceId, data.sourceId),
          data.fieldName == null
            ? isNull(entitySources.fieldName)
            : eq(entitySources.fieldName, data.fieldName)
        )
      )
      .limit(1);

    if (existing) {
      return null;
    }

    const [entitySource] = await tx
      .insert(entitySources)
      .values(data)
      .onConflictDoNothing()
      .returning();

    if (!entitySource) {
      return null;
    }

    await tx.insert(recordVersions).values(
      buildRecordCreateAuditEvent({
        tableName: "entity_sources",
        recordId: entitySource.id,
        data,
        reviewerId: options.reviewerId
      })
    );

    return entitySource;
  });
}

export async function detachAdminEntitySource(
  id: string,
  options: { reviewerId: string }
) {
  const db = getDb();
  const [current] = await db
    .select()
    .from(entitySources)
    .where(eq(entitySources.id, id))
    .limit(1);

  if (!current) {
    return null;
  }

  return db.transaction(async (tx) => {
    const [removed] = await tx
      .delete(entitySources)
      .where(eq(entitySources.id, id))
      .returning();

    await tx.insert(recordVersions).values(
      buildRecordDeleteAuditEvent({
        tableName: "entity_sources",
        recordId: id,
        previousData: {
          entityId: current.entityId,
          sourceId: current.sourceId,
          claim: current.claim,
          fieldName: current.fieldName
        },
        reviewerId: options.reviewerId
      })
    );

    return removed;
  });
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
