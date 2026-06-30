# AGENTS.md

## Project Stack

Current repository state:

- Project type: Sprint 1 foundation app plus planning and documentation suite for Project Nexus.
- Runtime declared by Replit: Node.js 20.
- Nix dependencies: `unzip` only.
- Application code: Next.js App Router foundation.
- Package manifest: `package.json`.
- API contract: OpenAPI draft at `10_API/openapi.yaml`.
- Data/schema planning: SQL draft at `04_Data_Knowledge_Graph/Database_Schema.sql`.
- Database starter: Drizzle schema at `db/schema.ts` with generated migrations in `db/migrations/`.
- Diagrams: Mermaid files in `11_Diagrams/`.

Planned MVP stack from the architecture docs:

- Next.js App Router
- TypeScript
- Tailwind CSS or token-based CSS system
- Next.js API routes/server actions for the MVP backend
- PostgreSQL via Supabase or Neon
- Prisma or Drizzle ORM
- MapLibre GL JS for maps
- Typesense or Meilisearch, with PostgreSQL full-text fallback
- pgvector for semantic retrieval
- RAG over approved structured data and guide chunks
- Vercel, Supabase/Neon, and Cloudflare as likely production infrastructure
- Replit and Codex as the current build environment
- Hermes Agents as a planned operations and automation layer

## Folder Structure

```text
.
├── 00_Vision/                  # Constitution, product strategy, guiding principles
├── 01_Product/                 # PRD, personas, journeys, competitive analysis
├── 02_Design_Experience/       # Design manifesto, UI/UX, component and motion systems
├── 03_Technical_Architecture/  # System architecture, stack decisions, ADRs
├── 04_Data_Knowledge_Graph/    # Data governance, schema draft, knowledge graph plan
├── 05_AI_Automation/           # RAG, agents, Hermes workflows, prompt library
├── 06_SEO_Growth/              # SEO and content engine planning
├── 07_Business/                # Monetisation planning
├── 08_Launch/                  # Analytics, KPIs, launch plan
├── 09_Development/             # Roadmap, epics, tickets, implementation checklist
├── 10_API/                     # OpenAPI specification
├── 11_Diagrams/                # Mermaid architecture and workflow diagrams
├── 12_Sources/                 # Research sources
├── app/                        # Next.js App Router routes and metadata files
├── components/                 # Reusable UI, layout, cards, motion placeholders
├── db/                         # Drizzle schema and future migrations
├── docs/                       # Implementation-facing docs created during buildout
├── lib/                        # Config, db client, SEO helpers, utilities
├── public/                     # Static assets
├── styles/                     # Global Tailwind CSS and design tokens
├── types/                      # Shared TypeScript types
├── AGENTS.md                   # Agent working rules and repo map
├── CONTEXT.md                  # Current working context and checkpoint
├── ROADMAP.md                  # Working roadmap for ongoing implementation
├── README.md                   # Documentation suite overview
├── START_HERE_FOR_REPLIT_CODEX.md
├── CODEX_BOOTSTRAP_PROMPT.md
├── Project_Nexus_Master_Document.md
├── .replit                     # Replit config, Node.js 20 module
└── replit.nix                  # Nix deps
```

## Commands

- Install: `npm install`
- Dev: `npm run dev`
- Test: `npm run test`
- Typecheck: `npm run typecheck`
- Lint: `npm run lint`
- Format check: `npm run format`
- Build: `npm run build`
- Generate DB migration: `npm run db:generate`
- Apply DB migration: `npm run db:migrate`
- Seed foundation records: `npm run db:seed`
- Open Drizzle Studio: `npm run db:studio`

Useful current checks:

- Inspect git status: `git status --short --branch`
- Review tracked files: `git ls-files`

## Coding And Documentation Conventions

- Keep documentation structured, concise, and aligned with the existing numbered folder system.
- Preserve the data-first product rule: enter data once and reuse it across pages, AI answers, maps, search, and SEO.
- Prefer a modular monolith for the MVP, with clear boundaries for AI, map, entities, search, admin, submissions, and SEO.
- Keep the architecture multi-game by default; GTA VI is the first target, not a hardcoded product boundary.
- Public factual content should be sourced, verified, and marked with status.
- AI-generated or AI-assisted public facts require admin review before publishing.
- Prefer typed schemas, clear module boundaries, environment-based configuration, and tests around core logic.
- Database work must remain provider-neutral PostgreSQL unless a later product decision chooses Supabase- or Neon-specific services.
- Seed scripts must not insert unverified gameplay facts. Foundation seeds may create draft game/source records only.

## Hard Rules

- Never delete files without asking first.
- Never hardcode secrets, API keys, tokens, database URLs, or service credentials.
- Always read secrets from environment variables supplied through Replit Secrets or the production secrets manager.
- Always run tests after changing core logic. If no tests exist yet, say that clearly and run the closest available validation.
- Keep `CONTEXT.md` updated with current status, known issues, and the last checkpoint.
- Keep `ROADMAP.md` updated when scope, phase sequencing, or implementation priorities change.
