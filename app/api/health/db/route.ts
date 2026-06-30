import { NextResponse } from "next/server";

import { checkDbHealth } from "@/lib/db/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const health = await checkDbHealth();

  return NextResponse.json(health, {
    status: health.ok || !health.configured ? 200 : 503
  });
}
