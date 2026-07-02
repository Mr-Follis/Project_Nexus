import { editAdminSourceResponse } from "@/lib/api/admin-sources";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: {
    sourceId: string;
  };
};

export async function PUT(request: Request, context: RouteContext) {
  return editAdminSourceResponse(request, context.params.sourceId);
}
