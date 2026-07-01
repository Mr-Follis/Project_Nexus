import { env } from "@/lib/config/env";

const adminTokenCookieName = "nexus_admin_token";

export type AdminAuthResult =
  | { ok: true; reviewerId: string }
  | { ok: false; status: 401 | 503; error: string; configured: boolean };

export function getAdminTokenCookieName() {
  return adminTokenCookieName;
}

export function isAdminAuthConfigured() {
  return Boolean(env.ADMIN_ACCESS_TOKEN);
}

export function getAdminReviewerId() {
  return env.ADMIN_REVIEWER_ID;
}

export function isAdminTokenValid(token: string | null | undefined) {
  return Boolean(env.ADMIN_ACCESS_TOKEN && token === env.ADMIN_ACCESS_TOKEN);
}

export function authorizeAdminRequest(request: Request): AdminAuthResult {
  if (!isAdminAuthConfigured()) {
    return {
      ok: false,
      status: 503,
      configured: false,
      error: "Admin access is not configured."
    };
  }

  const headerToken = getAdminTokenFromHeaders(request.headers);

  if (!isAdminTokenValid(headerToken)) {
    return {
      ok: false,
      status: 401,
      configured: true,
      error: "Admin access is required."
    };
  }

  return {
    ok: true,
    reviewerId: getAdminReviewerId()
  };
}

function getAdminTokenFromHeaders(headers: Headers) {
  const explicitToken = headers.get("x-admin-token");

  if (explicitToken) {
    return explicitToken;
  }

  const authorization = headers.get("authorization");

  if (authorization?.toLowerCase().startsWith("bearer ")) {
    return authorization.slice("bearer ".length).trim();
  }

  return null;
}
