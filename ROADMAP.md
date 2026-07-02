# Project Nexus Active Roadmap

This is the active implementation roadmap for Codex/Replit sessions. The milestone roadmap in `09_Development/Roadmap.md` remains the long-range product plan and should be treated as the source reference for phase ordering.

## Current Status

Project Nexus is in foundation stabilization. The current app is a Sprint 1 Next.js App Router foundation with TypeScript, Tailwind tokens, Drizzle/PostgreSQL schema, public read APIs, public GTA VI pages, search fallback, map marker API, community submission intake, unit tests, and a repeatable validation workflow.

Current environment stance:

- Replit + Codex full access is development only.
- GitHub is the repository backup and source of truth.
- Production later targets Vercel, Supabase, and Cloudflare.

## Completed Sprint 1 Work

- Next.js App Router shell with public layout and admin placeholder.
- TypeScript, ESLint, Prettier, Vitest, build, and validation scripts.
- Tailwind design tokens and reusable UI/layout/card components.
- Drizzle schema, generated baseline migration, provider-neutral DB client, and DB setup notes.
- Safe database and knowledge health endpoints.
- Knowledge validation schemas, repository helpers, and foundation seed command.
- Public read APIs for games, entity lists, entity detail, map markers, search, and submissions.
- Database-aware GTA VI hub, category pages, entity detail, search, map shell, and submission form.
- Source attribution and last-updated metadata on public knowledge records.
- OpenAPI draft aligned with implemented API routes.
- Static sitemap coverage for current public routes.
- Image-backed home and GTA VI hub presentation for Replit Preview.
- GitHub Actions validation workflow.
- Initial unit coverage for validation, public API helpers, search, map, submissions, and dates.
- Basic route smoke coverage for required public/admin route files.
- Minimal admin moderation queue for community submissions.
- Moderation status validation and transition guardrails.
- PATCH API foundation for submission moderation updates.

## Open Decisions

- Supabase vs Neon for managed PostgreSQL.
- Typesense vs Meilisearch for the dedicated search provider.
- Persistent zero-result search logging schema and analytics approach.
- Community moderation workflow beyond the foundation queue, including duplicate detection, reviewer identity, audit history, and approval-to-record behavior.
- Integration/e2e testing framework for route and browser-level checks.
- Replit sandbox/full-access operating model for ongoing Codex sessions.
- Whether `zipFile.zip` should remain tracked.

## Current Blockers

- Codex sandboxed commands fail in this Replit container with Bubblewrap `Unexpected capabilities but not setuid`; use full-access/escalated execution for development until the host issue is resolved.
- No full integration/e2e test suite exists yet.
- Provider choices for database and search are still open.
- Community submissions now have a basic admin queue, but no duplicate detection, reviewer identity, approval-to-record workflow, or audit trail.
- Persistent zero-result logging needs a schema decision before implementation.
- `zipFile.zip` needs review before deciding whether to keep it.

## Next Sprint Recommendation

Recommended next sprint: Admin hardening and knowledge management foundation.

Primary goal: protect the admin surface and add the smallest internal workflow for managing draft knowledge records with source review.

Recommended scope:

- Done: admin access decision — token authorization guards the moderation API.
- Done: reviewer identity and audit history for moderation changes.
- Done: approval-to-record — approving a submission creates a linked draft entity with an audit event.
- Done: interactive admin moderation actions (status buttons + notes) in the admin UI.
- Done: protect the `/admin` page with a cookie-based admin session (login/logout); the same http-only cookie authorizes the moderation API.
- Done: admin knowledge-entities list with a publish/unpublish/hide/archive action (audited) so approval-to-record drafts can reach `published`.
- Done: structured media library (`media_assets`) with provenance/attribution metadata, admin management, a cinematic hero wired through it, and an unofficial trademark disclaimer — official promotional placeholders are designed to be replaced by original Project Nexus media later.
- Done: game publish workflow — an admin Games section with a status action closes the public loop (community submission → approve → publish entity → publish game → visible on public pages, verified end-to-end).
- Done: admin create/edit forms for games, entities, and sources — audited create (`POST /api/admin/{games,entities,sources}`) and field-edit (`PUT .../[id]`) endpoints, a shared `RecordForm` admin component, and a new Sources admin section; creates always start as drafts (a smuggled `status` is rejected) and every create/edit writes a `record_versions` audit row.
- Pending: media asset admin create/upload form and per-entity media galleries on public pages (schema and repository support exist; only status is editable in the admin UI so far).
- Pending: clearing an existing optional field via the admin edit forms (empty inputs are omitted from the payload rather than sent as deletions).
- Pending: linking sources to entities from the admin UI (`entity_sources` exists; attach currently requires the repository helper).
- Pending: focused tests around the approval-to-record and entity-publish repository paths (needs a DB-backed or integration test).

Defer until decisions are made:

- Dedicated search provider integration.
- AI/RAG assistant behavior.
- Advanced MapLibre rendering and marker interactions.
- Persistent zero-result logging.
- Production deployment configuration.
