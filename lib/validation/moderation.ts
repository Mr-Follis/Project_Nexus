import { z } from "zod";

import { submissionStatus } from "@/db/schema";

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
    changeReason: input.note ?? `Moderation status changed from ${input.oldStatus} to ${input.newStatus}.`
  };
}
