import { createAdminGameResponse } from "@/lib/api/admin-games";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return createAdminGameResponse(request);
}
