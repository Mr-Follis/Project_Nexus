import { updateAdminSubmissionModerationResponse } from "@/lib/api/admin-submissions";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: {
    submissionId: string;
  };
};

export async function PATCH(request: Request, context: RouteContext) {
  return updateAdminSubmissionModerationResponse(
    request,
    context.params.submissionId
  );
}
