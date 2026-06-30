import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "@/db/schema";
import { games, sources } from "@/db/schema";
import { gameInputSchema, sourceInputSchema } from "@/lib/validation/knowledge";

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

  console.log("Seeded foundation knowledge records.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await client.end();
  });
