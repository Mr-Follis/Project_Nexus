import { describe, expect, it } from "vitest";

import {
  buildModerationAuditEvent,
  getAllowedModerationStatuses,
  isValidModerationTransition,
  moderationUpdateSchema
} from "./moderation";

describe("moderation validation", () => {
  it("accepts valid moderation update payloads", () => {
    expect(
      moderationUpdateSchema.parse({
        status: "needs_more_info",
        moderatorNotes: "Needs a stronger source."
      })
    ).toEqual({
      status: "needs_more_info",
      moderatorNotes: "Needs a stronger source."
    });
  });

  it("requires a status or note", () => {
    expect(() => moderationUpdateSchema.parse({})).toThrow();
  });

  it("rejects unsupported statuses", () => {
    expect(() =>
      moderationUpdateSchema.parse({ status: "published" })
    ).toThrow();
  });

  it("lists safe transitions for new submissions", () => {
    expect(getAllowedModerationStatuses("new")).toEqual([
      "needs_more_info",
      "duplicate",
      "approved",
      "rejected",
      "spam"
    ]);
  });

  it("keeps approved submissions terminal except idempotent updates", () => {
    expect(isValidModerationTransition("approved", "approved")).toBe(true);
    expect(isValidModerationTransition("approved", "rejected")).toBe(false);
  });

  it("allows reopening rejected submissions for review", () => {
    expect(isValidModerationTransition("rejected", "new")).toBe(true);
  });

  it("builds moderation audit events", () => {
    expect(
      buildModerationAuditEvent({
        submissionId: "00000000-0000-4000-8000-000000000005",
        oldStatus: "new",
        newStatus: "needs_more_info",
        reviewerId: "dev-admin",
        note: "Needs an official source.",
        changedAt: new Date("2026-07-01T00:00:00.000Z")
      })
    ).toEqual({
      tableName: "submissions",
      recordId: "00000000-0000-4000-8000-000000000005",
      previousData: { status: "new" },
      newData: {
        status: "needs_more_info",
        reviewerId: "dev-admin",
        note: "Needs an official source.",
        changedAt: "2026-07-01T00:00:00.000Z"
      },
      changedFields: ["status"],
      changeReason: "Needs an official source."
    });
  });
});
