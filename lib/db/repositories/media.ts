import { and, desc, eq } from "drizzle-orm";

import { games, mediaAssets, recordVersions } from "@/db/schema";
import { getDb } from "@/lib/db/client";
import {
  mediaAssetInputSchema,
  type MediaAssetInput
} from "@/lib/validation/media";
import { buildEntityStatusAuditEvent } from "@/lib/validation/entity-admin";

export async function createMediaAsset(input: MediaAssetInput) {
  const db = getDb();
  const data = mediaAssetInputSchema.parse(input);

  const [asset] = await db.insert(mediaAssets).values(data).returning();

  return asset;
}

/**
 * Returns the published, featured asset for a game's cinematic surfaces. Newest
 * wins, so refreshing the hero is just a matter of publishing a newer asset.
 */
export async function getFeaturedMediaForGame(gameId: string) {
  const db = getDb();
  const [asset] = await db
    .select()
    .from(mediaAssets)
    .where(
      and(
        eq(mediaAssets.gameId, gameId),
        eq(mediaAssets.status, "published"),
        eq(mediaAssets.isFeatured, true)
      )
    )
    .orderBy(desc(mediaAssets.updatedAt))
    .limit(1);

  return asset ?? null;
}

export async function listPublicMediaForEntity(entityId: string) {
  const db = getDb();

  return db
    .select()
    .from(mediaAssets)
    .where(
      and(
        eq(mediaAssets.entityId, entityId),
        eq(mediaAssets.status, "published")
      )
    )
    .orderBy(desc(mediaAssets.updatedAt));
}

export async function listAdminMedia(options: { limit?: number } = {}) {
  const db = getDb();

  return db
    .select({
      media: mediaAssets,
      game: {
        id: games.id,
        title: games.title,
        slug: games.slug
      }
    })
    .from(mediaAssets)
    .innerJoin(games, eq(mediaAssets.gameId, games.id))
    .orderBy(desc(mediaAssets.updatedAt))
    .limit(options.limit ?? 25);
}

export async function getMediaAssetById(id: string) {
  const db = getDb();
  const [asset] = await db
    .select()
    .from(mediaAssets)
    .where(eq(mediaAssets.id, id))
    .limit(1);

  return asset ?? null;
}

export async function updateMediaStatus(
  id: string,
  status: "draft" | "published" | "hidden" | "archived",
  options: { reviewerId: string }
) {
  const current = await getMediaAssetById(id);

  if (!current) {
    return null;
  }

  const db = getDb();

  return db.transaction(async (tx) => {
    const [asset] = await tx
      .update(mediaAssets)
      .set({ status, updatedAt: new Date() })
      .where(eq(mediaAssets.id, id))
      .returning();

    await tx.insert(recordVersions).values({
      ...buildEntityStatusAuditEvent({
        entityId: id,
        oldStatus: current.status,
        newStatus: status,
        reviewerId: options.reviewerId
      }),
      tableName: "media_assets"
    });

    return asset;
  });
}
