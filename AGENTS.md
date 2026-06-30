# AGENTS.md

## Project Stack

Current repository state:

- Project type: planning and documentation suite for Project Nexus.
- Runtime declared by Replit: Node.js 20.
- Nix dependencies: `unzip` only.
- Application code: not created yet.
- Package manifests: none found yet (`package.json`, lockfiles, Python manifests, Makefile, and similar command files are not present).
- API contract: OpenAPI draft at `10_API/openapi.yaml`.
- Data/schema planning: SQL draft at `04_Data_Knowledge_Graph/Database_Schema.sql`.
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

No application package or scripts exist yet, so these commands are intentionally placeholders until the app shell is created.

- Dev: not defined yet. Expected future command: `npm run dev`.
- Test: not defined yet. Expected future command: `npm test` or `npm run test`.
- Lint: not defined yet. Expected future command: `npm run lint`.
- Build: not defined yet. Expected future command: `npm run build`.

When a `package.json` is added, update this section with the exact scripts from that file.

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
- For future TypeScript app work, prefer typed schemas, clear module boundaries, environment-based configuration, and tests around core logic.

## Hard Rules

- Never delete files without asking first.
- Never hardcode secrets, API keys, tokens, database URLs, or service credentials.
- Always read secrets from environment variables supplied through Replit Secrets or the production secrets manager.
- Always run tests after changing core logic. If no tests exist yet, say that clearly and run the closest available validation.
- Keep `CONTEXT.md` updated with current status, known issues, and the last checkpoint.
- Keep `ROADMAP.md` updated when scope, phase sequencing, or implementation priorities change.
