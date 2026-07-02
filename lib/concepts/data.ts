import type { MediaPanelAsset } from "@/components/media/media-panel";
import { getDatabaseUrl } from "@/lib/db/client";
import {
  getGameBySlug,
  getPublicContentStats,
  listPublicEntities
} from "@/lib/db/repositories/knowledge";
import { listPublicMediaForGame } from "@/lib/db/repositories/media";
import { getGameHeroMedia } from "@/lib/media/hero";
import type { HeroMedia } from "@/components/media/hero-backdrop";

export type ConceptEntity = {
  id: string;
  name: string;
  slug: string;
  type: string;
  summary: string | null;
  verification: string;
  updatedAt: Date | null;
};

export type ConceptData = {
  hero: HeroMedia;
  stats: Awaited<ReturnType<typeof getPublicContentStats>> | null;
  media: MediaPanelAsset[];
  latestEntities: ConceptEntity[];
};

/**
 * One loader for all three design-concept homepages so every concept renders
 * the same real, verified data — hero art, live counts, recent media, and the
 * latest published records — with safe fallbacks when no database is bound.
 */
export async function getConceptData(): Promise<ConceptData> {
  const hero = await getGameHeroMedia("gta-6");

  if (!getDatabaseUrl()) {
    return { hero, stats: null, media: [], latestEntities: [] };
  }

  try {
    const game = await getGameBySlug("gta-6");

    if (!game || game.status !== "published") {
      return { hero, stats: null, media: [], latestEntities: [] };
    }

    const [stats, media, entities] = await Promise.all([
      getPublicContentStats("gta-6"),
      listPublicMediaForGame(game.id, {
        types: ["screenshot", "key_art"],
        limit: 8
      }),
      listPublicEntities({ gameId: game.id })
    ]);

    const latestEntities = [...entities]
      .sort(
        (a, b) =>
          (b.updatedAt ? new Date(b.updatedAt).getTime() : 0) -
          (a.updatedAt ? new Date(a.updatedAt).getTime() : 0)
      )
      .slice(0, 6)
      .map((entity) => ({
        id: entity.id,
        name: entity.name,
        slug: entity.slug,
        type: entity.type,
        summary: entity.summary,
        verification: entity.verification,
        updatedAt: entity.updatedAt ? new Date(entity.updatedAt) : null
      }));

    return { hero, stats, media, latestEntities };
  } catch {
    return { hero, stats: null, media: [], latestEntities: [] };
  }
}

/** Whole days until the officially announced launch (Nov 19, 2026). */
export function daysUntilLaunch(): number {
  const launch = Date.UTC(2026, 10, 19);
  return Math.max(0, Math.ceil((launch - Date.now()) / 86_400_000));
}
