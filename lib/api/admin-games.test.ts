import { beforeEach, describe, expect, it, vi } from "vitest";

import { updateAdminGameStatusResponse } from "./admin-games";

const mocks = vi.hoisted(() => ({
  getDatabaseUrl: vi.fn(),
  updateGameStatus: vi.fn(),
  authorizeAdminRequest: vi.fn()
}));

vi.mock("@/lib/db/client", () => ({
  getDatabaseUrl: mocks.getDatabaseUrl
}));

vi.mock("@/lib/db/repositories/knowledge", () => ({
  updateGameStatus: mocks.updateGameStatus
}));

vi.mock("@/lib/auth/admin", () => ({
  authorizeAdminRequest: mocks.authorizeAdminRequest
}));

const gameId = "00000000-0000-4000-8000-000000000031";

describe("admin game status API response", () => {
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

    const response = await updateAdminGameStatusResponse(
      jsonRequest({ status: "published" }),
      gameId
    );

    expect(response.status).toBe(401);
    expect(mocks.updateGameStatus).not.toHaveBeenCalled();
  });

  it("rejects invalid statuses", async () => {
    const response = await updateAdminGameStatusResponse(
      jsonRequest({ status: "approved" }),
      gameId
    );

    expect(response.status).toBe(400);
  });

  it("returns 404 when the game is missing", async () => {
    mocks.updateGameStatus.mockResolvedValue(null);

    const response = await updateAdminGameStatusResponse(
      jsonRequest({ status: "published" }),
      gameId
    );

    expect(response.status).toBe(404);
  });

  it("publishes a game and passes the reviewer id", async () => {
    mocks.updateGameStatus.mockResolvedValue({
      id: gameId,
      title: "GTA VI",
      slug: "gta-6",
      status: "published"
    });

    const response = await updateAdminGameStatusResponse(
      jsonRequest({ status: "published" }),
      gameId
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.game.status).toBe("published");
    expect(mocks.updateGameStatus).toHaveBeenCalledWith(gameId, "published", {
      reviewerId: "dev-admin"
    });
  });
});

function jsonRequest(body: unknown) {
  return new Request(`https://nexus.example/api/admin/games/${gameId}`, {
    method: "PATCH",
    body: JSON.stringify(body)
  });
}
