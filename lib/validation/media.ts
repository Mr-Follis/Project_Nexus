import { z } from "zod";

import { mediaProvenance, mediaType } from "@/db/schema";
import { recordStatusSchema } from "@/lib/validation/knowledge";

export const mediaTypeSchema = z.enum(mediaType.enumValues);
export const mediaProvenanceSchema = z.enum(mediaProvenance.enumValues);

export const mediaAssetInputSchema = z
  .object({
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
  })
  .refine((input) => input.filePath || input.externalUrl, {
    message: "Provide a filePath or an externalUrl for the asset."
  })
  .refine(
    (input) =>
      input.provenance !== "official_promotional" ||
      Boolean(input.copyrightOwner && (input.sourceName || input.originalUrl)),
    {
      message:
        "Official promotional media requires a copyright owner and a source name or original URL."
    }
  );

export type MediaType = z.infer<typeof mediaTypeSchema>;
export type MediaProvenance = z.infer<typeof mediaProvenanceSchema>;
export type MediaAssetInput = z.infer<typeof mediaAssetInputSchema>;

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
