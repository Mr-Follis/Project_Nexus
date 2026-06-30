import { describe, expect, it } from "vitest";

import {
  entityInputSchema,
  entitySourceInputSchema,
  gameInputSchema,
  sourceInputSchema
} from "./knowledge";

const gameId = "00000000-0000-4000-8000-000000000001";
const entityId = "00000000-0000-4000-8000-000000000002";
const sourceId = "00000000-0000-4000-8000-000000000003";

describe("knowledge validation schemas", () => {
  it("applies safe defaults to draft game input", () => {
    const game = gameInputSchema.parse({
      title: "Grand Theft Auto VI",
      slug: "gta-6"
    });

    expect(game).toEqual({
      title: "Grand Theft Auto VI",
      slug: "gta-6",
      platforms: [],
      status: "draft"
    });
  });

  it("rejects non URL-safe slugs", () => {
    const result = gameInputSchema.safeParse({
      title: "Grand Theft Auto VI",
      slug: "GTA VI"
    });

    expect(result.success).toBe(false);
  });

  it("keeps source reliability bounded and defaults to neutral", () => {
    const source = sourceInputSchema.parse({
      gameId,
      type: "official",
      url: "https://www.rockstargames.com/VI"
    });

    expect(source.reliabilityScore).toBe(50);
    expect(
      sourceInputSchema.safeParse({
        gameId,
        type: "official",
        reliabilityScore: 101
      }).success
    ).toBe(false);
  });

  it("defaults entity verification to speculative with zero confidence", () => {
    const entity = entityInputSchema.parse({
      gameId,
      type: "vehicle",
      name: "Draft Vehicle",
      slug: "draft-vehicle"
    });

    expect(entity.status).toBe("draft");
    expect(entity.verification).toBe("speculative");
    expect(entity.confidenceScore).toBe(0);
  });

  it("requires UUID links for entity-source attachments", () => {
    const valid = entitySourceInputSchema.safeParse({
      entityId,
      sourceId,
      fieldName: "summary"
    });

    const invalid = entitySourceInputSchema.safeParse({
      entityId: "draft-vehicle",
      sourceId,
      fieldName: "summary"
    });

    expect(valid.success).toBe(true);
    expect(invalid.success).toBe(false);
  });
});
