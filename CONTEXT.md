# CONTEXT.md

## Current Status

Project Nexus is currently a Sprint 1 foundation app plus a documentation and planning repository. It has been initialized as a GitHub-backed repo and contains a complete product, design, architecture, data, AI, SEO, business, launch, and development documentation suite.

The foundation app now includes Next.js App Router, TypeScript, Tailwind CSS design tokens, placeholder and database-aware public routes, an admin placeholder, motion-ready components, a Drizzle/PostgreSQL schema, generated migration baseline, database health check, public read API foundation, an environment template, and setup instructions.

The intended MVP architecture is a Replit-built, GitHub-managed modular monolith using Next.js App Router, TypeScript, PostgreSQL, search, map, AI/RAG, admin workflows, and later Hermes Agent automation.

## Current Sprint Focus

Starting focus:

- Validate the Sprint 1 and database foundation in Replit.
- Apply the generated migration to a real PostgreSQL database once `DATABASE_URL` is available.
- Decide Supabase vs Neon and confirm the database provider.
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
- MVP should follow a modular monolith approach rather than early microservices.
- GTA VI is the first target market, but the platform architecture should stay multi-game.
- Project data should be structured once and reused across public pages, AI answers, maps, search, guides, calculators, and SEO pages.
- Secrets must live in Replit Secrets or another environment secrets manager, not in code or docs.

## Known Issues

- No integration test suite exists yet.
- Codex sandbox commands currently fail because Bubblewrap exits with `Unexpected capabilities but not setuid`; fixing this requires host/Replit-level capability or setuid Bubblewrap support, or running Codex with full-access permissions as a workaround.
- Migrations have been applied to the configured database in this workspace.
- Foundation seed should contain no gameplay facts: only a draft game record and official source records.
- Database provider choice, Supabase vs Neon, still needs a final implementation decision.
- Search provider choice, Typesense vs Meilisearch, still needs a later implementation decision.
- Persistent zero-result search logging needs an analytics/search-log schema decision.
- Community submissions currently have intake UI/API but no duplicate detection or admin moderation UI.
- Existing roadmap lives under `09_Development/Roadmap.md`; this root `ROADMAP.md` should become the working implementation roadmap for ongoing sessions.
- `zipFile.zip` is present in the repo and may need review later to decide whether it should remain tracked.

## Last Checkpoint

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
