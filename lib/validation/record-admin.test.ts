import { describe, expect, it } from "vitest";

import {
  buildRecordCreateAuditEvent,
  buildRecordDeleteAuditEvent,
  buildRecordEditAuditEvent,
  diffRecordFields,
  entityCreateSchema,
  entityEditSchema,
  gameCreateSchema,
  gameEditSchema,
  sourceEditSchema
} from "./record-admin";

describe("gameCreateSchema", () => {
  it("accepts a minimal game and defaults platforms", () => {
    const parsed = gameCreateSchema.parse({ title: "GTA VI", slug: "gta-6" });

    expect(parsed.platforms).toEqual([]);
  });

  it("rejects a status field so creates always start as drafts", () => {
    const result = gameCreateSchema.safeParse({
      title: "GTA VI",
      slug: "gta-6",
      status: "published"
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid slugs", () => {
    const result = gameCreateSchema.safeParse({
      title: "GTA VI",
      slug: "Not A Slug"
    });

    expect(result.success).toBe(false);
  });
});

describe("entityCreateSchema", () => {
  it("defaults verification to speculative and confidence to zero", () => {
    const parsed = entityCreateSchema.parse({
      gameId: "00000000-0000-4000-8000-000000000031",
      type: "vehicle",
      name: "Vice City Cheetah",
      slug: "vice-city-cheetah"
    });

    expect(parsed.verification).toBe("speculative");
    expect(parsed.confidenceScore).toBe(0);
  });

  it("rejects a status field", () => {
    const result = entityCreateSchema.safeParse({
      gameId: "00000000-0000-4000-8000-000000000031",
      type: "vehicle",
      name: "Vice City Cheetah",
      slug: "vice-city-cheetah",
      status: "published"
    });

    expect(result.success).toBe(false);
  });
});

describe("edit schemas", () => {
  it("require at least one field", () => {
    expect(gameEditSchema.safeParse({}).success).toBe(false);
    expect(entityEditSchema.safeParse({}).success).toBe(false);
    expect(sourceEditSchema.safeParse({}).success).toBe(false);
  });

  it("accept partial updates without injecting defaults", () => {
    const parsed = sourceEditSchema.parse({ title: "Updated title" });

    expect(parsed).toEqual({ title: "Updated title" });
    expect(parsed.reliabilityScore).toBeUndefined();
  });

  it("bound entity confidence scores", () => {
    expect(entityEditSchema.safeParse({ confidenceScore: 101 }).success).toBe(
      false
    );
    expect(entityEditSchema.safeParse({ confidenceScore: 100 }).success).toBe(
      true
    );
  });
});

describe("diffRecordFields", () => {
  it("returns only fields whose values change", () => {
    const diff = diffRecordFields(
      { title: "GTA VI", slug: "gta-6", description: null },
      { title: "GTA VI", description: "New description" }
    );

    expect(diff.changedFields).toEqual(["description"]);
    expect(diff.previousData).toEqual({ description: null });
    expect(diff.newData).toEqual({ description: "New description" });
  });

  it("ignores undefined update values", () => {
    const diff = diffRecordFields(
      { title: "GTA VI" },
      { title: undefined, slug: "gta-6" }
    );

    expect(diff.changedFields).toEqual(["slug"]);
  });

  it("treats an unchanged Date prefilled as an ISO string as equal", () => {
    const publishedAt = new Date("2026-01-15T00:00:00.000Z");
    const diff = diffRecordFields(
      { publishedAt },
      { publishedAt: "2026-01-15T00:00:00.000Z" }
    );

    expect(diff.changedFields).toEqual([]);
  });

  it("treats unchanged arrays as equal", () => {
    const diff = diffRecordFields(
      { platforms: ["PS5", "Xbox"] },
      { platforms: ["PS5", "Xbox"] }
    );

    expect(diff.changedFields).toEqual([]);
  });
});

describe("audit event builders", () => {
  it("builds a create event with the reviewer id", () => {
    const event = buildRecordCreateAuditEvent({
      tableName: "games",
      recordId: "00000000-0000-4000-8000-000000000031",
      data: { title: "GTA VI", slug: "gta-6" },
      reviewerId: "dev-admin",
      changedAt: new Date("2026-07-02T00:00:00.000Z")
    });

    expect(event.tableName).toBe("games");
    expect(event.previousData).toBeNull();
    expect(event.changedFields).toEqual(["title", "slug"]);
    expect(event.newData).toMatchObject({
      title: "GTA VI",
      reviewerId: "dev-admin",
      changedAt: "2026-07-02T00:00:00.000Z"
    });
  });

  it("builds a delete event preserving the removed data", () => {
    const event = buildRecordDeleteAuditEvent({
      tableName: "entity_sources",
      recordId: "00000000-0000-4000-8000-000000000077",
      previousData: {
        entityId: "00000000-0000-4000-8000-000000000009",
        sourceId: "00000000-0000-4000-8000-000000000042"
      },
      reviewerId: "dev-admin"
    });

    expect(event.changeReason).toBe("Deleted via admin.");
    expect(event.previousData).toMatchObject({
      sourceId: "00000000-0000-4000-8000-000000000042"
    });
    expect(event.newData).toMatchObject({
      deleted: true,
      reviewerId: "dev-admin"
    });
    expect(event.changedFields).toEqual(["entityId", "sourceId"]);
  });

  it("builds an edit event naming the changed fields", () => {
    const event = buildRecordEditAuditEvent({
      tableName: "sources",
      recordId: "00000000-0000-4000-8000-000000000042",
      previousData: { reliabilityScore: 50 },
      newData: { reliabilityScore: 90 },
      changedFields: ["reliabilityScore"],
      reviewerId: "dev-admin"
    });

    expect(event.changeReason).toBe("Updated reliabilityScore via admin.");
    expect(event.previousData).toEqual({ reliabilityScore: 50 });
    expect(event.newData).toMatchObject({
      reliabilityScore: 90,
      reviewerId: "dev-admin"
    });
  });
});
