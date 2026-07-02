import { detachAdminEntitySourceResponse } from "@/lib/api/admin-entity-sources";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: {
    entitySourceId: string;
  };
};

export async function DELETE(request: Request, context: RouteContext) {
  return detachAdminEntitySourceResponse(
    request,
    context.params.entitySourceId
  );
}
