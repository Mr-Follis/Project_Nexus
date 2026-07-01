import { describe, expect, it } from "vitest";

import {
  buildEntityStatusAuditEvent,
  entityStatusUpdateSchema
} from "./entity-admin";

describe("entity admin validation", () => {
  it("accepts known record statuses", () => {
    expect(entityStatusUpdateSchema.parse({ status: "published" })).toEqual({
      status: "published"
    });
  });

  it("rejects unknown statuses", () => {
    expect(() =>
      entityStatusUpdateSchema.parse({ status: "approved" })
    ).toThrow();
  });

  it("builds an entity status audit event", () => {
    expect(
      buildEntityStatusAuditEvent({
        entityId: "00000000-0000-4000-8000-000000000009",
        oldStatus: "draft",
        newStatus: "published",
        reviewerId: "dev-admin",
        changedAt: new Date("2026-07-01T00:00:00.000Z")
      })
    ).toEqual({
      tableName: "entities",
      recordId: "00000000-0000-4000-8000-000000000009",
      previousData: { status: "draft" },
      newData: {
        status: "published",
        reviewerId: "dev-admin",
        changedAt: "2026-07-01T00:00:00.000Z"
      },
      changedFields: ["status"],
      changeReason: "Entity status changed from draft to published."
    });
  });
});
