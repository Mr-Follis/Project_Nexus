import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { authorizeAdminRequest, type AdminAuthResult } from "@/lib/auth/admin";
import { getDatabaseUrl } from "@/lib/db/client";

type AuthorizedAdmin = Extract<AdminAuthResult, { ok: true }>;

/**
 * Shared guard for admin mutation endpoints: authorizes the request, checks
 * database configuration, and maps validation/uniqueness failures to JSON
 * error responses so each endpoint only implements its happy path.
 */
export async function runAdminMutation(
  request: Request,
  invalidMessage: string,
  handler: (auth: AuthorizedAdmin) => Promise<NextResponse>
) {
  const auth = authorizeAdminRequest(request);

  if (!auth.ok) {
    return NextResponse.json(
      {
        ok: false,
        configured: auth.configured,
        error: auth.error
      },
      { status: auth.status }
    );
  }

  if (!getDatabaseUrl()) {
    return NextResponse.json(
      {
        ok: false,
        configured: false,
        error: "DATABASE_URL is not configured."
      },
      { status: 503 }
    );
  }

  try {
    return await handler(auth);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          ok: false,
          error: invalidMessage,
          issues: error.issues
        },
        { status: 400 }
      );
    }

    if (isUniqueViolation(error)) {
      return NextResponse.json(
        {
          ok: false,
          error: "A record with this slug or key already exists."
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Request failed."
      },
      { status: 400 }
    );
  }
}

function isUniqueViolation(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  if ("code" in error && (error as { code?: unknown }).code === "23505") {
    return true;
  }

  if ("cause" in error) {
    return isUniqueViolation((error as { cause?: unknown }).cause);
  }

  return false;
}
