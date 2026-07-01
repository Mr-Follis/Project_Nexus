import { describe, expect, it } from "vitest";

import {
  buildModerationAuditEvent,
  buildSubmissionEntityAuditEvent,
  buildSubmissionEntityDraft,
  getAllowedModerationStatuses,
  isValidModerationTransition,
  moderationUpdateSchema,
  resolveSubmissionEntityType,
  shouldCreateEntityFromApproval,
  slugifyForSubmission
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

describe("approval-to-record", () => {
  it("maps known submission types onto entity types, tolerating plurals and case", () => {
    expect(resolveSubmissionEntityType("vehicle")).toBe("vehicle");
    expect(resolveSubmissionEntityType("Weapons")).toBe("weapon");
    expect(resolveSubmissionEntityType("  Missions ")).toBe("mission");
  });

  it("falls back to 'other' for unrecognised submission types", () => {
    expect(resolveSubmissionEntityType("evidence")).toBe("other");
    expect(resolveSubmissionEntityType("")).toBe("other");
  });

  it("slugifies titles into URL-safe slugs", () => {
    expect(slugifyForSubmission("Rockstar's New Muscle Car!")).toBe(
      "rockstar-s-new-muscle-car"
    );
    expect(slugifyForSubmission("   ")).toBe("submission");
  });

  it("builds an unpublished, speculative draft entity from a submission", () => {
    const draft = buildSubmissionEntityDraft({
      gameId: "00000000-0000-4000-8000-000000000001",
      submissionType: "vehicles",
      title: "Vice City Cheetah",
      description: "A fast sports car seen in trailer two."
    });

    expect(draft).toEqual({
      gameId: "00000000-0000-4000-8000-000000000001",
      type: "vehicle",
      name: "Vice City Cheetah",
      slug: "vice-city-cheetah",
      summary: "A fast sports car seen in trailer two.",
      description: "A fast sports car seen in trailer two.",
      status: "draft",
      verification: "speculative",
      confidenceScore: 0
    });
  });

  it("omits summary/description when the submission has no description", () => {
    const draft = buildSubmissionEntityDraft({
      gameId: "00000000-0000-4000-8000-000000000001",
      submissionType: "mystery",
      title: "Unknown Landmark",
      description: null
    });

    expect(draft.type).toBe("other");
    expect(draft.summary).toBeUndefined();
    expect(draft.description).toBeUndefined();
  });

  it("only creates an entity on the first transition into approved", () => {
    expect(
      shouldCreateEntityFromApproval({
        currentStatus: "new",
        nextStatus: "approved",
        hasProposedEntity: false
      })
    ).toBe(true);

    expect(
      shouldCreateEntityFromApproval({
        currentStatus: "approved",
        nextStatus: "approved",
        hasProposedEntity: true
      })
    ).toBe(false);

    expect(
      shouldCreateEntityFromApproval({
        currentStatus: "new",
        nextStatus: "approved",
        hasProposedEntity: true
      })
    ).toBe(false);

    expect(
      shouldCreateEntityFromApproval({
        currentStatus: "new",
        nextStatus: "rejected",
        hasProposedEntity: false
      })
    ).toBe(false);
  });

  it("builds an entity-creation audit event", () => {
    expect(
      buildSubmissionEntityAuditEvent({
        entityId: "00000000-0000-4000-8000-000000000009",
        submissionId: "00000000-0000-4000-8000-000000000005",
        reviewerId: "dev-admin",
        changedAt: new Date("2026-07-01T00:00:00.000Z")
      })
    ).toEqual({
      tableName: "entities",
      recordId: "00000000-0000-4000-8000-000000000009",
      previousData: null,
      newData: {
        status: "draft",
        createdFromSubmissionId: "00000000-0000-4000-8000-000000000005",
        reviewerId: "dev-admin",
        changedAt: "2026-07-01T00:00:00.000Z"
      },
      changedFields: ["status"],
      changeReason:
        "Draft entity created from approved submission 00000000-0000-4000-8000-000000000005."
    });
  });
});
