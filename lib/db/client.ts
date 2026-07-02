import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "@/db/schema";
import { env } from "@/lib/config/env";

let client: postgres.Sql | undefined;
let db: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getDatabaseUrl() {
  return env.DATABASE_URL;
}

export function createDbClient() {
  if (!env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not configured. Add it through Replit Secrets before DB use."
    );
  }

  client = postgres(env.DATABASE_URL, {
    prepare: false
  });

  return drizzle(client, { schema });
}

export function getDb() {
  if (!db) {
    db = createDbClient();
  }

  return db;
}

/**
 * Closes the cached connection. Used by database-backed tests so the process
 * can exit cleanly; the app itself never needs to call this.
 */
export async function closeDbClient() {
  if (client) {
    await client.end({ timeout: 5 });
    client = undefined;
    db = undefined;
  }
}

export async function checkDbHealth() {
  if (!env.DATABASE_URL) {
    return {
      ok: false,
      configured: false,
      message: "DATABASE_URL is not configured."
    };
  }

  try {
    const database = getDb();
    await database.execute(sql`select 1`);

    return {
      ok: true,
      configured: true,
      message: "Database connection succeeded."
    };
  } catch (error) {
    return {
      ok: false,
      configured: true,
      message:
        error instanceof Error ? error.message : "Database connection failed."
    };
  }
}
