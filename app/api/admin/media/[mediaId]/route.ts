import { updateAdminMediaStatusResponse } from "@/lib/api/admin-media";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: {
    mediaId: string;
  };
};

export async function PATCH(request: Request, context: RouteContext) {
  return updateAdminMediaStatusResponse(request, context.params.mediaId);
}
