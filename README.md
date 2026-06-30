# Project Nexus Documentation Suite v0.3

**Date:** 2026-06-30  
**Status:** Build Pack v0.3 with Replit/Codex starter instructions  
**Codename:** Project Nexus  
**Core idea:** An AI-powered game companion platform where structured game knowledge powers maps, search, AI answers, guides, calculators, SEO pages, and future game hubs.

This pack is designed to move Project Nexus from chat/idea stage into build planning. It is not a final legal, financial, or production engineering sign-off, but it is a complete first documentation suite that a product/development team can use to estimate, design, and start implementation.

## What is included

```text
Project_Nexus_Documentation_Suite_v0_1/
├── README.md
├── 00_Vision/
├── 01_Product/
├── 02_Design_Experience/
├── 03_Technical_Architecture/
├── 04_Data_Knowledge_Graph/
├── 05_AI_Automation/
├── 06_SEO_Growth/
├── 07_Business/
├── 08_Launch/
├── 09_Development/
├── 10_API/
├── 11_Diagrams/
└── 12_Sources/
```

## Replit/Codex build start

If using Replit and Codex, start with:

1. `START_HERE_FOR_REPLIT_CODEX.md`
2. `CODEX_BOOTSTRAP_PROMPT.md`

Do not ask Codex to build the entire platform at once. Begin with Sprint 1 foundation, then progress through the roadmap and tickets.

## Recommended reading order

1. `00_Vision/Nexus_Constitution.md`
2. `01_Product/PRD.md`
3. `02_Design_Experience/Design_Manifesto.md`
4. `03_Technical_Architecture/System_Architecture.md`
5. `04_Data_Knowledge_Graph/Knowledge_Graph.md`
6. `05_AI_Automation/AI_Assistant_RAG.md`
7. `09_Development/Roadmap.md`
8. `09_Development/Epics_Tickets.md`

## Core product rule

> Enter data once. Use it everywhere.

The product should not be a pile of articles. It should be a structured knowledge engine. Articles, AI answers, map pins, comparisons, calculators, and SEO pages are all views over the same verified data.

## Launch context

GTA VI is the first target market because the release window creates a rare demand spike. The architecture must not be GTA-only. It must support many future games through reusable data schemas, map layers, AI retrieval, user progress tracking, and programmatic SEO templates.

## Implementation note

This pack intentionally prioritises a practical MVP over fantasy features. The long-term vision is ambitious, but the build starts with:

- Knowledge graph data model
- Admin CMS
- Public game hub
- Interactive map shell
- Search
- AI assistant using verified data
- SEO templates
- Community submission workflow
- Analytics
- Launch checklist

## Key build decision

Nexus should feel like a premium product, not a gaming blog. Mobile-first, second-screen usage, modern motion, fast search, and a calm interface are product requirements, not polish.

## Sprint 1 Foundation App

This repository now includes the Sprint 1 foundation for the Project Nexus app:

- Next.js App Router
- TypeScript
- Tailwind CSS design tokens
- Mobile-first dark UI shell
- Placeholder and database-aware public routes
- Admin placeholder route
- Motion-ready component structure
- Drizzle/PostgreSQL-ready schema starter
- Drizzle migration baseline and database health check
- Environment variable template
- Basic sitemap, robots, and metadata structure
- Published-record rendering shell for vehicle, weapon, and mission category pages
- Public entity detail route for published knowledge records
- Source attribution section for public entity detail records
- Last-updated metadata display for public knowledge records
- Public search API fallback for published entity records
- Public search page for the GTA VI hub
- Public map marker API and database-aware map shell
- Public community submission API for moderation intake
- Public community submission form for the GTA VI hub
- OpenAPI draft aligned with implemented Next API routes
- Image-backed home and GTA VI hub heroes using an original generated backdrop

Sprint 1 intentionally does not implement live AI, a full map, search indexing, CMS CRUD, community submissions, or real GTA VI factual data.

## Run In Replit

1. Install dependencies:

   ```bash
   npm install
   ```

2. Add Replit Secrets when database work begins:

   ```text
   DATABASE_URL
   NEXT_PUBLIC_SITE_URL
   NEXT_PUBLIC_SITE_NAME
   ```

   `DATABASE_URL` is optional for the placeholder UI. It is required before using the database client or migrations.

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the Replit web preview. The dev server binds to `0.0.0.0` for Replit.

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run format
npm run test:unit
npm run test
npm run validate
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:studio
```

`npm run test:unit` runs the Vitest unit suite.
`npm run test` runs unit tests, typecheck, and lint.
`npm run validate` runs format check, test, and production build. GitHub Actions runs the same validation on pushes to `main` and on pull requests.

## Database

The database foundation is provider-neutral PostgreSQL using Drizzle. Set `DATABASE_URL` in Replit Secrets before running migrations or using database-backed routes.

Useful commands:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:studio
```

The safe health route is available at:

```text
/api/health/db
/api/health/knowledge
```

If `DATABASE_URL` is missing, it reports `configured: false` without crashing the placeholder app.

The first public read APIs are available at:

```text
/api/games
/api/games/[gameSlug]
/api/games/[gameSlug]/entities
/api/games/[gameSlug]/entities/[entitySlug]
/api/games/[gameSlug]/map/markers
/api/search?q=vehicle&game=gta-6
/api/submissions
```

They return only published records and safely report `configured: false` when `DATABASE_URL` is missing. Search uses PostgreSQL matching as the MVP fallback until a dedicated search provider is selected.

`POST /api/submissions` creates `new` moderation records only. It does not publish submitted content.

`npm run db:seed` creates only foundation records: a draft `gta-6` game row and official source records. It does not seed gameplay facts, stats, locations, or AI content.

## Sprint 1 Routes

- `/`
- `/gta-6`
- `/gta-6/map`
- `/gta-6/vehicles`
- `/gta-6/weapons`
- `/gta-6/missions`
- `/gta-6/entities/[entitySlug]`
- `/gta-6/search`
- `/gta-6/submit`
- `/gta-6/ask`
- `/admin`
