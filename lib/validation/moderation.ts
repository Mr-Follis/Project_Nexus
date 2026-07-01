import { z } from "zod";

import { submissionStatus } from "@/db/schema";
import { entityTypeSchema, type EntityInput } from "@/lib/validation/knowledge";

export const moderationStatusSchema = z.enum(submissionStatus.enumValues);

export const moderationUpdateSchema = z
  .object({
    status: moderationStatusSchema.optional(),
    moderatorNotes: z.string().trim().max(2000).optional()
  })
  .refine((input) => input.status || input.moderatorNotes !== undefined, {
    message: "Provide a status or moderator notes."
  });

export type ModerationStatus = z.infer<typeof moderationStatusSchema>;
export type ModerationUpdateInput = z.infer<typeof moderationUpdateSchema>;

const allowedTransitions = {
  new: ["needs_more_info", "duplicate", "approved", "rejected", "spam"],
  needs_more_info: ["new", "duplicate", "approved", "rejected", "spam"],
  duplicate: ["new", "rejected"],
  approved: [],
  rejected: ["new"],
  spam: ["new", "rejected"]
} satisfies Record<ModerationStatus, ModerationStatus[]>;

export function getAllowedModerationStatuses(status: ModerationStatus) {
  return allowedTransitions[status];
}

export function isValidModerationTransition(
  currentStatus: ModerationStatus,
  nextStatus: ModerationStatus
) {
  return (
    currentStatus === nextStatus ||
    (allowedTransitions[currentStatus] as readonly ModerationStatus[]).includes(
      nextStatus
    )
  );
}

export type ModerationAuditInput = {
  submissionId: string;
  oldStatus: ModerationStatus;
  newStatus: ModerationStatus;
  reviewerId: string;
  note?: string | null;
  changedAt?: Date;
};

export function buildModerationAuditEvent(input: ModerationAuditInput) {
  const changedAt = input.changedAt ?? new Date();

  return {
    tableName: "submissions",
    recordId: input.submissionId,
    previousData: {
      status: input.oldStatus
    },
    newData: {
      status: input.newStatus,
      reviewerId: input.reviewerId,
      note: input.note ?? null,
      changedAt: changedAt.toISOString()
    },
    changedFields:
      input.oldStatus === input.newStatus ? ["moderator_notes"] : ["status"],
    changeReason:
      input.note ??
      `Moderation status changed from ${input.oldStatus} to ${input.newStatus}.`
  };
}

type EntityDraftType = (typeof entityTypeSchema.options)[number];

/**
 * Maps a free-text submission type (e.g. "vehicles", "Weapon") onto a known
 * entity type, falling back to "other" when nothing matches so approval never
 * fails on an unexpected value.
 */
export function resolveSubmissionEntityType(
  submissionType: string
): EntityDraftType {
  const normalized = submissionType.trim().toLowerCase();
  const singular = normalized.endsWith("s")
    ? normalized.slice(0, -1)
    : normalized;

  return (
    entityTypeSchema.options.find(
      (value) => value === normalized || value === singular
    ) ?? "other"
  );
}

export function slugifyForSubmission(value: string) {
  const slug = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100)
    .replace(/-+$/g, "");

  return slug || "submission";
}

export type SubmissionEntitySource = {
  gameId: string;
  submissionType: string;
  title: string;
  description?: string | null;
};

/**
 * Builds the draft entity payload for an approved submission. The record is
 * always created as an unpublished `draft` with `speculative` verification so
 * approving a submission surfaces it for editorial review without exposing
 * unverified community content publicly.
 */
export function buildSubmissionEntityDraft(
  input: SubmissionEntitySource
): EntityInput {
  const description = input.description?.trim() || undefined;

  return {
    gameId: input.gameId,
    type: resolveSubmissionEntityType(input.submissionType),
    name: input.title.trim(),
    slug: slugifyForSubmission(input.title),
    summary: description ? description.slice(0, 1000) : undefined,
    description,
    status: "draft",
    verification: "speculative",
    confidenceScore: 0
  };
}

/**
 * Approval-to-record only fires when a submission first enters `approved` and
 * has no linked entity yet, keeping re-approvals idempotent.
 */
export function shouldCreateEntityFromApproval(input: {
  currentStatus: ModerationStatus;
  nextStatus: ModerationStatus;
  hasProposedEntity: boolean;
}) {
  return (
    input.nextStatus === "approved" &&
    input.currentStatus !== "approved" &&
    !input.hasProposedEntity
  );
}

export function buildSubmissionEntityAuditEvent(input: {
  entityId: string;
  submissionId: string;
  reviewerId: string;
  changedAt?: Date;
}) {
  const changedAt = input.changedAt ?? new Date();

  return {
    tableName: "entities",
    recordId: input.entityId,
    previousData: null,
    newData: {
      status: "draft",
      createdFromSubmissionId: input.submissionId,
      reviewerId: input.reviewerId,
      changedAt: changedAt.toISOString()
    },
    changedFields: ["status"],
    changeReason: `Draft entity created from approved submission ${input.submissionId}.`
  };
}
