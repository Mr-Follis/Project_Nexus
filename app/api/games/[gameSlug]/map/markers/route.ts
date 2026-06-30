import { getPublicMapMarkersResponse } from "@/lib/api/public-map";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { gameSlug: string } }
) {
  return getPublicMapMarkersResponse(
    params.gameSlug,
    new URL(request.url).searchParams
  );
}
