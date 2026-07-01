import { z } from "zod";

import { recordStatusSchema } from "@/lib/validation/knowledge";

export const entityStatusUpdateSchema = z.object({
  status: recordStatusSchema
});

export type EntityStatusUpdateInput = z.infer<typeof entityStatusUpdateSchema>;

export function buildEntityStatusAuditEvent(input: {
  entityId: string;
  oldStatus: string;
  newStatus: string;
  reviewerId: string;
  changedAt?: Date;
}) {
  const changedAt = input.changedAt ?? new Date();

  return {
    tableName: "entities",
    recordId: input.entityId,
    previousData: { status: input.oldStatus },
    newData: {
      status: input.newStatus,
      reviewerId: input.reviewerId,
      changedAt: changedAt.toISOString()
    },
    changedFields: ["status"],
    changeReason: `Entity status changed from ${input.oldStatus} to ${input.newStatus}.`
  };
}
