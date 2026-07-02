import { createAdminMediaResponse } from "@/lib/api/admin-media";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return createAdminMediaResponse(request);
}
