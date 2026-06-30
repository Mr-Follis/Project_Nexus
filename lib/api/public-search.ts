import { NextResponse } from "next/server";
import { z, ZodError } from "zod";

import { getDatabaseUrl } from "@/lib/db/client";
import {
  getPublicGameBySlug,
  searchPublicEntities
} from "@/lib/db/repositories/knowledge";

const searchQuerySchema = z.object({
  q: z.string().trim().min(2).max(120),
  game: z.string().trim().min(1).max(120).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20)
});

export async function getPublicSearchResponse(searchParams: URLSearchParams) {
  if (!getDatabaseUrl()) {
    return NextResponse.json({
      ok: false,
      configured: false,
      error: "DATABASE_URL is not configured."
    });
  }

  try {
    const query = searchQuerySchema.parse({
      q: searchParams.get("q"),
      game: searchParams.get("game") ?? undefined,
      limit: searchParams.get("limit") ?? undefined
    });

    const game = query.game ? await getPublicGameBySlug(query.game) : undefined;

    if (query.game && !game) {
      return NextResponse.json(
        {
          ok: false,
          configured: true,
          error: "Game not found."
        },
        { status: 404 }
      );
    }

    const results = await searchPublicEntities({
      query: query.q,
      gameId: game?.id,
      limit: query.limit
    });

    return NextResponse.json({
      ok: true,
      configured: true,
      query: query.q,
      game: game ?? null,
      results
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid search request.",
          issues: error.issues
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Search failed."
      },
      { status: 500 }
    );
  }
}
