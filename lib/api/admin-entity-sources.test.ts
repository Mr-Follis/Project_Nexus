import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  attachAdminEntitySourceResponse,
  detachAdminEntitySourceResponse
} from "./admin-entity-sources";

const mocks = vi.hoisted(() => ({
  getDatabaseUrl: vi.fn(),
  attachAdminEntitySource: vi.fn(),
  detachAdminEntitySource: vi.fn(),
  authorizeAdminRequest: vi.fn()
}));

vi.mock("@/lib/db/client", () => ({
  getDatabaseUrl: mocks.getDatabaseUrl
}));

vi.mock("@/lib/db/repositories/knowledge", () => ({
  attachAdminEntitySource: mocks.attachAdminEntitySource,
  detachAdminEntitySource: mocks.detachAdminEntitySource
}));

vi.mock("@/lib/auth/admin", () => ({
  authorizeAdminRequest: mocks.authorizeAdminRequest
}));

const entityId = "00000000-0000-4000-8000-000000000009";
const sourceId = "00000000-0000-4000-8000-000000000042";
const entitySourceId = "00000000-0000-4000-8000-000000000077";

describe("admin entity source attach API response", () => {
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

    const response = await attachAdminEntitySourceResponse(
      jsonRequest({ sourceId }),
      entityId
    );

    expect(response.status).toBe(401);
    expect(mocks.attachAdminEntitySource).not.toHaveBeenCalled();
  });

  it("rejects a missing source id", async () => {
    const response = await attachAdminEntitySourceResponse(
      jsonRequest({}),
      entityId
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Invalid source link input.");
  });

  it("uses the entity id from the route, not the body", async () => {
    mocks.attachAdminEntitySource.mockResolvedValue({
      id: entitySourceId,
      entityId,
      sourceId,
      claim: null,
      fieldName: null
    });

    const response = await attachAdminEntitySourceResponse(
      jsonRequest({
        sourceId,
        entityId: "00000000-0000-4000-8000-000000000666"
      }),
      entityId
    );

    expect(response.status).toBe(201);
    expect(mocks.attachAdminEntitySource).toHaveBeenCalledWith(
      expect.objectContaining({ entityId, sourceId }),
      { reviewerId: "dev-admin" }
    );
  });

  it("returns 409 when the link already exists", async () => {
    mocks.attachAdminEntitySource.mockResolvedValue(null);

    const response = await attachAdminEntitySourceResponse(
      jsonRequest({ sourceId }),
      entityId
    );
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body.error).toBe("This source is already linked to the entity.");
  });

  it("attaches a source with claim and field name", async () => {
    mocks.attachAdminEntitySource.mockResolvedValue({
      id: entitySourceId,
      entityId,
      sourceId,
      claim: "Top speed confirmed in trailer.",
      fieldName: "top_speed"
    });

    const response = await attachAdminEntitySourceResponse(
      jsonRequest({
        sourceId,
        claim: "Top speed confirmed in trailer.",
        fieldName: "top_speed"
      }),
      entityId
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.entitySource.claim).toBe("Top speed confirmed in trailer.");
  });
});

describe("admin entity source detach API response", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getDatabaseUrl.mockReturnValue("postgres://user:pass@host:5432/db");
    mocks.authorizeAdminRequest.mockReturnValue({
      ok: true,
      reviewerId: "dev-admin"
    });
  });

  it("returns 404 when the link is missing", async () => {
    mocks.detachAdminEntitySource.mockResolvedValue(null);

    const response = await detachAdminEntitySourceResponse(
      deleteRequest(),
      entitySourceId
    );

    expect(response.status).toBe(404);
  });

  it("detaches a link and passes the reviewer id", async () => {
    mocks.detachAdminEntitySource.mockResolvedValue({ id: entitySourceId });

    const response = await detachAdminEntitySourceResponse(
      deleteRequest(),
      entitySourceId
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.entitySource.id).toBe(entitySourceId);
    expect(mocks.detachAdminEntitySource).toHaveBeenCalledWith(entitySourceId, {
      reviewerId: "dev-admin"
    });
  });
});

function jsonRequest(body: unknown) {
  return new Request(
    `https://nexus.example/api/admin/entities/${entityId}/sources`,
    {
      method: "POST",
      body: JSON.stringify(body)
    }
  );
}

function deleteRequest() {
  return new Request(
    `https://nexus.example/api/admin/entity-sources/${entitySourceId}`,
    { method: "DELETE" }
  );
}
