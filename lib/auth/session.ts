import { cookies } from "next/headers";

import {
  getAdminReviewerId,
  getAdminTokenCookieName,
  isAdminAuthConfigured,
  isAdminTokenValid
} from "@/lib/auth/admin";

export type AdminSession =
  | { authenticated: true; configured: true; reviewerId: string }
  | { authenticated: false; configured: boolean };

/**
 * Resolves the current admin session from the request cookie for server
 * components. Returns `configured: false` when no `ADMIN_ACCESS_TOKEN` is set
 * so the UI can distinguish "locked" from "not set up yet".
 */
export function getAdminSession(): AdminSession {
  if (!isAdminAuthConfigured()) {
    return { authenticated: false, configured: false };
  }

  const token = cookies().get(getAdminTokenCookieName())?.value ?? null;

  if (!isAdminTokenValid(token)) {
    return { authenticated: false, configured: true };
  }

  return {
    authenticated: true,
    configured: true,
    reviewerId: getAdminReviewerId()
  };
}
