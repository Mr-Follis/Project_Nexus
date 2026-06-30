# START HERE: Replit + Codex Build Instructions

**Project:** Project Nexus  
**Version:** v0.3 build starter  
**Purpose:** This file is the first document Replit/Codex should read before touching the codebase.

---

## 1. What Project Nexus is

Project Nexus is an AI-powered gaming companion platform. GTA VI is the first game hub, but the architecture must support future games.

The core rule is:

> Enter data once. Use it everywhere.

Nexus is not a normal blog. It is a structured knowledge engine where verified game data powers:

- interactive maps
- AI answers
- search
- vehicle/weapon/mission pages
- calculators
- guides
- community submissions
- SEO pages
- future game hubs

---

## 2. Your role as Codex/Replit agent

You are the implementation agent.

Do not redesign the product from scratch. Use the documentation in this repository as the source of truth.

Your first job is to create a stable, clean MVP foundation that can be extended feature by feature.

Do **not** attempt to build the whole platform in one run.

---

## 3. Read these files first

Read these in order before coding:

1. `README.md`
2. `00_Vision/Nexus_Constitution.md`
3. `01_Product/PRD.md`
4. `02_Design_Experience/Design_Manifesto.md`
5. `02_Design_Experience/Motion_System.md`
6. `03_Technical_Architecture/Tech_Stack_Replit_Codex_Hermes_v0_2.md`
7. `03_Technical_Architecture/System_Architecture.md`
8. `04_Data_Knowledge_Graph/Knowledge_Graph.md`
9. `04_Data_Knowledge_Graph/Database_Schema.sql`
10. `09_Development/Roadmap.md`
11. `09_Development/Epics_Tickets.md`
12. `10_API/openapi.yaml`

---

## 4. Confirmed stack

Use this stack unless explicitly told otherwise:

- **Build workspace:** Replit
- **Coding/refactor helper:** Codex
- **Source of truth:** GitHub
- **Frontend:** Next.js App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS with design tokens
- **Motion:** Framer Motion, added carefully and with reduced-motion support
- **Database:** PostgreSQL-ready architecture
- **ORM:** Drizzle or Prisma. Prefer Drizzle if speed/simplicity suits the Replit workflow.
- **Search later:** Typesense or Meilisearch
- **AI later:** RAG over approved internal data using embeddings/pgvector or managed vector search
- **Map later:** MapLibre GL JS
- **Production target later:** Vercel + Supabase/Neon + Cloudflare
- **Agent/cron layer later:** Hermes Agents

Replit is the build environment. Do not assume Replit must be the final production host.

---

## 5. Build approach

Use a modular monolith first.

Do not create microservices for the MVP.

The app should be easy to understand, easy to deploy, and easy for Codex/Hermes agents to maintain.

---

## 6. Sprint 1 goal

Sprint 1 is **foundation only**.

Do not build the full AI assistant, full map, full CMS, full search engine, premium system, or automation engine yet.

Create a stable base app with clean routes, structure, placeholders, design tokens, and database-ready architecture.

---

## 7. Sprint 1 tasks

Create or configure:

1. Next.js App Router project
2. TypeScript
3. Tailwind CSS
4. ESLint/Prettier or equivalent formatting
5. Clean folder structure
6. App shell/layout
7. Mobile-first navigation
8. Premium dark-first design direction
9. Basic design tokens
10. Motion-ready components
11. Homepage placeholder
12. `/gta-6` hub placeholder
13. `/gta-6/map` placeholder
14. `/gta-6/vehicles` placeholder
15. `/gta-6/weapons` placeholder
16. `/gta-6/missions` placeholder
17. `/gta-6/ask` placeholder
18. `/admin` placeholder
19. Basic component system
20. Database schema starter based on docs
21. Environment variable template
22. README setup notes
23. Basic sitemap/metadata structure
24. Unofficial fan-site disclaimer placeholder

---

## 8. Recommended folder structure

Use a structure similar to this:

```text
/app
  /(public)
  /gta-6
    /map
    /vehicles
    /weapons
    /missions
    /ask
  /admin
/components
  /ui
  /layout
  /motion
  /cards
  /search
  /map
  /ai
/lib
  /config
  /db
  /seo
  /utils
  /validation
/db
  /schema
  /migrations
/docs
/public
/styles
/types
```

Adjust only if there is a strong technical reason.

---

## 9. Design requirements

The product must feel:

- modern
- premium
- fast
- mobile-first
- cinematic but not cluttered
- motion-rich but not annoying
- more like a polished product than a gaming blog

Design inspiration:

- Rockstar GTA VI for cinematic confidence
- Apple for restraint and polish
- Linear for speed and clarity
- Framer for motion quality
- Google/Apple Maps for map UX

Do not copy Rockstar branding or visual assets.

---

## 10. Motion requirements

Use motion thoughtfully.

Motion should improve:

- orientation
- feedback
- delight
- perceived speed
- user confidence

Avoid:

- random animations
- heavy particle effects
- neon/RGB overload
- slow page transitions
- motion that hurts usability

Add reduced-motion support from the start.

---

## 11. Data rules

Do not hardcode fake GTA facts into app logic.

Use placeholder/demo records only if they are clearly marked as demo content.

Every future factual record must support:

- source
- verification status
- last updated date
- game association
- relationship links
- moderation state

The AI must never invent game facts.

---

## 12. Admin-first rule

The first real product advantage is the admin/data layer.

Public pages should eventually render from structured records, not handwritten static pages.

If deciding between “make a pretty static page” and “make a reusable data-backed template”, choose the reusable template.

---

## 13. AI rules for later phases

Do not build public AI in Sprint 1.

When built later:

- AI answers only from approved internal data
- unknown means unknown
- answers cite internal records/pages
- all expensive AI actions are logged
- public factual publishing requires admin review

---

## 14. Hermes/crons rules for later phases

Hermes Agents should be used later for:

- official source checks
- competitor monitoring
- stale content reports
- SEO opportunity reports
- community submission triage
- daily owner reports
- hourly/daily scheduled research

Hermes should prepare updates. Humans/admin should approve factual public changes at MVP stage.

---

## 15. Sprint 1 acceptance criteria

Sprint 1 is complete when:

- app runs in Replit
- homepage loads
- GTA 6 hub route loads
- map/vehicles/weapons/missions/ask/admin routes load
- mobile layout works
- basic premium visual system exists
- reusable components exist
- database schema starter exists
- environment variables are documented
- README explains local/Replit setup
- no major TypeScript errors
- no placeholder architecture that blocks future database-backed pages

---

## 16. What not to do yet

Do not build yet:

- full user accounts
- full premium billing
- full live map with real data
- public AI assistant with live model calls
- Hermes jobs
- production cron system
- complete CMS
- scraped data pipelines
- copyrighted GTA assets
- fake confirmed game stats

---

## 17. First implementation prompt

If you are asked to begin, start with the task in `CODEX_BOOTSTRAP_PROMPT.md`.

