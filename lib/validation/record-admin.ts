import { z } from "zod";

import {
  entityInputSchema,
  entityTypeSchema,
  gameInputSchema,
  slugSchema,
  sourceInputSchema,
  sourceTypeSchema,
  verificationStatusSchema
} from "@/lib/validation/knowledge";

// Admin create forms never set a status: every record starts as a draft and
// reaches `published` only through the audited status actions. Strict mode
// rejects a smuggled `status` field instead of silently stripping it.
export const gameCreateSchema = gameInputSchema.omit({ status: true }).strict();
export const entityCreateSchema = entityInputSchema
  .omit({
    status: true,
    lastVerifiedAt: true
  })
  .strict();
export const sourceCreateSchema = sourceInputSchema;

function hasAtLeastOneField(value: Record<string, unknown>) {
  return Object.values(value).some((field) => field !== undefined);
}

const atLeastOneField = {
  message: "Provide at least one field to update."
};

// Optional text-like fields accept null so an editor can clear an existing
// value; required fields (title, slug, type, ...) never do.
export const gameEditSchema = z
  .object({
    title: z.string().min(1).max(160).optional(),
    slug: slugSchema.optional(),
    description: z.string().max(2000).nullable().optional(),
    releaseDate: z.string().date().nullable().optional(),
    platforms: z.array(z.string().min(1).max(80)).optional()
  })
  .refine(hasAtLeastOneField, atLeastOneField);

export const entityEditSchema = z
  .object({
    type: entityTypeSchema.optional(),
    name: z.string().min(1).max(200).optional(),
    slug: slugSchema.optional(),
    summary: z.string().max(1000).nullable().optional(),
    description: z.string().max(6000).nullable().optional(),
    verification: verificationStatusSchema.optional(),
    confidenceScore: z.number().int().min(0).max(100).optional()
  })
  .refine(hasAtLeastOneField, atLeastOneField);

export const sourceEditSchema = z
  .object({
    type: sourceTypeSchema.optional(),
    title: z.string().min(1).max(240).nullable().optional(),
    url: z.string().url().nullable().optional(),
    author: z.string().max(160).nullable().optional(),
    publishedAt: z.string().datetime().nullable().optional(),
    accessedAt: z.string().datetime().nullable().optional(),
    reliabilityScore: z.number().int().min(0).max(100).optional(),
    permissionNotes: z.string().max(2000).nullable().optional(),
    notes: z.string().max(4000).nullable().optional()
  })
  .refine(hasAtLeastOneField, atLeastOneField);

export type GameCreateInput = z.infer<typeof gameCreateSchema>;
export type GameEditInput = z.infer<typeof gameEditSchema>;
export type EntityCreateInput = z.infer<typeof entityCreateSchema>;
export type EntityEditInput = z.infer<typeof entityEditSchema>;
export type SourceCreateInput = z.infer<typeof sourceCreateSchema>;
export type SourceEditInput = z.infer<typeof sourceEditSchema>;

/**
 * Compares validated update input against the current record and returns only
 * the fields that actually change, ready for the audit event. Dates and
 * arrays are normalised so an unchanged prefilled form field is not recorded
 * as a change.
 */
export function diffRecordFields(
  current: Record<string, unknown>,
  updates: Record<string, unknown>
) {
  const changedFields: string[] = [];
  const previousData: Record<string, unknown> = {};
  const newData: Record<string, unknown> = {};

  for (const [field, value] of Object.entries(updates)) {
    if (value === undefined) {
      continue;
    }

    const before = current[field];

    if (normalizeFieldValue(before) === normalizeFieldValue(value)) {
      continue;
    }

    changedFields.push(field);
    previousData[field] = before ?? null;
    newData[field] = value;
  }

  return { changedFields, previousData, newData };
}

function normalizeFieldValue(value: unknown) {
  if (value === undefined || value === null) {
    return null;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value) || typeof value === "object") {
    return JSON.stringify(value);
  }

  return value;
}

export function buildRecordCreateAuditEvent(input: {
  tableName: string;
  recordId: string;
  data: Record<string, unknown>;
  reviewerId: string;
  changedAt?: Date;
}) {
  const changedAt = input.changedAt ?? new Date();
  const changedFields = Object.keys(input.data).filter(
    (field) => input.data[field] !== undefined
  );

  return {
    tableName: input.tableName,
    recordId: input.recordId,
    previousData: null,
    newData: {
      ...input.data,
      reviewerId: input.reviewerId,
      changedAt: changedAt.toISOString()
    },
    changedFields,
    changeReason: `Created via admin.`
  };
}

export function buildRecordDeleteAuditEvent(input: {
  tableName: string;
  recordId: string;
  previousData: Record<string, unknown>;
  reviewerId: string;
  changedAt?: Date;
}) {
  const changedAt = input.changedAt ?? new Date();

  return {
    tableName: input.tableName,
    recordId: input.recordId,
    previousData: input.previousData,
    newData: {
      deleted: true,
      reviewerId: input.reviewerId,
      changedAt: changedAt.toISOString()
    },
    changedFields: Object.keys(input.previousData),
    changeReason: `Deleted via admin.`
  };
}

export function buildRecordEditAuditEvent(input: {
  tableName: string;
  recordId: string;
  previousData: Record<string, unknown>;
  newData: Record<string, unknown>;
  changedFields: string[];
  reviewerId: string;
  changedAt?: Date;
}) {
  const changedAt = input.changedAt ?? new Date();

  return {
    tableName: input.tableName,
    recordId: input.recordId,
    previousData: input.previousData,
    newData: {
      ...input.newData,
      reviewerId: input.reviewerId,
      changedAt: changedAt.toISOString()
    },
    changedFields: input.changedFields,
    changeReason: `Updated ${input.changedFields.join(", ")} via admin.`
  };
}
