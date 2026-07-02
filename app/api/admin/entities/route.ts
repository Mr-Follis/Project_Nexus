import { createAdminEntityResponse } from "@/lib/api/admin-entities";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return createAdminEntityResponse(request);
}
