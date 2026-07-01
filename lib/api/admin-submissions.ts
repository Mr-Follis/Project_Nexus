import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { authorizeAdminRequest } from "@/lib/auth/admin";
import { getDatabaseUrl } from "@/lib/db/client";
import { updateSubmissionModeration } from "@/lib/db/repositories/knowledge";
import { moderationUpdateSchema } from "@/lib/validation/moderation";

export async function updateAdminSubmissionModerationResponse(
  request: Request,
  submissionId: string
) {
  const auth = authorizeAdminRequest(request);

  if (!auth.ok) {
    return NextResponse.json(
      {
        ok: false,
        configured: auth.configured,
        error: auth.error
      },
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
    const input = moderationUpdateSchema.parse(await request.json());
    const submission = await updateSubmissionModeration(submissionId, input, {
      reviewerId: auth.reviewerId
    });

    if (!submission) {
      return NextResponse.json(
        {
          ok: false,
          configured: true,
          error: "Submission not found."
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      configured: true,
      submission: {
        id: submission.id,
        status: submission.status,
        moderatorNotes: submission.moderatorNotes
      }
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid moderation update.",
          issues: error.issues
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Moderation update failed."
      },
      { status: 400 }
    );
  }
}
