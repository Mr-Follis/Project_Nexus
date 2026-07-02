import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { runAdminMutation } from "@/lib/api/admin-mutation";
import { authorizeAdminRequest } from "@/lib/auth/admin";
import { getDatabaseUrl } from "@/lib/db/client";
import {
  createAdminMedia,
  updateMediaStatus
} from "@/lib/db/repositories/media";
import { recordStatusSchema } from "@/lib/validation/knowledge";
import { mediaAssetCreateSchema } from "@/lib/validation/media";

export async function createAdminMediaResponse(request: Request) {
  return runAdminMutation(request, "Invalid media input.", async (auth) => {
    const input = mediaAssetCreateSchema.parse(await request.json());
    const asset = await createAdminMedia(input, {
      reviewerId: auth.reviewerId
    });

    return NextResponse.json(
      {
        ok: true,
        configured: true,
        media: {
          id: asset.id,
          title: asset.title,
          type: asset.type,
          provenance: asset.provenance,
          status: asset.status
        }
      },
      { status: 201 }
    );
  });
}

export async function updateAdminMediaStatusResponse(
  request: Request,
  mediaId: string
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
    const asset = await updateMediaStatus(mediaId, status, {
      reviewerId: auth.reviewerId
    });

    if (!asset) {
      return NextResponse.json(
        { ok: false, configured: true, error: "Media asset not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      configured: true,
      media: {
        id: asset.id,
        title: asset.title,
        status: asset.status
      }
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid media status update.",
          issues: error.issues
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Media update failed."
      },
      { status: 400 }
    );
  }
}
