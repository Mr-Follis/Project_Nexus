# Decisions Log

This log tracks open implementation decisions. Do not treat an item as chosen until the project docs or owner explicitly decide it.

## Open Decisions

### Supabase vs Neon

- Status: Open.
- Current context: The app is provider-neutral PostgreSQL through `DATABASE_URL` and Drizzle.
- Decision needed: Choose the managed PostgreSQL provider for production.
- Notes: Current production direction mentions Vercel, Supabase, and Cloudflare, but the database provider decision is not yet finalized in the implementation docs.

### Typesense vs Meilisearch

- Status: Open.
- Current context: The app has a PostgreSQL fallback search API for published entities.
- Decision needed: Choose the dedicated search provider and indexing approach.
- Notes: Keep PostgreSQL fallback until the provider decision and indexing workflow are defined.

### Persistent zero-result search logging approach

- Status: Open.
- Current context: Zero-result logging was deferred because the current Drizzle schema has no search log table.
- Decision needed: Define schema, retention, privacy constraints, and whether logs live in PostgreSQL, analytics tooling, or both.

### Community moderation workflow

- Status: Open.
- Current context: Community submission intake UI/API exists and creates moderation records. A basic admin queue and guarded status transitions now exist for `new`, `needs_more_info`, `duplicate`, `approved`, `rejected`, and `spam`.
- Decision needed: Define duplicate detection, reviewer identity, approval-to-record behavior, and audit requirements.

### Integration testing framework

- Status: Open.
- Current context: Vitest unit tests exist. No browser-level integration/e2e framework is installed.
- Decision needed: Choose Playwright, Vitest-based route handlers, or another approach for route and browser smoke testing.
- Recommendation to evaluate next: Playwright for full-page route checks once the app surface stabilizes.

### Replit sandbox/full-access workaround

- Status: Open operational workaround.
- Current context: Sandboxed Codex commands fail because Bubblewrap exits with `Unexpected capabilities but not setuid`.
- Decision needed: Decide whether ongoing Replit/Codex work should standardize on full-access development mode, or whether Replit/host-level sandbox support should be fixed.
- Constraint: Replit + Codex full access is development only. Production remains separate.

### `zipFile.zip` review needed

- Status: Open.
- Current context: `zipFile.zip` exists in the repository.
- Decision needed: Inspect contents and decide whether it should remain tracked, move to external storage, or be removed after explicit approval.
