import { NextResponse } from "next/server";

import { runAdminMutation } from "@/lib/api/admin-mutation";
import {
  createAdminSource,
  updateAdminSource
} from "@/lib/db/repositories/knowledge";
import {
  sourceCreateSchema,
  sourceEditSchema
} from "@/lib/validation/record-admin";

function toSourceResponse(source: {
  id: string;
  type: string;
  title: string | null;
  url: string | null;
}) {
  return {
    id: source.id,
    type: source.type,
    title: source.title,
    url: source.url
  };
}

export async function createAdminSourceResponse(request: Request) {
  return runAdminMutation(request, "Invalid source input.", async (auth) => {
    const input = sourceCreateSchema.parse(await request.json());
    const source = await createAdminSource(input, {
      reviewerId: auth.reviewerId
    });

    return NextResponse.json(
      { ok: true, configured: true, source: toSourceResponse(source) },
      { status: 201 }
    );
  });
}

export async function editAdminSourceResponse(
  request: Request,
  sourceId: string
) {
  return runAdminMutation(request, "Invalid source update.", async (auth) => {
    const input = sourceEditSchema.parse(await request.json());
    const source = await updateAdminSource(sourceId, input, {
      reviewerId: auth.reviewerId
    });

    if (!source) {
      return NextResponse.json(
        { ok: false, configured: true, error: "Source not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      configured: true,
      source: toSourceResponse(source)
    });
  });
}
