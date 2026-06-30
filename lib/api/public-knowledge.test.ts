import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  getPublicEntitiesResponse,
  getPublicEntityResponse,
  getPublicGamesResponse
} from "./public-knowledge";

const mocks = vi.hoisted(() => ({
  getDatabaseUrl: vi.fn(),
  getPublicEntityBySlug: vi.fn(),
  getPublicGameBySlug: vi.fn(),
  listPublicEntities: vi.fn(),
  listPublicGames: vi.fn(),
  listSourcesForEntity: vi.fn()
}));

vi.mock("@/lib/db/client", () => ({
  getDatabaseUrl: mocks.getDatabaseUrl
}));

vi.mock("@/lib/db/repositories/knowledge", () => ({
  getPublicEntityBySlug: mocks.getPublicEntityBySlug,
  getPublicGameBySlug: mocks.getPublicGameBySlug,
  listPublicEntities: mocks.listPublicEntities,
  listPublicGames: mocks.listPublicGames,
  listSourcesForEntity: mocks.listSourcesForEntity
}));

describe("public knowledge API responses", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getDatabaseUrl.mockReturnValue(
      "postgres://user:pass@example.com:5432/db"
    );
  });

  it("returns a safe response when DATABASE_URL is missing", async () => {
    mocks.getDatabaseUrl.mockReturnValue(undefined);

    const response = await getPublicGamesResponse();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      ok: false,
      configured: false,
      error: "DATABASE_URL is not configured."
    });
    expect(mocks.listPublicGames).not.toHaveBeenCalled();
  });

  it("lists only public games through the repository", async () => {
    mocks.listPublicGames.mockResolvedValue([
      {
        id: "00000000-0000-4000-8000-000000000001",
        title: "Published Game",
        slug: "published-game",
        status: "published"
      }
    ]);

    const response = await getPublicGamesResponse();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.games).toHaveLength(1);
    expect(mocks.listPublicGames).toHaveBeenCalledOnce();
  });

  it("rejects unsupported entity type filters before querying entities", async () => {
    const response = await getPublicEntitiesResponse(
      "gta-6",
      new URLSearchParams({ type: "spaceship" })
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.error).toBe("Invalid request.");
    expect(mocks.getPublicGameBySlug).not.toHaveBeenCalled();
    expect(mocks.listPublicEntities).not.toHaveBeenCalled();
  });

  it("returns published entities for an existing published game", async () => {
    mocks.getPublicGameBySlug.mockResolvedValue({
      id: "00000000-0000-4000-8000-000000000001",
      title: "Grand Theft Auto VI",
      slug: "gta-6",
      status: "published"
    });
    mocks.listPublicEntities.mockResolvedValue([
      {
        id: "00000000-0000-4000-8000-000000000002",
        gameId: "00000000-0000-4000-8000-000000000001",
        type: "vehicle",
        name: "Published Vehicle",
        slug: "published-vehicle",
        status: "published"
      }
    ]);

    const response = await getPublicEntitiesResponse(
      "gta-6",
      new URLSearchParams({ type: "vehicle" })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.entities).toHaveLength(1);
    expect(mocks.listPublicEntities).toHaveBeenCalledWith({
      gameId: "00000000-0000-4000-8000-000000000001",
      type: "vehicle"
    });
  });

  it("returns 404 when a published entity detail is missing", async () => {
    mocks.getPublicGameBySlug.mockResolvedValue({
      id: "00000000-0000-4000-8000-000000000001",
      title: "Grand Theft Auto VI",
      slug: "gta-6",
      status: "published"
    });
    mocks.getPublicEntityBySlug.mockResolvedValue(null);

    const response = await getPublicEntityResponse("gta-6", "missing-entity");
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({
      ok: false,
      configured: true,
      error: "Entity not found."
    });
  });

  it("returns a published entity detail for an existing published game", async () => {
    mocks.getPublicGameBySlug.mockResolvedValue({
      id: "00000000-0000-4000-8000-000000000001",
      title: "Grand Theft Auto VI",
      slug: "gta-6",
      status: "published"
    });
    mocks.getPublicEntityBySlug.mockResolvedValue({
      id: "00000000-0000-4000-8000-000000000002",
      gameId: "00000000-0000-4000-8000-000000000001",
      type: "vehicle",
      name: "Published Vehicle",
      slug: "published-vehicle",
      status: "published"
    });
    mocks.listSourcesForEntity.mockResolvedValue([
      {
        source: {
          id: "00000000-0000-4000-8000-000000000003",
          type: "official",
          title: "Official source",
          url: "https://www.rockstargames.com/VI"
        },
        claim: "Official source link.",
        fieldName: "summary"
      }
    ]);

    const response = await getPublicEntityResponse(
      "gta-6",
      "published-vehicle"
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.entity.slug).toBe("published-vehicle");
    expect(body.sources).toHaveLength(1);
    expect(mocks.getPublicEntityBySlug).toHaveBeenCalledWith({
      gameId: "00000000-0000-4000-8000-000000000001",
      slug: "published-vehicle"
    });
    expect(mocks.listSourcesForEntity).toHaveBeenCalledWith(
      "00000000-0000-4000-8000-000000000002"
    );
  });
});
