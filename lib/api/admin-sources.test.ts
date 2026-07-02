import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createAdminSourceResponse,
  editAdminSourceResponse
} from "./admin-sources";

const mocks = vi.hoisted(() => ({
  getDatabaseUrl: vi.fn(),
  createAdminSource: vi.fn(),
  updateAdminSource: vi.fn(),
  authorizeAdminRequest: vi.fn()
}));

vi.mock("@/lib/db/client", () => ({
  getDatabaseUrl: mocks.getDatabaseUrl
}));

vi.mock("@/lib/db/repositories/knowledge", () => ({
  createAdminSource: mocks.createAdminSource,
  updateAdminSource: mocks.updateAdminSource
}));

vi.mock("@/lib/auth/admin", () => ({
  authorizeAdminRequest: mocks.authorizeAdminRequest
}));

const sourceId = "00000000-0000-4000-8000-000000000042";

describe("admin source create API response", () => {
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

    const response = await createAdminSourceResponse(jsonRequest({}, "POST"));

    expect(response.status).toBe(401);
    expect(mocks.createAdminSource).not.toHaveBeenCalled();
  });

  it("returns 503 when the database is not configured", async () => {
    mocks.getDatabaseUrl.mockReturnValue(undefined);

    const response = await createAdminSourceResponse(
      jsonRequest({ type: "official" }, "POST")
    );

    expect(response.status).toBe(503);
  });

  it("rejects invalid source input", async () => {
    const response = await createAdminSourceResponse(
      jsonRequest({ type: "official", url: "not-a-url" }, "POST")
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Invalid source input.");
  });

  it("creates a source and passes the reviewer id", async () => {
    mocks.createAdminSource.mockResolvedValue({
      id: sourceId,
      type: "official",
      title: "Rockstar Newswire",
      url: "https://example.com/newswire"
    });

    const response = await createAdminSourceResponse(
      jsonRequest(
        {
          type: "official",
          title: "Rockstar Newswire",
          url: "https://example.com/newswire"
        },
        "POST"
      )
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.source.title).toBe("Rockstar Newswire");
    expect(mocks.createAdminSource).toHaveBeenCalledWith(
      expect.objectContaining({ type: "official" }),
      { reviewerId: "dev-admin" }
    );
  });
});

describe("admin source edit API response", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getDatabaseUrl.mockReturnValue("postgres://user:pass@host:5432/db");
    mocks.authorizeAdminRequest.mockReturnValue({
      ok: true,
      reviewerId: "dev-admin"
    });
  });

  it("rejects an empty update", async () => {
    const response = await editAdminSourceResponse(
      jsonRequest({}, "PUT"),
      sourceId
    );

    expect(response.status).toBe(400);
    expect(mocks.updateAdminSource).not.toHaveBeenCalled();
  });

  it("returns 404 when the source is missing", async () => {
    mocks.updateAdminSource.mockResolvedValue(null);

    const response = await editAdminSourceResponse(
      jsonRequest({ reliabilityScore: 90 }, "PUT"),
      sourceId
    );

    expect(response.status).toBe(404);
  });

  it("updates fields and passes the reviewer id", async () => {
    mocks.updateAdminSource.mockResolvedValue({
      id: sourceId,
      type: "official",
      title: "Rockstar Newswire",
      url: "https://example.com/newswire"
    });

    const response = await editAdminSourceResponse(
      jsonRequest({ reliabilityScore: 90 }, "PUT"),
      sourceId
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.source.id).toBe(sourceId);
    expect(mocks.updateAdminSource).toHaveBeenCalledWith(
      sourceId,
      { reliabilityScore: 90 },
      { reviewerId: "dev-admin" }
    );
  });
});

function jsonRequest(body: unknown, method: string) {
  return new Request(`https://nexus.example/api/admin/sources/${sourceId}`, {
    method,
    body: JSON.stringify(body)
  });
}
