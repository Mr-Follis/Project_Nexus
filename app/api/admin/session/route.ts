import { NextResponse } from "next/server";

import {
  getAdminTokenCookieName,
  isAdminAuthConfigured,
  isAdminTokenValid
} from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

const maxAgeSeconds = 60 * 60 * 8;

export async function POST(request: Request) {
  if (!isAdminAuthConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        configured: false,
        error: "Admin access is not configured."
      },
      { status: 503 }
    );
  }

  let token: unknown;

  try {
    ({ token } = await request.json());
  } catch {
    token = undefined;
  }

  if (typeof token !== "string" || !isAdminTokenValid(token)) {
    return NextResponse.json(
      { ok: false, configured: true, error: "Invalid admin token." },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ ok: true, configured: true });
  response.cookies.set(getAdminTokenCookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(getAdminTokenCookieName(), "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });

  return response;
}
