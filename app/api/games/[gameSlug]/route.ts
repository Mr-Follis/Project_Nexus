import { getPublicGameResponse } from "@/lib/api/public-knowledge";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { gameSlug: string } }
) {
  return getPublicGameResponse(params.gameSlug);
}
