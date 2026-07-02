import {
  editAdminEntityResponse,
  updateAdminEntityStatusResponse
} from "@/lib/api/admin-entities";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: {
    entityId: string;
  };
};

export async function PATCH(request: Request, context: RouteContext) {
  return updateAdminEntityStatusResponse(request, context.params.entityId);
}

export async function PUT(request: Request, context: RouteContext) {
  return editAdminEntityResponse(request, context.params.entityId);
}
