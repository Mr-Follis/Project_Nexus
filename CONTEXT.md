# CONTEXT.md

## Current Status

Project Nexus is currently a Sprint 1 foundation app plus a documentation and planning repository. It has been initialized as a GitHub-backed repo and contains a complete product, design, architecture, data, AI, SEO, business, launch, and development documentation suite.

The foundation app now includes Next.js App Router, TypeScript, Tailwind CSS design tokens, placeholder public routes, an admin placeholder, motion-ready components, a Drizzle/PostgreSQL schema, generated migration baseline, database health check, an environment template, and setup instructions.

The intended MVP architecture is a Replit-built, GitHub-managed modular monolith using Next.js App Router, TypeScript, PostgreSQL, search, map, AI/RAG, admin workflows, and later Hermes Agent automation.

## Current Sprint Focus

Starting focus:

- Validate the Sprint 1 and database foundation in Replit.
- Apply the generated migration to a real PostgreSQL database once `DATABASE_URL` is available.
- Decide Supabase vs Neon and confirm the database provider.
- Add CI or a repeatable validation workflow.

## Recent Decisions

- GitHub repository created and pushed to `origin/main`.
- Replit is configured with Node.js 20.
- Replit expert mode is enabled for the agent.
- Sprint 1 foundation uses Next.js, TypeScript, Tailwind CSS, Framer Motion-ready components, and Drizzle schema definitions.
- Sprint 2 database foundation keeps the app provider-neutral with Drizzle and PostgreSQL through `DATABASE_URL`.
- Generated initial migration lives in `db/migrations/0000_milky_human_robot.sql`.
- Added safe DB health endpoint at `/api/health/db`.
- Added knowledge validation schemas, repository helpers, and a foundation seed command.
- MVP should follow a modular monolith approach rather than early microservices.
- GTA VI is the first target market, but the platform architecture should stay multi-game.
- Project data should be structured once and reused across public pages, AI answers, maps, search, guides, calculators, and SEO pages.
- Secrets must live in Replit Secrets or another environment secrets manager, not in code or docs.

## Known Issues

- No unit/integration test suite exists yet.
- No CI workflow exists yet.
- Migrations have been applied to the configured database in this workspace.
- Foundation seed should contain no gameplay facts: only a draft game record and official source records.
- Database provider choice, Supabase vs Neon, still needs a final implementation decision.
- Search provider choice, Typesense vs Meilisearch, still needs a later implementation decision.
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
