import { getPublicEntityResponse } from "@/lib/api/public-knowledge";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { gameSlug: string; entitySlug: string } }
) {
  return getPublicEntityResponse(params.gameSlug, params.entitySlug);
}
