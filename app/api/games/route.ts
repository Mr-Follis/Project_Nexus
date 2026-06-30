import { getPublicGamesResponse } from "@/lib/api/public-knowledge";

export const dynamic = "force-dynamic";

export async function GET() {
  return getPublicGamesResponse();
}
