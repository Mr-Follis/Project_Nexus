import { z } from "zod";

export const recordStatusSchema = z.enum([
  "draft",
  "published",
  "hidden",
  "archived"
]);

export const verificationStatusSchema = z.enum([
  "confirmed_official",
  "confirmed_gameplay",
  "community_verified",
  "likely",
  "speculative",
  "outdated",
  "rejected"
]);

export const sourceTypeSchema = z.enum([
  "official",
  "direct_gameplay",
  "trusted_community",
  "user_submission",
  "editorial_research",
  "third_party_article",
  "unknown"
]);

export const entityTypeSchema = z.enum([
  "region",
  "vehicle",
  "weapon",
  "mission",
  "character",
  "business",
  "property",
  "shop",
  "collectible",
  "achievement",
  "activity",
  "faction",
  "animal",
  "patch_note",
  "guide",
  "other"
]);

export const slugSchema = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase URL-safe slugs.");

export const gameInputSchema = z.object({
  title: z.string().min(1).max(160),
  slug: slugSchema,
  description: z.string().max(2000).optional(),
  releaseDate: z.string().date().optional(),
  platforms: z.array(z.string().min(1).max(80)).default([]),
  status: recordStatusSchema.default("draft")
});

export const sourceInputSchema = z.object({
  gameId: z.string().uuid().optional(),
  type: sourceTypeSchema,
  title: z.string().min(1).max(240).optional(),
  url: z.string().url().optional(),
  author: z.string().max(160).optional(),
  publishedAt: z.string().datetime().optional(),
  accessedAt: z.string().datetime().optional(),
  reliabilityScore: z.number().int().min(0).max(100).default(50),
  permissionNotes: z.string().max(2000).optional(),
  notes: z.string().max(4000).optional()
});

export const entityInputSchema = z.object({
  gameId: z.string().uuid(),
  type: entityTypeSchema,
  name: z.string().min(1).max(200),
  slug: slugSchema,
  summary: z.string().max(1000).optional(),
  description: z.string().max(6000).optional(),
  status: recordStatusSchema.default("draft"),
  verification: verificationStatusSchema.default("speculative"),
  confidenceScore: z.number().int().min(0).max(100).default(0),
  lastVerifiedAt: z.string().datetime().optional()
});

export const entitySourceInputSchema = z.object({
  entityId: z.string().uuid(),
  sourceId: z.string().uuid(),
  claim: z.string().max(2000).optional(),
  fieldName: z.string().max(120).optional()
});

export type GameInput = z.input<typeof gameInputSchema>;
export type SourceInput = z.input<typeof sourceInputSchema>;
export type EntityInput = z.input<typeof entityInputSchema>;
export type EntitySourceInput = z.input<typeof entitySourceInputSchema>;
