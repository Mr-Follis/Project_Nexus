import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createAdminGameResponse,
  editAdminGameResponse,
  updateAdminGameStatusResponse
} from "./admin-games";

const mocks = vi.hoisted(() => ({
  getDatabaseUrl: vi.fn(),
  updateGameStatus: vi.fn(),
  createAdminGame: vi.fn(),
  updateAdminGame: vi.fn(),
  authorizeAdminRequest: vi.fn()
}));

vi.mock("@/lib/db/client", () => ({
  getDatabaseUrl: mocks.getDatabaseUrl
}));

vi.mock("@/lib/db/repositories/knowledge", () => ({
  updateGameStatus: mocks.updateGameStatus,
  createAdminGame: mocks.createAdminGame,
  updateAdminGame: mocks.updateAdminGame
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

describe("admin game create API response", () => {
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

    const response = await createAdminGameResponse(jsonRequest({}, "POST"));

    expect(response.status).toBe(401);
    expect(mocks.createAdminGame).not.toHaveBeenCalled();
  });

  it("rejects invalid game input", async () => {
    const response = await createAdminGameResponse(
      jsonRequest({ title: "GTA VI", slug: "Not A Slug" }, "POST")
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Invalid game input.");
  });

  it("creates a draft game and passes the reviewer id", async () => {
    mocks.createAdminGame.mockResolvedValue({
      id: gameId,
      title: "GTA VI",
      slug: "gta-6",
      status: "draft"
    });

    const response = await createAdminGameResponse(
      jsonRequest({ title: "GTA VI", slug: "gta-6" }, "POST")
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.game.status).toBe("draft");
    expect(mocks.createAdminGame).toHaveBeenCalledWith(
      expect.objectContaining({ title: "GTA VI", slug: "gta-6" }),
      { reviewerId: "dev-admin" }
    );
  });

  it("maps unique violations to a conflict response", async () => {
    mocks.createAdminGame.mockRejectedValue(
      Object.assign(new Error("duplicate key"), { code: "23505" })
    );

    const response = await createAdminGameResponse(
      jsonRequest({ title: "GTA VI", slug: "gta-6" }, "POST")
    );

    expect(response.status).toBe(409);
  });
});

describe("admin game edit API response", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getDatabaseUrl.mockReturnValue("postgres://user:pass@host:5432/db");
    mocks.authorizeAdminRequest.mockReturnValue({
      ok: true,
      reviewerId: "dev-admin"
    });
  });

  it("rejects an empty update", async () => {
    const response = await editAdminGameResponse(
      jsonRequest({}, "PUT"),
      gameId
    );

    expect(response.status).toBe(400);
    expect(mocks.updateAdminGame).not.toHaveBeenCalled();
  });

  it("returns 404 when the game is missing", async () => {
    mocks.updateAdminGame.mockResolvedValue(null);

    const response = await editAdminGameResponse(
      jsonRequest({ title: "Renamed" }, "PUT"),
      gameId
    );

    expect(response.status).toBe(404);
  });

  it("updates fields and passes the reviewer id", async () => {
    mocks.updateAdminGame.mockResolvedValue({
      id: gameId,
      title: "Renamed",
      slug: "gta-6",
      status: "draft"
    });

    const response = await editAdminGameResponse(
      jsonRequest({ title: "Renamed", platforms: ["PS5"] }, "PUT"),
      gameId
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.game.title).toBe("Renamed");
    expect(mocks.updateAdminGame).toHaveBeenCalledWith(
      gameId,
      { title: "Renamed", platforms: ["PS5"] },
      { reviewerId: "dev-admin" }
    );
  });
});

function jsonRequest(body: unknown, method = "PATCH") {
  return new Request(`https://nexus.example/api/admin/games/${gameId}`, {
    method,
    body: JSON.stringify(body)
  });
}
