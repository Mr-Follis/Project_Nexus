import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { getDatabaseUrl } from "@/lib/db/client";
import {
  getPublicEntityBySlug,
  getPublicGameBySlug,
  listSourcesForEntity,
  listPublicEntities,
  listPublicGames
} from "@/lib/db/repositories/knowledge";
import { entityTypeSchema } from "@/lib/validation/knowledge";

export function databaseNotConfiguredResponse() {
  return NextResponse.json(
    {
      ok: false,
      configured: false,
      error: "DATABASE_URL is not configured."
    },
    { status: 200 }
  );
}

export function apiErrorResponse(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid request.",
        issues: error.issues
      },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      ok: false,
      error: error instanceof Error ? error.message : "Request failed."
    },
    { status: 500 }
  );
}

export async function getPublicGamesResponse() {
  if (!getDatabaseUrl()) {
    return databaseNotConfiguredResponse();
  }

  try {
    const games = await listPublicGames();

    return NextResponse.json({
      ok: true,
      configured: true,
      games
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function getPublicGameResponse(gameSlug: string) {
  if (!getDatabaseUrl()) {
    return databaseNotConfiguredResponse();
  }

  try {
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

    return NextResponse.json({
      ok: true,
      configured: true,
      game
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function getPublicEntitiesResponse(
  gameSlug: string,
  searchParams: URLSearchParams
) {
  if (!getDatabaseUrl()) {
    return databaseNotConfiguredResponse();
  }

  try {
    const parsedType = searchParams.get("type")
      ? entityTypeSchema.parse(searchParams.get("type"))
      : undefined;

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

    const entities = await listPublicEntities({
      gameId: game.id,
      type: parsedType
    });

    return NextResponse.json({
      ok: true,
      configured: true,
      game,
      entities
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function getPublicEntityResponse(
  gameSlug: string,
  entitySlug: string
) {
  if (!getDatabaseUrl()) {
    return databaseNotConfiguredResponse();
  }

  try {
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

    const entity = await getPublicEntityBySlug({
      gameId: game.id,
      slug: entitySlug
    });

    if (!entity) {
      return NextResponse.json(
        {
          ok: false,
          configured: true,
          error: "Entity not found."
        },
        { status: 404 }
      );
    }

    const sourceLinks = await listSourcesForEntity(entity.id);

    return NextResponse.json({
      ok: true,
      configured: true,
      game,
      entity,
      sources: sourceLinks
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
