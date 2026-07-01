import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { authorizeAdminRequest } from "@/lib/auth/admin";
import { getDatabaseUrl } from "@/lib/db/client";
import { updateEntityStatus } from "@/lib/db/repositories/knowledge";
import { entityStatusUpdateSchema } from "@/lib/validation/entity-admin";

export async function updateAdminEntityStatusResponse(
  request: Request,
  entityId: string
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
    const input = entityStatusUpdateSchema.parse(await request.json());
    const entity = await updateEntityStatus(entityId, input, {
      reviewerId: auth.reviewerId
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

    return NextResponse.json({
      ok: true,
      configured: true,
      entity: {
        id: entity.id,
        name: entity.name,
        slug: entity.slug,
        status: entity.status
      }
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid entity status update.",
          issues: error.issues
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Entity update failed."
      },
      { status: 400 }
    );
  }
}
