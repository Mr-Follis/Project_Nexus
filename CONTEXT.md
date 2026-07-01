# CONTEXT.md

## Current Status

Project Nexus is currently a Sprint 1 foundation app plus a documentation and planning repository. It has been initialized as a GitHub-backed repo and contains a complete product, design, architecture, data, AI, SEO, business, launch, and development documentation suite.

The foundation app now includes Next.js App Router, TypeScript, Tailwind CSS design tokens, placeholder and database-aware public routes, an admin placeholder, motion-ready components, a Drizzle/PostgreSQL schema, generated migration baseline, database health check, public read API foundation, an environment template, and setup instructions.

The intended MVP architecture is a Replit-built, GitHub-managed modular monolith using Next.js App Router, TypeScript, PostgreSQL, search, map, AI/RAG, admin workflows, and later Hermes Agent automation.

## Current Sprint Focus

Current focus:

- Stabilize and document the current foundation before adding major new features.
- Keep Replit + Codex full access as development only.
- Treat GitHub as backup and source of truth.
- Keep later production direction aligned to Vercel, Supabase, and Cloudflare.
- Use the repeatable validation workflow as the baseline for future changes.

## Recent Decisions

- GitHub repository created and pushed to `origin/main`.
- Replit is configured with Node.js 20.
- Replit expert mode is enabled for the agent.
- Added `pkgs.bubblewrap` to `replit.nix` while diagnosing Codex sandbox failures; validation showed the Replit container still rejects Bubblewrap because the runner process has injected capabilities and no setuid-capable `bwrap`.
- Sprint 1 foundation uses Next.js, TypeScript, Tailwind CSS, Framer Motion-ready components, and Drizzle schema definitions.
- Sprint 2 database foundation keeps the app provider-neutral with Drizzle and PostgreSQL through `DATABASE_URL`.
- Generated initial migration lives in `db/migrations/0000_milky_human_robot.sql`.
- Added safe DB health endpoint at `/api/health/db`.
- Added knowledge validation schemas, repository helpers, and a foundation seed command.
- Added `npm run validate` and a GitHub Actions workflow for pushes to `main` and pull requests.
- Added Vitest and initial unit coverage for knowledge validation schemas.
- Added public read API routes for published games, entity lists, and entity detail.
- Added database-aware vehicle, weapon, and mission category pages that render published records only.
- Added public entity detail route for published knowledge records.
- Added source attribution retrieval and display for entity detail records.
- Added last-updated metadata display for public knowledge records.
- Added PostgreSQL fallback search API for published entity records.
- Added public search page for the GTA VI hub.
- Added search result grouping by entity type.
- Added public map marker API and database-aware map shell.
- Added community submission intake API for moderation records.
- Added public community submission form for the GTA VI hub.
- Aligned the OpenAPI draft with implemented public API routes.
- Updated sitemap route coverage for new public search and submission pages.
- Added an original generated city/intelligence-map backdrop and image-backed heroes for the home and GTA VI hub pages.
- Added root active implementation roadmap, decisions log, testing plan, and route smoke coverage during stabilization.
- Added a minimal admin moderation foundation with queue visibility, status transition validation, repository helpers, and a PATCH API route for submission moderation updates.
- MVP should follow a modular monolith approach rather than early microservices.
- GTA VI is the first target market, but the platform architecture should stay multi-game.
- Project data should be structured once and reused across public pages, AI answers, maps, search, guides, calculators, and SEO pages.
- Secrets must live in Replit Secrets or another environment secrets manager, not in code or docs.

## Known Issues

- No full integration/e2e test suite exists yet.
- Codex sandbox commands currently fail because Bubblewrap exits with `Unexpected capabilities but not setuid`; fixing this requires host/Replit-level capability or setuid Bubblewrap support, or running Codex with full-access permissions as a workaround.
- Migrations have been applied to the configured database in this workspace.
- Foundation seed should contain no gameplay facts: only a draft game record and official source records.
- Database provider choice, Supabase vs Neon, still needs a final implementation decision.
- Search provider choice, Typesense vs Meilisearch, still needs a later implementation decision.
- Persistent zero-result search logging needs an analytics/search-log schema decision.
- Community submissions currently have intake UI/API and a basic admin moderation queue, but no duplicate detection, reviewer identity, approval-to-record workflow, or audit trail.
- Root `ROADMAP.md` is now the active implementation roadmap for ongoing sessions and references `09_Development/Roadmap.md` as the milestone roadmap.
- `zipFile.zip` is present in the repo and may need review later to decide whether it should remain tracked.

## Last Checkpoint

2026-07-01 game-publish checkpoint:

- Added a game publish workflow: `getGameById`, audited `updateGameStatus`, `PATCH /api/admin/games/[gameId]`, and an admin Games section using the shared `StatusActions` control.
- Closed the public loop end-to-end on the preview: a community submission approved into a draft entity, published, then made visible only after the game itself was published (public reads require a published game).
- Removed the fabricated demo submission/entity used during verification and reverted `gta-6` to `draft` to respect the no-published-gameplay-facts rule; only seeded media, the draft game, and official source records remain.
- 75 unit tests, typecheck, lint, format, and production build pass.

2026-07-01 media library checkpoint:

- Added a structured media library (`media_assets` table, migration `0001`) with metadata for source, copyright owner, original URL, asset type, provenance, and a related-entity link, designed so official promotional placeholders can be replaced later by original Project Nexus content.
- Added `media_type` and `media_provenance` enums (`official_promotional`, `project_nexus_original`, `community_approved`, `placeholder`); official media validation requires a copyright owner plus a source name or original URL.
- Added media validation, repository helpers (featured lookup, per-entity, admin list, audited status update), attribution resolution, and a shared `StatusActions` admin control (generalised from the entity publish buttons).
- Wired the home hero to render from the media library via `getGameHeroMedia` with a Project Nexus original fallback and a corner attribution/provenance chip; sharpened the site disclaimer to a trademark/attribution statement.
- Added an admin Media library section and `PATCH /api/admin/media/[mediaId]`; seeded a featured original hero asset plus an official-promotional metadata placeholder (no third-party binaries bundled).
- No Rockstar media files were downloaded; the system stores metadata and renders the existing original placeholder. Editors add official files into the structured library later.
- Verified live: home hero renders from the library with attribution; admin media publish/hide works; 71 unit tests, typecheck, lint, format, and production build pass.

2026-07-01 approval-to-record checkpoint:

- Completed the admin token authorization wiring that was left half-finished (the moderation API now authorizes before any DB work and passes the reviewer id into the audit trail).
- Implemented approval-to-record: approving a submission now creates, in one transaction, an unpublished `draft` entity (verification `speculative`) linked back via `submissions.proposedEntityId`, plus an entity-creation audit event alongside the moderation audit. Re-approvals are idempotent; slug collisions are resolved with a submission-derived suffix.
- Added pure, unit-tested helpers for submission-type-to-entity-type mapping, slugifying titles, building the draft, the approval guard, and the entity audit event.
- Added an interactive admin moderation UI: a per-tab `x-admin-token` field (sessionStorage) and per-submission action buttons that PATCH the moderation API and refresh the queue.
- Verified end-to-end on the running preview: created a submission, approved it via API, and confirmed the draft entity + two audit rows in the database; the draft stays unpublished so it does not surface on public pages.
- `ADMIN_ACCESS_TOKEN` is set in Replit Secrets; the Replit-run dev server on port 3000 picks it up. Full validation (`format`, `typecheck`, `lint`, `test:unit`, `build`) passes.

2026-07-01 later checkpoint:

- Continued into the Admin and moderation foundation sprint.
- Replaced the admin placeholder with a database-aware moderation queue for community submissions.
- Added moderation status validation and guarded transitions for `new`, `needs_more_info`, `duplicate`, `approved`, `rejected`, and `spam`.
- Added repository helpers to list moderation submissions, fetch a submission, and update moderation status or notes.
- Added `PATCH /api/admin/submissions/[submissionId]` for moderation updates.
- Added unit coverage for moderation validation and admin submission API responses.
- Verified `npm run format`, `npm run typecheck`, `npm run test:unit`, `npm run lint`, and `npm run build` pass.

2026-07-01:

- Stabilized current foundation before new feature work.
- Verified `npm run typecheck`, `npm run lint`, `npm run test:unit`, and `npm run build` pass.
- Started the Next.js dev server successfully on port 3000.
- Confirmed required routes return 200 locally: `/`, `/gta-6`, `/gta-6/search`, `/gta-6/map`, `/gta-6/submit`, `/gta-6/vehicles`, `/gta-6/weapons`, `/gta-6/missions`, and `/admin`.
- Updated root `ROADMAP.md` as the active implementation roadmap.
- Added `docs/DECISIONS.md` for open decisions.
- Added `docs/TESTING_PLAN.md` with the current validation baseline and recommended Playwright next step.
- Added basic Vitest route smoke coverage for required public/admin route files and sitemap registry inclusion.

2026-06-30:

- Initial documentation suite committed and pushed to GitHub.
- Repository configured on branch `main` with remote `origin`.
- Project context setup began by inspecting the folder structure, Replit config, roadmap, implementation checklist, and architecture docs.
- Added root-level context files requested for ongoing Codex collaboration.
- Began Sprint 1 foundation and added the Next.js app shell, route placeholders, Tailwind tokens, DB-ready schema, env template, and README setup notes.
- Completed database foundation with Drizzle scripts, generated migration baseline, provider-neutral DB client, DB health route, and database setup docs.
- Began Knowledge Core foundation with typed validation, repository helpers, and idempotent foundation seeding.
- Diagnosed Codex sandbox failure: no `bwrap` executable was present on `PATH`, and Nix-provided `bubblewrap 0.11.0` also fails in this container with `Unexpected capabilities but not setuid`. The runner process has `cap_kill` and `no-new-privs=1`; attempts to drop the capability with `capsh` and `setpriv` failed. This likely needs a Replit/host fix, not a repo-only fix.
- Added repeatable validation with `npm run validate` and `.github/workflows/validate.yml`.
- Added Vitest unit tests covering defaults and guardrails for game, source, entity, and entity-source validation.
- Added public-safe read APIs at `/api/games`, `/api/games/[gameSlug]`, `/api/games/[gameSlug]/entities`, and `/api/games/[gameSlug]/entities/[entitySlug]`.
- Added shared public category rendering for `/gta-6/vehicles`, `/gta-6/weapons`, and `/gta-6/missions`.
- Added public entity detail rendering at `/gta-6/entities/[entitySlug]`.
- Added linked source records to the entity detail API response and public entity detail page.
- Added date formatting utility and last-updated display on public category and entity detail pages.
- Added public search fallback at `/api/search` for published entities, optionally scoped by game slug.
- Added `/gta-6/search` with server-rendered published-record results and links to entity detail pages.
- Added entity-type grouping to public search results; persistent zero-result logging was deferred because the current Drizzle schema has no search log table.
- Added `/api/games/[gameSlug]/map/markers` and made `/gta-6/map` render published marker records when available.
- Added `POST /api/submissions` to validate community submission payloads and create `new` moderation records.
- Added `/gta-6/submit` with a client-side form that posts into the moderation queue.
- Updated `10_API/openapi.yaml` to reflect implemented `/api/...` routes and current request/response surface.
- Added `/gta-6/search` and `/gta-6/submit` to the static sitemap route list.
- Improved the Replit preview visual presentation with `public/images/nexus-city-intel-hero.png`, full-bleed heroes, stronger cards, and a more polished navigation shell.
