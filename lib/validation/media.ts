import { z } from "zod";

import { mediaProvenance, mediaType } from "@/db/schema";
import { recordStatusSchema } from "@/lib/validation/knowledge";

export const mediaTypeSchema = z.enum(mediaType.enumValues);
export const mediaProvenanceSchema = z.enum(mediaProvenance.enumValues);

const mediaAssetBaseSchema = z.object({
  gameId: z.string().uuid(),
  entityId: z.string().uuid().optional(),
  type: mediaTypeSchema,
  provenance: mediaProvenanceSchema.default("placeholder"),
  title: z.string().min(1).max(200),
  caption: z.string().max(600).optional(),
  altText: z.string().max(300).optional(),
  filePath: z.string().min(1).max(500).optional(),
  externalUrl: z.string().url().optional(),
  sourceName: z.string().max(200).optional(),
  copyrightOwner: z.string().max(200).optional(),
  originalUrl: z.string().url().optional(),
  attributionRequired: z.boolean().default(true),
  attributionText: z.string().max(400).optional(),
  width: z.number().int().positive().max(20000).optional(),
  height: z.number().int().positive().max(20000).optional(),
  isFeatured: z.boolean().default(false),
  status: recordStatusSchema.default("draft")
});

function hasFileOrUrl(input: { filePath?: string; externalUrl?: string }) {
  return Boolean(input.filePath || input.externalUrl);
}

function hasOfficialAttribution(input: {
  provenance: string;
  copyrightOwner?: string;
  sourceName?: string;
  originalUrl?: string;
}) {
  return (
    input.provenance !== "official_promotional" ||
    Boolean(input.copyrightOwner && (input.sourceName || input.originalUrl))
  );
}

const fileOrUrlRule = {
  message: "Provide a filePath or an externalUrl for the asset."
};

const officialAttributionRule = {
  message:
    "Official promotional media requires a copyright owner and a source name or original URL."
};

export const mediaAssetInputSchema = mediaAssetBaseSchema
  .refine(hasFileOrUrl, fileOrUrlRule)
  .refine(hasOfficialAttribution, officialAttributionRule);

// Admin creates never set a status: assets start as drafts and are published
// through the audited status actions. Strict mode rejects a smuggled status.
export const mediaAssetCreateSchema = mediaAssetBaseSchema
  .omit({ status: true })
  .strict()
  .refine(hasFileOrUrl, fileOrUrlRule)
  .refine(hasOfficialAttribution, officialAttributionRule);

export type MediaType = z.infer<typeof mediaTypeSchema>;
export type MediaProvenance = z.infer<typeof mediaProvenanceSchema>;
export type MediaAssetInput = z.infer<typeof mediaAssetInputSchema>;
export type MediaAssetCreateInput = z.infer<typeof mediaAssetCreateSchema>;

/**
 * Derives the attribution line shown alongside an asset. Explicit
 * `attributionText` wins; otherwise it is composed from the copyright owner and
 * source so official media never renders without required credit.
 */
export function resolveMediaAttribution(asset: {
  provenance: string;
  attributionRequired: boolean;
  attributionText?: string | null;
  copyrightOwner?: string | null;
  sourceName?: string | null;
}): string | null {
  if (!asset.attributionRequired) {
    return null;
  }

  if (asset.attributionText) {
    return asset.attributionText;
  }

  if (asset.copyrightOwner) {
    return asset.sourceName
      ? `© ${asset.copyrightOwner}. Via ${asset.sourceName}.`
      : `© ${asset.copyrightOwner}.`;
  }

  if (asset.provenance === "project_nexus_original") {
    return "© Project Nexus.";
  }

  return null;
}
