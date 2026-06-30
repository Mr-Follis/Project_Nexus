import { beforeEach, describe, expect, it, vi } from "vitest";

import { createPublicSubmissionResponse } from "./public-submissions";

const mocks = vi.hoisted(() => ({
  createSubmission: vi.fn(),
  getDatabaseUrl: vi.fn(),
  getGameBySlug: vi.fn()
}));

vi.mock("@/lib/db/client", () => ({
  getDatabaseUrl: mocks.getDatabaseUrl
}));

vi.mock("@/lib/db/repositories/knowledge", () => ({
  createSubmission: mocks.createSubmission,
  getGameBySlug: mocks.getGameBySlug
}));

describe("public submissions API response", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getDatabaseUrl.mockReturnValue(
      "postgres://user:pass@example.com:5432/db"
    );
  });

  it("returns 503 when DATABASE_URL is missing", async () => {
    mocks.getDatabaseUrl.mockReturnValue(undefined);

    const response = await createPublicSubmissionResponse(
      jsonRequest({
        gameSlug: "gta-6",
        type: "entity_correction",
        title: "Correction"
      })
    );
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body.configured).toBe(false);
    expect(mocks.createSubmission).not.toHaveBeenCalled();
  });

  it("rejects invalid submission payloads", async () => {
    const response = await createPublicSubmissionResponse(
      jsonRequest({
        gameSlug: "gta-6",
        type: "entity_correction",
        title: "",
        evidenceUrl: "not-a-url"
      })
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Invalid submission.");
  });

  it("returns 404 when the target game does not exist", async () => {
    mocks.getGameBySlug.mockResolvedValue(null);

    const response = await createPublicSubmissionResponse(
      jsonRequest({
        gameSlug: "gta-6",
        type: "entity_correction",
        title: "Correction"
      })
    );
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error).toBe("Game not found.");
  });

  it("creates a new moderation submission for an existing game", async () => {
    mocks.getGameBySlug.mockResolvedValue({
      id: "00000000-0000-4000-8000-000000000001",
      slug: "gta-6"
    });
    mocks.createSubmission.mockResolvedValue({
      id: "00000000-0000-4000-8000-000000000005",
      status: "new"
    });

    const response = await createPublicSubmissionResponse(
      jsonRequest({
        gameSlug: "gta-6",
        type: "entity_correction",
        title: "Correction",
        evidenceUrl: "https://example.com/source"
      })
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.submission).toEqual({
      id: "00000000-0000-4000-8000-000000000005",
      status: "new"
    });
    expect(mocks.createSubmission).toHaveBeenCalledWith({
      gameId: "00000000-0000-4000-8000-000000000001",
      submissionType: "entity_correction",
      title: "Correction",
      description: undefined,
      evidenceUrl: "https://example.com/source",
      screenshotUrl: undefined
    });
  });
});

function jsonRequest(body: unknown) {
  return new Request("https://nexus.example/api/submissions", {
    method: "POST",
    body: JSON.stringify(body)
  });
}
