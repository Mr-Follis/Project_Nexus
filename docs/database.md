# Database Foundation

Project Nexus uses PostgreSQL as the source of truth and Drizzle as the Sprint 2 ORM/migration layer.

The setup is provider-neutral. Supabase and Neon can both be used as long as `DATABASE_URL` points at a PostgreSQL database.

## Environment

Set the database connection in Replit Secrets:

```text
DATABASE_URL=postgres://...
```

Do not commit real database URLs, service role keys, access tokens, or API keys.

## Commands

Generate migrations from the Drizzle schema:

```bash
npm run db:generate
```

Apply migrations to the configured database:

```bash
npm run db:migrate
```

Seed foundation records:

```bash
npm run db:seed
```

Open Drizzle Studio:

```bash
npm run db:studio
```

Validate the app:

```bash
npm run test
npm run build
```

## Health Check

The app exposes a safe database health route:

```text
/api/health/db
/api/health/knowledge
```

If `DATABASE_URL` is missing, the route returns HTTP 200 with `configured: false` so the placeholder app does not crash.

If `DATABASE_URL` is configured but the database cannot be reached, the route returns HTTP 503.

`/api/health/knowledge` is read-only and reports high-level table counts for foundation verification.

## Scope Boundary

This sprint only establishes the database foundation:

- Drizzle schema
- Generated migration SQL
- Migration commands
- Foundation seed command
- Environment documentation
- Safe health check

It does not build authentication, admin CRUD, search, public data rendering, AI retrieval, MapLibre integration, or community submissions.
