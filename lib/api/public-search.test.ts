import { beforeEach, describe, expect, it, vi } from "vitest";

import { getPublicSearchResponse } from "./public-search";

const mocks = vi.hoisted(() => ({
  getDatabaseUrl: vi.fn(),
  getPublicGameBySlug: vi.fn(),
  searchPublicEntities: vi.fn()
}));

vi.mock("@/lib/db/client", () => ({
  getDatabaseUrl: mocks.getDatabaseUrl
}));

vi.mock("@/lib/db/repositories/knowledge", () => ({
  getPublicGameBySlug: mocks.getPublicGameBySlug,
  searchPublicEntities: mocks.searchPublicEntities
}));

describe("public search API response", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getDatabaseUrl.mockReturnValue(
      "postgres://user:pass@example.com:5432/db"
    );
  });

  it("returns a safe response when DATABASE_URL is missing", async () => {
    mocks.getDatabaseUrl.mockReturnValue(undefined);

    const response = await getPublicSearchResponse(
      new URLSearchParams({ q: "car" })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.configured).toBe(false);
    expect(mocks.searchPublicEntities).not.toHaveBeenCalled();
  });

  it("requires a useful search query", async () => {
    const response = await getPublicSearchResponse(
      new URLSearchParams({ q: "c" })
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Invalid search request.");
  });

  it("searches published entities across all games", async () => {
    mocks.searchPublicEntities.mockResolvedValue([
      {
        id: "00000000-0000-4000-8000-000000000002",
        name: "Published Vehicle",
        slug: "published-vehicle",
        status: "published"
      }
    ]);

    const response = await getPublicSearchResponse(
      new URLSearchParams({ q: "vehicle", limit: "5" })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.results).toHaveLength(1);
    expect(mocks.searchPublicEntities).toHaveBeenCalledWith({
      query: "vehicle",
      gameId: undefined,
      limit: 5
    });
  });

  it("scopes search to a published game when requested", async () => {
    mocks.getPublicGameBySlug.mockResolvedValue({
      id: "00000000-0000-4000-8000-000000000001",
      slug: "gta-6",
      status: "published"
    });
    mocks.searchPublicEntities.mockResolvedValue([]);

    const response = await getPublicSearchResponse(
      new URLSearchParams({ q: "vehicle", game: "gta-6" })
    );

    expect(response.status).toBe(200);
    expect(mocks.searchPublicEntities).toHaveBeenCalledWith({
      query: "vehicle",
      gameId: "00000000-0000-4000-8000-000000000001",
      limit: 20
    });
  });
});
