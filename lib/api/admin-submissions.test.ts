import { beforeEach, describe, expect, it, vi } from "vitest";

import { updateAdminSubmissionModerationResponse } from "./admin-submissions";

const mocks = vi.hoisted(() => ({
  getDatabaseUrl: vi.fn(),
  updateSubmissionModeration: vi.fn(),
  authorizeAdminRequest: vi.fn()
}));

vi.mock("@/lib/db/client", () => ({
  getDatabaseUrl: mocks.getDatabaseUrl
}));

vi.mock("@/lib/db/repositories/knowledge", () => ({
  updateSubmissionModeration: mocks.updateSubmissionModeration
}));

vi.mock("@/lib/auth/admin", () => ({
  authorizeAdminRequest: mocks.authorizeAdminRequest
}));

describe("admin submissions API response", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getDatabaseUrl.mockReturnValue(
      "postgres://user:pass@example.com:5432/db"
    );
    mocks.authorizeAdminRequest.mockReturnValue({
      ok: true,
      reviewerId: "replit-admin"
    });
  });

  it("returns 401 when admin access is not authorized", async () => {
    mocks.authorizeAdminRequest.mockReturnValue({
      ok: false,
      status: 401,
      configured: true,
      error: "Admin access is required."
    });

    const response = await updateAdminSubmissionModerationResponse(
      jsonRequest({ status: "needs_more_info" }),
      "00000000-0000-4000-8000-000000000005"
    );
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error).toBe("Admin access is required.");
    expect(mocks.updateSubmissionModeration).not.toHaveBeenCalled();
  });

  it("returns 503 when DATABASE_URL is missing", async () => {
    mocks.getDatabaseUrl.mockReturnValue(undefined);

    const response = await updateAdminSubmissionModerationResponse(
      jsonRequest({ status: "needs_more_info" }),
      "00000000-0000-4000-8000-000000000005"
    );
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body.configured).toBe(false);
    expect(mocks.updateSubmissionModeration).not.toHaveBeenCalled();
  });

  it("rejects invalid moderation payloads", async () => {
    const response = await updateAdminSubmissionModerationResponse(
      jsonRequest({ status: "published" }),
      "00000000-0000-4000-8000-000000000005"
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Invalid moderation update.");
  });

  it("returns 404 when the submission is missing", async () => {
    mocks.updateSubmissionModeration.mockResolvedValue(null);

    const response = await updateAdminSubmissionModerationResponse(
      jsonRequest({ status: "needs_more_info" }),
      "00000000-0000-4000-8000-000000000005"
    );
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error).toBe("Submission not found.");
  });

  it("updates a submission moderation status", async () => {
    mocks.updateSubmissionModeration.mockResolvedValue({
      id: "00000000-0000-4000-8000-000000000005",
      status: "needs_more_info",
      moderatorNotes: "Needs an official source."
    });

    const response = await updateAdminSubmissionModerationResponse(
      jsonRequest({
        status: "needs_more_info",
        moderatorNotes: "Needs an official source."
      }),
      "00000000-0000-4000-8000-000000000005"
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.submission).toEqual({
      id: "00000000-0000-4000-8000-000000000005",
      status: "needs_more_info",
      moderatorNotes: "Needs an official source."
    });
    expect(mocks.updateSubmissionModeration).toHaveBeenCalledWith(
      "00000000-0000-4000-8000-000000000005",
      {
        status: "needs_more_info",
        moderatorNotes: "Needs an official source."
      },
      { reviewerId: "replit-admin" }
    );
  });
});

function jsonRequest(body: unknown) {
  return new Request("https://nexus.example/api/admin/submissions/id", {
    method: "PATCH",
    body: JSON.stringify(body)
  });
}
