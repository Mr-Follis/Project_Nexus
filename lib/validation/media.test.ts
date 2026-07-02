import { describe, expect, it } from "vitest";

import {
  mediaAssetCreateSchema,
  mediaAssetInputSchema,
  resolveMediaAttribution
} from "./media";

const gameId = "00000000-0000-4000-8000-000000000001";

describe("media asset validation", () => {
  it("requires a filePath or externalUrl", () => {
    expect(() =>
      mediaAssetInputSchema.parse({
        gameId,
        type: "screenshot",
        title: "Untitled"
      })
    ).toThrow();
  });

  it("requires attribution metadata for official promotional media", () => {
    expect(() =>
      mediaAssetInputSchema.parse({
        gameId,
        type: "promotional_image",
        title: "Official still",
        provenance: "official_promotional",
        filePath: "/media/official.jpg"
      })
    ).toThrow();

    expect(
      mediaAssetInputSchema.parse({
        gameId,
        type: "promotional_image",
        title: "Official still",
        provenance: "official_promotional",
        filePath: "/media/official.jpg",
        copyrightOwner: "Rockstar Games / Take-Two Interactive",
        sourceName: "Rockstar Games"
      }).provenance
    ).toBe("official_promotional");
  });

  it("defaults provenance to placeholder and status to draft", () => {
    const parsed = mediaAssetInputSchema.parse({
      gameId,
      type: "artwork",
      title: "Placeholder",
      filePath: "/images/placeholder.png"
    });

    expect(parsed.provenance).toBe("placeholder");
    expect(parsed.status).toBe("draft");
    expect(parsed.attributionRequired).toBe(true);
  });
});

describe("media asset create validation", () => {
  it("rejects a status field so creates always start as drafts", () => {
    const result = mediaAssetCreateSchema.safeParse({
      gameId,
      type: "artwork",
      title: "Placeholder",
      filePath: "/images/placeholder.png",
      status: "published"
    });

    expect(result.success).toBe(false);
  });

  it("keeps the file/url and official-attribution rules", () => {
    expect(
      mediaAssetCreateSchema.safeParse({
        gameId,
        type: "artwork",
        title: "No file"
      }).success
    ).toBe(false);

    expect(
      mediaAssetCreateSchema.safeParse({
        gameId,
        type: "promotional_image",
        title: "Official still",
        provenance: "official_promotional",
        filePath: "/media/official.jpg"
      }).success
    ).toBe(false);

    expect(
      mediaAssetCreateSchema.safeParse({
        gameId,
        type: "promotional_image",
        title: "Official still",
        provenance: "official_promotional",
        filePath: "/media/official.jpg",
        copyrightOwner: "Rockstar Games / Take-Two Interactive",
        sourceName: "Rockstar Games"
      }).success
    ).toBe(true);
  });

  it("accepts explicit false for defaulted booleans", () => {
    const parsed = mediaAssetCreateSchema.parse({
      gameId,
      type: "artwork",
      title: "Original art",
      provenance: "project_nexus_original",
      filePath: "/images/original.png",
      attributionRequired: false,
      isFeatured: false
    });

    expect(parsed.attributionRequired).toBe(false);
    expect(parsed.isFeatured).toBe(false);
  });
});

describe("resolveMediaAttribution", () => {
  const base = {
    provenance: "official_promotional",
    attributionRequired: true
  };

  it("returns null when attribution is not required", () => {
    expect(
      resolveMediaAttribution({ ...base, attributionRequired: false })
    ).toBeNull();
  });

  it("prefers explicit attribution text", () => {
    expect(
      resolveMediaAttribution({
        ...base,
        attributionText: "Courtesy of Rockstar Games.",
        copyrightOwner: "Rockstar Games"
      })
    ).toBe("Courtesy of Rockstar Games.");
  });

  it("composes owner and source when no explicit text is set", () => {
    expect(
      resolveMediaAttribution({
        ...base,
        copyrightOwner: "Rockstar Games / Take-Two Interactive",
        sourceName: "Rockstar Games"
      })
    ).toBe("© Rockstar Games / Take-Two Interactive. Via Rockstar Games.");
  });

  it("falls back to Project Nexus credit for original media", () => {
    expect(
      resolveMediaAttribution({
        provenance: "project_nexus_original",
        attributionRequired: true
      })
    ).toBe("© Project Nexus.");
  });
});
