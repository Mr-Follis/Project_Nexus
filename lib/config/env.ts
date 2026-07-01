import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url().optional(),
  ADMIN_ACCESS_TOKEN: z.string().min(16).optional(),
  ADMIN_REVIEWER_ID: z.string().trim().min(1).default("replit-admin"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SITE_NAME: z.string().default("Project Nexus")
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  ADMIN_ACCESS_TOKEN: process.env.ADMIN_ACCESS_TOKEN,
  ADMIN_REVIEWER_ID: process.env.ADMIN_REVIEWER_ID,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME
});
