import { getPublicSearchResponse } from "@/lib/api/public-search";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return getPublicSearchResponse(new URL(request.url).searchParams);
}
