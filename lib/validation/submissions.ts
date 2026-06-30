import { z } from "zod";

export const submissionInputSchema = z.object({
  gameSlug: z.string().trim().min(1).max(120),
  type: z.string().trim().min(1).max(80),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(4000).optional(),
  evidenceUrl: z.string().trim().url().optional(),
  screenshotUrl: z.string().trim().url().optional()
});

export type SubmissionInput = z.infer<typeof submissionInputSchema>;
