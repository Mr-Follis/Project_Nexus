# ROADMAP.md

## Phase 1: Foundation

- Create the application shell using the agreed MVP stack.
- Add `package.json` with real dev, test, lint, and build scripts.
- Configure TypeScript, linting, formatting, and test tooling.
- Add the first CI or repeatable validation workflow.
- Define initial app folder structure for public pages, admin, API/server logic, data access, and shared UI.
- Choose and configure the database layer: Supabase or Neon, plus Prisma or Drizzle.
- Convert the draft database schema into migrations.
- Create design tokens and the first reusable UI primitives.
- Build the first public game hub route using structured placeholder data.
- Add environment variable handling that reads only from Replit Secrets or deployment secrets.

## Phase 2: Core Product Loop

- Build the knowledge graph core for games, entities, sources, relationships, verification statuses, and audit history.
- Implement admin CRUD for the first entity types.
- Render public entity detail pages and category pages from database-backed records.
- Add source attribution, verification labels, and last-updated metadata.
- Add global search with result grouping and zero-result logging.
- Build the map shell with marker categories, filters, marker detail sheet, and entity-marker links.
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
