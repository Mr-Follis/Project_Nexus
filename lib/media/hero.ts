import type { HeroMedia } from "@/components/media/hero-backdrop";
import { getDatabaseUrl } from "@/lib/db/client";
import { getGameBySlug } from "@/lib/db/repositories/knowledge";
import { getFeaturedMediaForGame } from "@/lib/db/repositories/media";
import { resolveMediaAttribution } from "@/lib/validation/media";

// Rendered when no featured media asset is available yet. This is original
// Project Nexus art, not Rockstar media, so it is safe to ship as the default.
const FALLBACK_HERO: HeroMedia = {
  imageUrl: "/images/nexus-city-intel-hero.png",
  altText: "Stylised aerial view of a neon coastal city at dusk.",
  attribution: "© Project Nexus.",
  provenance: "project_nexus_original"
};

/**
 * Resolves the cinematic hero image for a game from the media library, falling
 * back to original Project Nexus art. The library is the single point to swap
 * in official promotional or, later, original gameplay media.
 */
export async function getGameHeroMedia(gameSlug: string): Promise<HeroMedia> {
  if (!getDatabaseUrl()) {
    return FALLBACK_HERO;
  }

  try {
    const game = await getGameBySlug(gameSlug);

    if (!game) {
      return FALLBACK_HERO;
    }

    const asset = await getFeaturedMediaForGame(game.id);
    const imageUrl = asset?.filePath ?? asset?.externalUrl;

    if (!asset || !imageUrl) {
      return FALLBACK_HERO;
    }

    return {
      imageUrl,
      altText: asset.altText ?? asset.title,
      attribution: resolveMediaAttribution(asset),
      provenance: asset.provenance
    };
  } catch {
    return FALLBACK_HERO;
  }
}
