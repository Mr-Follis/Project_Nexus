import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { runAdminMutation } from "@/lib/api/admin-mutation";
import { authorizeAdminRequest } from "@/lib/auth/admin";
import { getDatabaseUrl } from "@/lib/db/client";
import {
  createAdminGame,
  updateAdminGame,
  updateGameStatus
} from "@/lib/db/repositories/knowledge";
import { recordStatusSchema } from "@/lib/validation/knowledge";
import {
  gameCreateSchema,
  gameEditSchema
} from "@/lib/validation/record-admin";

function toGameResponse(game: {
  id: string;
  title: string;
  slug: string;
  status: string;
}) {
  return {
    id: game.id,
    title: game.title,
    slug: game.slug,
    status: game.status
  };
}

export async function createAdminGameResponse(request: Request) {
  return runAdminMutation(request, "Invalid game input.", async (auth) => {
    const input = gameCreateSchema.parse(await request.json());
    const game = await createAdminGame(input, { reviewerId: auth.reviewerId });

    return NextResponse.json(
      { ok: true, configured: true, game: toGameResponse(game) },
      { status: 201 }
    );
  });
}

export async function editAdminGameResponse(request: Request, gameId: string) {
  return runAdminMutation(request, "Invalid game update.", async (auth) => {
    const input = gameEditSchema.parse(await request.json());
    const game = await updateAdminGame(gameId, input, {
      reviewerId: auth.reviewerId
    });

    if (!game) {
      return NextResponse.json(
        { ok: false, configured: true, error: "Game not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      configured: true,
      game: toGameResponse(game)
    });
  });
}

export async function updateAdminGameStatusResponse(
  request: Request,
  gameId: string
) {
  const auth = authorizeAdminRequest(request);

  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, configured: auth.configured, error: auth.error },
      { status: auth.status }
    );
  }

  if (!getDatabaseUrl()) {
    return NextResponse.json(
      {
        ok: false,
        configured: false,
        error: "DATABASE_URL is not configured."
      },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const status = recordStatusSchema.parse(body?.status);
    const game = await updateGameStatus(gameId, status, {
      reviewerId: auth.reviewerId
    });

    if (!game) {
      return NextResponse.json(
        { ok: false, configured: true, error: "Game not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      configured: true,
      game: {
        id: game.id,
        title: game.title,
        slug: game.slug,
        status: game.status
      }
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid game status update.",
          issues: error.issues
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Game update failed."
      },
      { status: 400 }
    );
  }
}
