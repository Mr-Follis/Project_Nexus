import { createPublicSubmissionResponse } from "@/lib/api/public-submissions";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return createPublicSubmissionResponse(request);
}
