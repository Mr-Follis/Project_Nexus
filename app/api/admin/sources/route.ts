import { createAdminSourceResponse } from "@/lib/api/admin-sources";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return createAdminSourceResponse(request);
}
