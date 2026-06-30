import { beforeEach, describe, expect, it, vi } from "vitest";

import { getPublicMapMarkersResponse } from "./public-map";

const mocks = vi.hoisted(() => ({
  getDatabaseUrl: vi.fn(),
  getPublicGameBySlug: vi.fn(),
  listPublicMapMarkers: vi.fn()
}));

vi.mock("@/lib/db/client", () => ({
  getDatabaseUrl: mocks.getDatabaseUrl
}));

vi.mock("@/lib/db/repositories/knowledge", () => ({
  getPublicGameBySlug: mocks.getPublicGameBySlug,
  listPublicMapMarkers: mocks.listPublicMapMarkers
}));

describe("public map markers API response", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getDatabaseUrl.mockReturnValue(
      "postgres://user:pass@example.com:5432/db"
    );
  });

  it("returns a safe response when DATABASE_URL is missing", async () => {
    mocks.getDatabaseUrl.mockReturnValue(undefined);

    const response = await getPublicMapMarkersResponse(
      "gta-6",
      new URLSearchParams()
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.configured).toBe(false);
    expect(mocks.listPublicMapMarkers).not.toHaveBeenCalled();
  });

  it("returns 404 when the game is not published", async () => {
    mocks.getPublicGameBySlug.mockResolvedValue(null);

    const response = await getPublicMapMarkersResponse(
      "gta-6",
      new URLSearchParams()
    );
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error).toBe("Game not found.");
  });

  it("lists published markers for an existing game", async () => {
    mocks.getPublicGameBySlug.mockResolvedValue({
      id: "00000000-0000-4000-8000-000000000001",
      slug: "gta-6",
      status: "published"
    });
    mocks.listPublicMapMarkers.mockResolvedValue([
      {
        id: "00000000-0000-4000-8000-000000000004",
        markerType: "location",
        title: "Published Marker",
        status: "published"
      }
    ]);

    const response = await getPublicMapMarkersResponse(
      "gta-6",
      new URLSearchParams({ markerType: "location" })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.markers).toHaveLength(1);
    expect(mocks.listPublicMapMarkers).toHaveBeenCalledWith({
      gameId: "00000000-0000-4000-8000-000000000001",
      markerType: "location"
    });
  });
});
