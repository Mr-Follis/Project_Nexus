import { updateAdminEntityStatusResponse } from "@/lib/api/admin-entities";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: {
    entityId: string;
  };
};

export async function PATCH(request: Request, context: RouteContext) {
  return updateAdminEntityStatusResponse(request, context.params.entityId);
}
