import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { getDatabaseUrl } from "@/lib/db/client";
import {
  createSubmission,
  getGameBySlug
} from "@/lib/db/repositories/knowledge";
import { submissionInputSchema } from "@/lib/validation/submissions";

export async function createPublicSubmissionResponse(request: Request) {
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
    const input = submissionInputSchema.parse(await request.json());
    const game = await getGameBySlug(input.gameSlug);

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

    const submission = await createSubmission({
      gameId: game.id,
      submissionType: input.type,
      title: input.title,
      description: input.description,
      evidenceUrl: input.evidenceUrl,
      screenshotUrl: input.screenshotUrl
    });

    return NextResponse.json(
      {
        ok: true,
        configured: true,
        submission: {
          id: submission.id,
          status: submission.status
        }
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid submission.",
          issues: error.issues
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Submission request failed."
      },
      { status: 500 }
    );
  }
}
