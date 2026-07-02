import { attachAdminEntitySourceResponse } from "@/lib/api/admin-entity-sources";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: {
    entityId: string;
  };
};

export async function POST(request: Request, context: RouteContext) {
  return attachAdminEntitySourceResponse(request, context.params.entityId);
}
