import { and, desc, eq } from "drizzle-orm";

import {
  entities,
  entitySources,
  games,
  sources,
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

export async function getGameBySlug(slug: string) {
  const db = getDb();
  const [game] = await db
    .select()
    .from(games)
    .where(eq(games.slug, slug))
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
}) {
  const db = getDb();

  if (options.type) {
    return db
      .select()
      .from(entities)
      .where(
        and(
          eq(entities.gameId, options.gameId),
          eq(entities.type, options.type)
        )
      )
      .orderBy(desc(entities.updatedAt));
  }

  return db
    .select()
    .from(entities)
    .where(eq(entities.gameId, options.gameId))
    .orderBy(desc(entities.updatedAt));
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
