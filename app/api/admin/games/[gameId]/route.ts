import {
  editAdminGameResponse,
  updateAdminGameStatusResponse
} from "@/lib/api/admin-games";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: {
    gameId: string;
  };
};

export async function PATCH(request: Request, context: RouteContext) {
  return updateAdminGameStatusResponse(request, context.params.gameId);
}

export async function PUT(request: Request, context: RouteContext) {
  return editAdminGameResponse(request, context.params.gameId);
}
