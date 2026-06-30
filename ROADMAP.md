# ROADMAP.md

## Phase 1: Foundation

- Create the application shell using the agreed MVP stack.
- Add `package.json` with real dev, test, lint, and build scripts.
- Configure TypeScript, linting, formatting, and test tooling.
- Add the first CI or repeatable validation workflow.
- Define initial app folder structure for public pages, admin, API/server logic, data access, and shared UI.
- Configure the database layer with provider-neutral PostgreSQL and Drizzle.
- Convert the draft database schema into migrations.
- Create design tokens and the first reusable UI primitives.
- Build the first public game hub route using structured placeholder data.
- Add environment variable handling that reads only from Replit Secrets or deployment secrets.

Completed foundation items:

- Next.js App Router shell.
- TypeScript, lint, format, and build scripts.
- Tailwind design token foundation.
- Placeholder public/admin routes.
- Drizzle schema and initial migration baseline.
- Safe database health route.
- Repeatable validation script and GitHub Actions workflow.
- Initial Vitest unit coverage for knowledge validation schemas.
- Public read API foundation for published games, entity lists, and entity detail.
- Database-aware public category pages for vehicles, weapons, and missions.
- Public entity detail route for published knowledge records.
- Source attribution surfaced on public entity detail records.
- Last-updated metadata on public category and entity detail records.
- PostgreSQL fallback search API for published entities.
- Public search page wired to published knowledge records.
- Search results grouped by entity type.
- Public map marker API and database-aware map shell.
- Community submission intake API for moderation records.
- Public community submission form for moderation intake.
- OpenAPI draft aligned with implemented public API routes.
- Static sitemap coverage for new public search and submission routes.
- Image-backed home and GTA VI hub heroes for a more product-ready preview.

## Phase 2: Core Product Loop

- Build the knowledge graph core for games, entities, sources, relationships, verification statuses, and audit history.
- Add typed validation and repository helpers for game, entity, source, and entity-source workflows.
- Seed foundation records without gameplay facts.
- Implement admin CRUD for the first entity types.
- Add zero-result logging after the analytics/search-log schema is defined.
- Add map marker filters, marker detail sheet, entity-marker links, and MapLibre rendering.
- Add duplicate detection and admin moderation workflows for submissions.
- Add analytics events for core user flows.
- Add tests around schema validation, data access, and core entity behavior.

## Phase 3: AI, Community, And Launch Readiness

- Add approved-content chunking and embeddings for RAG.
- Build the AI assistant with guarded retrieval, unknown-answer handling, sources, and action cards.
- Log AI queries, retrieval results, latency, cost, and failure states.
- Add community submissions with evidence links/uploads, duplicate detection, and moderation.
- Add SEO templates, sitemap generation, structured metadata, and internal linking support.
- Add background jobs for search indexing, embeddings, page revalidation, stale-content checks, and sitemap updates.
- Add monitoring for errors, Core Web Vitals, API latency, queue failures, and AI costs.
- Prepare launch assets, moderation workflows, privacy/terms pages, backup checks, and a go/no-go checklist.

## Stretch Goals

- Add user accounts, saved/found progress, and personalized tracking.
- Add calculators, comparison tools, and route planning.
- Add premium features and subscription experiments.
- Add community reputation and contributor profiles.
- Add multi-game expansion tooling for future hubs.
- Add Hermes Agent workflows for scheduled research scans, SEO reports, stale-content detection, and admin-ready update drafts.
- Add richer automation for source monitoring, patch-note analysis, and competitor delta reports.
- Explore native app or PWA experiences once the web product loop is stable.
