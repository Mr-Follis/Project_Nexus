import { NextResponse } from "next/server";

import { runAdminMutation } from "@/lib/api/admin-mutation";
import {
  attachAdminEntitySource,
  detachAdminEntitySource
} from "@/lib/db/repositories/knowledge";
import { entitySourceInputSchema } from "@/lib/validation/knowledge";

export async function attachAdminEntitySourceResponse(
  request: Request,
  entityId: string
) {
  return runAdminMutation(
    request,
    "Invalid source link input.",
    async (auth) => {
      const body = (await request.json()) as Record<string, unknown>;
      const input = entitySourceInputSchema.parse({ ...body, entityId });
      const entitySource = await attachAdminEntitySource(input, {
        reviewerId: auth.reviewerId
      });

      if (!entitySource) {
        return NextResponse.json(
          {
            ok: false,
            configured: true,
            error: "This source is already linked to the entity."
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          ok: true,
          configured: true,
          entitySource: {
            id: entitySource.id,
            entityId: entitySource.entityId,
            sourceId: entitySource.sourceId,
            claim: entitySource.claim,
            fieldName: entitySource.fieldName
          }
        },
        { status: 201 }
      );
    }
  );
}

export async function detachAdminEntitySourceResponse(
  request: Request,
  entitySourceId: string
) {
  return runAdminMutation(
    request,
    "Invalid source link request.",
    async (auth) => {
      const removed = await detachAdminEntitySource(entitySourceId, {
        reviewerId: auth.reviewerId
      });

      if (!removed) {
        return NextResponse.json(
          { ok: false, configured: true, error: "Source link not found." },
          { status: 404 }
        );
      }

      return NextResponse.json({
        ok: true,
        configured: true,
        entitySource: { id: removed.id }
      });
    }
  );
}
