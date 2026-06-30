# CONTEXT.md

## Current Status

Project Nexus is currently a documentation and planning repository. It has been initialized as a GitHub-backed repo and contains a complete product, design, architecture, data, AI, SEO, business, launch, and development documentation suite.

No runnable application shell exists yet. There is no `package.json`, lockfile, app source directory, test suite, lint config, or build script in the repository at this checkpoint.

The intended MVP architecture is a Replit-built, GitHub-managed modular monolith using Next.js App Router, TypeScript, PostgreSQL, search, map, AI/RAG, admin workflows, and later Hermes Agent automation.

## Current Sprint Focus

Starting focus:

- Establish reliable working context files for ongoing Codex/Replit collaboration.
- Convert the documentation suite into an implementation-ready repo.
- Create the initial app shell and development workflow.
- Add package scripts for dev, test, lint, and build.
- Finalize the first technical decisions needed for Sprint 1 foundation.

## Recent Decisions

- GitHub repository created and pushed to `origin/main`.
- Replit is configured with Node.js 20.
- Replit expert mode is enabled for the agent.
- The current repo is documentation-first; application implementation has not started yet.
- MVP should follow a modular monolith approach rather than early microservices.
- GTA VI is the first target market, but the platform architecture should stay multi-game.
- Project data should be structured once and reused across public pages, AI answers, maps, search, guides, calculators, and SEO pages.
- Secrets must live in Replit Secrets or another environment secrets manager, not in code or docs.

## Known Issues

- No runnable app exists yet.
- No package manager or framework has been initialized.
- No automated tests, linting, formatter, or CI workflow exists yet.
- No database connection or migration system exists yet.
- Stack choices such as Prisma vs Drizzle, Supabase vs Neon, and Typesense vs Meilisearch still need final implementation decisions.
- Existing roadmap lives under `09_Development/Roadmap.md`; this root `ROADMAP.md` should become the working implementation roadmap for ongoing sessions.
- `zipFile.zip` is present in the repo and may need review later to decide whether it should remain tracked.

## Last Checkpoint

2026-06-30:

- Initial documentation suite committed and pushed to GitHub.
- Repository configured on branch `main` with remote `origin`.
- Project context setup began by inspecting the folder structure, Replit config, roadmap, implementation checklist, and architecture docs.
- Added root-level context files requested for ongoing Codex collaboration.
