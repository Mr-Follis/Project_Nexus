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

2026-07-02 Design Mode Sprint 1 (Premium Visual System) checkpoint:

- Added Space Grotesk as the display typeface (`--font-display` / `font-display` Tailwind family, Inter fallback) and applied it to every heading surface: hero H1s, PageHeader, SectionHeader, PlaceholderPanel, StatCard values, and the header/footer wordmarks.
- Split the monolithic `SiteShell` into an `AppShell` frame plus `LegalFooter`; `site-shell.tsx` remains as a deprecated re-export so older imports keep working. The shell background now layers violet/cyan radial glows behind the fixed glass header.
- Added `MobileNav`, an app-style bottom tab bar (Home / Hub / Search / Map / Submit) shown below `md` with safe-area padding; the desktop pill nav is hidden on phones and the main column/footer reserve bottom space for the bar.
- Upgraded `Card` with a subtle elevated-to-surface vertical gradient and a top hairline highlight.
- Added `CTASection` (gradient-bordered closing call-to-action band with ambient glows) and used it to close the homepage with Submit evidence / Ask Nexus actions.
- Validation: 130 unit tests, typecheck, lint, and Prettier pass; production build succeeds; all 13 public/admin routes return 200; the legal disclaimer still renders exactly once per page (second match is the RSC payload script, not visible DOM).

2026-07-02 Design Rescue Sprint 1 checkpoint:

- Added a reusable presentation kit: `HeroShell` (full-bleed cinematic hero with backdrop, scrims, attribution chip, entrance motion), `SectionHeader`, `StatCard`, `FeatureCard` (now also powers `ModuleGrid`), `MediaPanel` (showcase image panel with hover zoom and mandatory attribution), and `SourceBadge` (verification shield — green for confirmed levels, neutral otherwise).
- Rebuilt the homepage: taller cinematic hero over the official key art, live content stats (via new read-only `getPublicContentStats`), user-facing feature cards, an official-archive media showcase (via new `listPublicMediaForGame`), and the data-first band.
- Rebuilt the GTA VI hub: HeroShell with per-category live stat strip, ten user-facing module tiles, and a "How records earn their place" note.
- New header (brand block with "Unofficial companion" tagline, refined pill nav with prefix-aware active states, hairline accent under the header) and a structured footer (brand column, Explore/Community link columns, single legal note).
- Fixed the duplicated disclaimer: the homepage no longer renders its own copy; the disclaimer lives once in the footer (component documents this).
- Category pages: `SourceBadge` on record cards and a proper empty state (icon, explanation, Submit evidence / Back to hub CTAs); entity detail header also uses `SourceBadge`.
- Mobile-first passes: svh-based hero heights, 2-col stat grids on small screens, scrollbar-less nav pills with labels appearing at lg, responsive type scale.
- All 14 public/admin routes return 200; disclaimer text appears exactly once on the homepage; 130 tests, typecheck, lint, format, and isolated production build pass.

2026-07-02 edition-content checkpoint:

- Added 11 more officially confirmed entities from Rockstar's pre-order/editions announcement (verified via the official Newswire and press coverage): vehicles Shitzu Squalo, '67 Vapid Dominator Buggy, Vapid Ganado Retro Build; shops Rideout Customs, Sara's Unisex Salon, Stock 305, Electric Fang Tattoo, One-Eyed Willie's, PTT YOUNGIN$ Illegal Goods Store; activity Wyman's Classic Car Collection; other Goodtime Gear — each with 1-2 official screenshots and dual source links (pre-order Newswire + media downloads page).
- Added a public `/gta-6/shops` category page and hub tile; fixed entity-detail back-links with an explicit type-to-path map (activity/other now fall back to the hub instead of a `${type}s` 404).
- Totals: 29 published entities (8 characters, 7 regions, 5 vehicles, 6 shops, 1 weapon, 1 activity, 1 other), 57 published media assets, 7 sources, 43 entity-source links, 226 audit rows.
- Remaining unused pack assets: Vintage Vice City outfit/exclusive-looks shots and weapon pattern/variant images (cosmetic sub-items, no clear entity type).

2026-07-02 media launch checkpoint:

- Downloaded Rockstar's officially provided GTA VI media packs from the first-party downloads page (`rockstargames.com/VI/media` → `media.rockstargames.com/VI/downloads/...`) — these zips are Rockstar's sanctioned distribution, not scraping. Selected 34 screenshots plus the official key art, resized to 1600px JPEGs (~6MB total) under `public/images/media/gta-6/`.
- Published 35 new official-promotional media records via the audited admin API, each with copyright owner, source name, and original URL: 2 screenshots per character (8) and per region (6 pictured), key art (featured), and 2 screenshots each for the new vehicle/weapon records.
- The official key art is now the featured hero: home and the GTA VI hub both render it cinematically with the attribution/provenance chip (the hub hero was rewired from a hardcoded image to `getGameHeroMedia`, marked force-dynamic).
- Created 3 new officially confirmed entities from Rockstar's own asset names: vehicles `'55 Vapid Stanier` (Vintage Vice City Pack media) and `'95 Grotti Cheetah` (Ultimate Edition media), weapon `Hawk & Little Morgan Revolvers` (Ultimate Edition media) — each sourced to a new official media-downloads source record. The vehicles and weapons category pages now show real records.
- Archived the seeded metadata-only official placeholder record (superseded by real assets).
- Totals now: 18 published entities (8 characters, 7 regions, 2 vehicles, 1 weapon), 38 published media assets, 6 sources, 21 entity-source links, 143 audit rows.
- Unused officially named assets available for future records: Squalo, Stock 305, Vapid Buggy, Electric Fang, Wyman Car Collection, Rideout Customs, Sara's Salon (types need confirmation before entity creation).
- Verified live: heroes with attribution, per-entity galleries, populated vehicles/weapons pages, images serving 200. 130 tests, typecheck, lint, format pass.

2026-07-02 content launch checkpoint:

- Populated the knowledge base with officially confirmed GTA VI content, entered through the audited admin APIs (not seeds): 8 characters (Jason Duval, Lucia Caminos, Cal Hampton, Boobie Ike, Dre'Quan Priest, Real Dimez, Raul Bautista, Brian Heder) and 7 regions (Leonida, Vice City, Leonida Keys, Grassrivers, Port Gellhorn, Ambrosia, Mount Kalaga National Park), all `confirmed_official` with summaries written in our own words.
- Added 3 official source records (Trailer 1 Newswire post, Trailer 2 video page, November 19 2026 release-date Newswire post) alongside the seeded official-site and Newswire sources; every entity is linked to the official GTA VI site source, protagonists also to Trailer 2, Vice City also to Trailer 1.
- Added 2 official-promotional trailer media records (external YouTube links only — no downloaded binaries) with full copyright/source/original-URL attribution.
- Updated and published the `gta-6` game record: description, release date 2026-11-19, platforms PS5 / Xbox Series X|S. Facts verified via web search against rockstargames.com and the official Newswire before entry.
- Added public `/gta-6/characters` and `/gta-6/regions` category pages (shared category component), hub tiles, nav links, sitemap and route-smoke coverage; refreshed the GTA VI hub hero and data-status copy to reflect live sourced records.
- Fixed CI: `package-lock.json` contained Replit package-firewall URLs that GitHub Actions cannot resolve — rewrote `resolved` URLs to registry.npmjs.org (integrity hashes unchanged) and pinned npm 11 in the workflow. The Validate workflow now passes on GitHub.
- Verified live: characters/regions pages, entity detail with source attribution, search, sitemap, and public API all render the published records. 130 tests, typecheck, lint, format pass.

2026-07-02 sources/media/galleries checkpoint:

- Added audited source-to-entity linking: attach via `POST /api/admin/entities/[entityId]/sources` (with optional claim and field name), detach via `DELETE /api/admin/entity-sources/[id]`, linked-source lists with detach buttons and a source picker on admin entity cards. Duplicate whole-record links return 409 via an explicit pre-check because the `(entity, source, field)` unique constraint treats NULL field names as distinct (found live by a verification probe).
- Added an audited media create workflow: `POST /api/admin/media` with a strict draft-only `mediaAssetCreateSchema`, a "New media asset" admin form (game, optional related entity, type, provenance, file path/external URL, attribution fields, featured/attribution checkboxes).
- Added per-entity media galleries on public entity detail pages (`EntityMediaGallery`), rendering published media with provenance labels and resolved attribution.
- Admin edit forms can now clear optional fields: emptying a prefilled text/date field submits null (comma lists submit []); edit schemas are nullable for optional columns and the repositories map null through (including timestamp columns, avoiding the `new Date(null)` epoch bug).
- Added DB-backed integration tests (`knowledge.integration.test.ts`, skipped without DATABASE_URL): approval-to-record with audit rows, slug-collision suffixing, entity publish audit, no-op edit skipping, and null-clear edits; added `closeDbClient()` for clean test shutdown.
- Added `distDir: process.env.NEXT_DIST_DIR || ".next"` to `next.config.mjs` so validation builds (`NEXT_DIST_DIR=.next-build npm run build`) no longer corrupt the running dev server.
- Verified live on the dev preview: attach/detach with 409/404 guards, media create validations, gallery rendering on a temporarily published entity (then reverted `gta-6` to draft and removed all temp records), and null-clear via the API. 130 unit+integration tests, typecheck, lint, format, and isolated production build pass.

2026-07-02 admin create/edit forms checkpoint:

- Added audited admin create and field-edit workflows for games, entities, and sources: `POST /api/admin/{games,entities,sources}` and `PUT /api/admin/{games,entities,sources}/[id]`, with a shared `runAdminMutation` guard (auth, DB check, Zod 400s, unique-violation 409s).
- Create schemas are strict and omit `status`, so every admin-created record starts as a draft and can only be published through the existing audited status actions; edit schemas require at least one field and never inject defaults.
- Every create/edit writes a `record_versions` audit row with reviewer id and changed fields; no-op edits (values unchanged) skip both the update and the audit row via a field-diff helper.
- Added a reusable `RecordForm` admin client component (toggleable create/edit forms, typed field configs) wired into the admin page for games, entities, and a new Sources section; known limitation: empty inputs are omitted, so optional fields cannot be cleared yet.
- Verified end-to-end on the running dev server: created and edited a game, entity, and source via the API, confirmed 401/400/404/409 guards, verified six audit rows with reviewer identity, confirmed the draft game did not appear in the public games API, then removed the verification records.
- Note: running `npm run build` while `next dev` is serving corrupts the dev server's `.next` cache (`Cannot find module './vendor-chunks/drizzle-orm.js'`); fix is to clear `.next` and restart the dev server.
- 110 unit tests, typecheck, lint, format, and production build pass.

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
