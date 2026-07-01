import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "@/db/schema";
import { games, mediaAssets, sources } from "@/db/schema";
import { gameInputSchema, sourceInputSchema } from "@/lib/validation/knowledge";
import { mediaAssetInputSchema } from "@/lib/validation/media";

const foundationMedia = [
  {
    type: "key_art",
    provenance: "project_nexus_original",
    title: "Project Nexus city intelligence backdrop",
    caption:
      "Original Project Nexus key art used as the cinematic hero until official or original gameplay media replaces it.",
    altText: "Stylised aerial view of a neon coastal city at dusk.",
    filePath: "/images/nexus-city-intel-hero.png",
    copyrightOwner: "Project Nexus",
    attributionRequired: true,
    attributionText: "© Project Nexus.",
    isFeatured: true,
    status: "published"
  },
  {
    type: "promotional_image",
    provenance: "official_promotional",
    title: "GTA VI official promotional media (metadata placeholder)",
    caption:
      "Editorial metadata slot for officially released Rockstar promotional media. The image file is added by an editor from an official source; no third-party content is bundled.",
    altText: "Placeholder for official GTA VI promotional imagery.",
    externalUrl: "https://www.rockstargames.com/VI/",
    sourceName: "Rockstar Games",
    copyrightOwner: "Rockstar Games / Take-Two Interactive",
    originalUrl: "https://www.rockstargames.com/VI/",
    attributionRequired: true,
    isFeatured: false,
    status: "draft"
  }
] as const;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is required. Set it in Replit Secrets before seeding."
  );
}

const client = postgres(databaseUrl, { prepare: false });
const db = drizzle(client, { schema });

const officialSources = [
  {
    type: "official",
    title: "Rockstar Games GTA VI official site",
    url: "https://www.rockstargames.com/VI/",
    reliabilityScore: 100,
    notes:
      "Official source record only. No gameplay facts are seeded from this URL."
  },
  {
    type: "official",
    title: "Rockstar Newswire",
    url: "https://www.rockstargames.com/newswire/",
    reliabilityScore: 100,
    notes: "Official source index for future reviewed updates."
  }
] as const;

async function main() {
  const gameInput = gameInputSchema.parse({
    title: "GTA VI",
    slug: "gta-6",
    description:
      "Draft game hub record for Project Nexus. This seed creates structure only and does not publish gameplay facts.",
    platforms: [],
    status: "draft"
  });

  const [game] = await db
    .insert(games)
    .values(gameInput)
    .onConflictDoUpdate({
      target: games.slug,
      set: {
        title: gameInput.title,
        description: gameInput.description,
        platforms: gameInput.platforms,
        status: gameInput.status,
        updatedAt: new Date()
      }
    })
    .returning();

  for (const source of officialSources) {
    const sourceInput = sourceInputSchema.parse({
      ...source,
      gameId: game.id,
      accessedAt: new Date().toISOString()
    });

    const existing = sourceInput.url
      ? await db
          .select()
          .from(sources)
          .where(eq(sources.url, sourceInput.url))
          .limit(1)
      : [];

    if (existing.length === 0) {
      await db.insert(sources).values({
        gameId: sourceInput.gameId,
        type: sourceInput.type,
        title: sourceInput.title,
        url: sourceInput.url,
        author: sourceInput.author,
        publishedAt: sourceInput.publishedAt
          ? new Date(sourceInput.publishedAt)
          : undefined,
        accessedAt: sourceInput.accessedAt
          ? new Date(sourceInput.accessedAt)
          : undefined,
        reliabilityScore: sourceInput.reliabilityScore,
        permissionNotes: sourceInput.permissionNotes,
        notes: sourceInput.notes
      });
    }
  }

  for (const media of foundationMedia) {
    const mediaInput = mediaAssetInputSchema.parse({
      ...media,
      gameId: game.id
    });

    const existing = await db
      .select()
      .from(mediaAssets)
      .where(eq(mediaAssets.title, mediaInput.title))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(mediaAssets).values(mediaInput);
    }
  }

  console.log("Seeded foundation knowledge and media records.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await client.end();
  });
