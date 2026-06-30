import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";

import { getDatabaseUrl, getDb } from "@/lib/db/client";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!getDatabaseUrl()) {
    return NextResponse.json({
      ok: false,
      configured: false,
      message: "DATABASE_URL is not configured."
    });
  }

  const db = getDb();
  const [summary] = await db.execute<{
    games_count: string;
    sources_count: string;
    entities_count: string;
  }>(sql`
    select
      (select count(*) from games)::text as games_count,
      (select count(*) from sources)::text as sources_count,
      (select count(*) from entities)::text as entities_count
  `);

  return NextResponse.json({
    ok: true,
    configured: true,
    counts: {
      games: Number(summary.games_count),
      sources: Number(summary.sources_count),
      entities: Number(summary.entities_count)
    }
  });
}
