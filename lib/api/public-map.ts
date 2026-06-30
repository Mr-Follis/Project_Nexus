import { NextResponse } from "next/server";
import { z, ZodError } from "zod";

import { getDatabaseUrl } from "@/lib/db/client";
import {
  getPublicGameBySlug,
  listPublicMapMarkers
} from "@/lib/db/repositories/knowledge";

const markerQuerySchema = z.object({
  markerType: z.string().trim().min(1).max(120).optional()
});

export async function getPublicMapMarkersResponse(
  gameSlug: string,
  searchParams: URLSearchParams
) {
  if (!getDatabaseUrl()) {
    return NextResponse.json({
      ok: false,
      configured: false,
      error: "DATABASE_URL is not configured."
    });
  }

  try {
    const query = markerQuerySchema.parse({
      markerType: searchParams.get("markerType") ?? undefined
    });
    const game = await getPublicGameBySlug(gameSlug);

    if (!game) {
      return NextResponse.json(
        {
          ok: false,
          configured: true,
          error: "Game not found."
        },
        { status: 404 }
      );
    }

    const markers = await listPublicMapMarkers({
      gameId: game.id,
      markerType: query.markerType
    });

    return NextResponse.json({
      ok: true,
      configured: true,
      game,
      markers
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid marker request.",
          issues: error.issues
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Map markers request failed."
      },
      { status: 500 }
    );
  }
}
