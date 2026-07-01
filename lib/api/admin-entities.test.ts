import { beforeEach, describe, expect, it, vi } from "vitest";

import { updateAdminEntityStatusResponse } from "./admin-entities";

const mocks = vi.hoisted(() => ({
  getDatabaseUrl: vi.fn(),
  updateEntityStatus: vi.fn(),
  authorizeAdminRequest: vi.fn()
}));

vi.mock("@/lib/db/client", () => ({
  getDatabaseUrl: mocks.getDatabaseUrl
}));

vi.mock("@/lib/db/repositories/knowledge", () => ({
  updateEntityStatus: mocks.updateEntityStatus
}));

vi.mock("@/lib/auth/admin", () => ({
  authorizeAdminRequest: mocks.authorizeAdminRequest
}));

const entityId = "00000000-0000-4000-8000-000000000009";

describe("admin entity status API response", () => {
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

    const response = await updateAdminEntityStatusResponse(
      jsonRequest({ status: "published" }),
      entityId
    );

    expect(response.status).toBe(401);
    expect(mocks.updateEntityStatus).not.toHaveBeenCalled();
  });

  it("rejects invalid statuses", async () => {
    const response = await updateAdminEntityStatusResponse(
      jsonRequest({ status: "approved" }),
      entityId
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Invalid entity status update.");
  });

  it("returns 404 when the entity is missing", async () => {
    mocks.updateEntityStatus.mockResolvedValue(null);

    const response = await updateAdminEntityStatusResponse(
      jsonRequest({ status: "published" }),
      entityId
    );

    expect(response.status).toBe(404);
  });

  it("publishes an entity and passes the reviewer id", async () => {
    mocks.updateEntityStatus.mockResolvedValue({
      id: entityId,
      name: "Vice City Cheetah",
      slug: "vice-city-cheetah",
      status: "published"
    });

    const response = await updateAdminEntityStatusResponse(
      jsonRequest({ status: "published" }),
      entityId
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.entity.status).toBe("published");
    expect(mocks.updateEntityStatus).toHaveBeenCalledWith(
      entityId,
      { status: "published" },
      { reviewerId: "dev-admin" }
    );
  });
});

function jsonRequest(body: unknown) {
  return new Request(`https://nexus.example/api/admin/entities/${entityId}`, {
    method: "PATCH",
    body: JSON.stringify(body)
  });
}
