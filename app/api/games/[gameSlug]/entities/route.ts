import { getPublicEntitiesResponse } from "@/lib/api/public-knowledge";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { gameSlug: string } }
) {
  return getPublicEntitiesResponse(
    params.gameSlug,
    new URL(request.url).searchParams
  );
}
