import { beforeEach, describe, expect, it, vi } from "vitest";

import { updateAdminMediaStatusResponse } from "./admin-media";

const mocks = vi.hoisted(() => ({
  getDatabaseUrl: vi.fn(),
  updateMediaStatus: vi.fn(),
  authorizeAdminRequest: vi.fn()
}));

vi.mock("@/lib/db/client", () => ({
  getDatabaseUrl: mocks.getDatabaseUrl
}));

vi.mock("@/lib/db/repositories/media", () => ({
  updateMediaStatus: mocks.updateMediaStatus
}));

vi.mock("@/lib/auth/admin", () => ({
  authorizeAdminRequest: mocks.authorizeAdminRequest
}));

const mediaId = "00000000-0000-4000-8000-000000000021";

describe("admin media status API response", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getDatabaseUrl.mockReturnValue("postgres://user:pass@host:5432/db");
    mocks.authorizeAdminRequest.mockReturnValue({
      ok: true,
      reviewerId: "dev-admin"
    });
  });

  it("returns 401 when not authorized", async () => {
    mocks.authorizeAdminRequest.mockReturnValue({
      ok: false,
      status: 401,
      configured: true,
      error: "Admin access is required."
    });

    const response = await updateAdminMediaStatusResponse(
      jsonRequest({ status: "published" }),
      mediaId
    );

    expect(response.status).toBe(401);
    expect(mocks.updateMediaStatus).not.toHaveBeenCalled();
  });

  it("rejects invalid statuses", async () => {
    const response = await updateAdminMediaStatusResponse(
      jsonRequest({ status: "approved" }),
      mediaId
    );

    expect(response.status).toBe(400);
  });

  it("returns 404 when the asset is missing", async () => {
    mocks.updateMediaStatus.mockResolvedValue(null);

    const response = await updateAdminMediaStatusResponse(
      jsonRequest({ status: "published" }),
      mediaId
    );

    expect(response.status).toBe(404);
  });

  it("publishes an asset and passes the reviewer id", async () => {
    mocks.updateMediaStatus.mockResolvedValue({
      id: mediaId,
      title: "Hero art",
      status: "published"
    });

    const response = await updateAdminMediaStatusResponse(
      jsonRequest({ status: "published" }),
      mediaId
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.media.status).toBe("published");
    expect(mocks.updateMediaStatus).toHaveBeenCalledWith(mediaId, "published", {
      reviewerId: "dev-admin"
    });
  });
});

function jsonRequest(body: unknown) {
  return new Request(`https://nexus.example/api/admin/media/${mediaId}`, {
    method: "PATCH",
    body: JSON.stringify(body)
  });
}
