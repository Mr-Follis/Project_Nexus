import { and, desc, eq, ilike, or } from "drizzle-orm";

import {
  entities,
  entitySources,
  games,
  mapMarkers,
  sources,
  submissions,
  type entityType,
  type recordStatus
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

type RecordStatus = (typeof recordStatus.enumValues)[number];
type EntityType = (typeof entityType.enumValues)[number];

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
