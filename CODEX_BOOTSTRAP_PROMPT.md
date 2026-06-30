# Codex Bootstrap Prompt for Project Nexus

Paste this into Replit/Codex to begin implementation.

---

We are building **Project Nexus**, an AI-powered gaming companion platform. GTA VI is the first game hub, but the architecture must support future games.

Before coding, read the documentation in this project, especially:

- `START_HERE_FOR_REPLIT_CODEX.md`
- `README.md`
- `01_Product/PRD.md`
- `02_Design_Experience/Design_Manifesto.md`
- `02_Design_Experience/Motion_System.md`
- `03_Technical_Architecture/Tech_Stack_Replit_Codex_Hermes_v0_2.md`
- `04_Data_Knowledge_Graph/Knowledge_Graph.md`
- `04_Data_Knowledge_Graph/Database_Schema.sql`
- `09_Development/Epics_Tickets.md`

Build **Sprint 1: Foundation only**.

Use:

- Next.js App Router
- TypeScript
- Tailwind CSS
- PostgreSQL-ready architecture
- Drizzle or Prisma ORM
- Mobile-first design
- Premium modern UI
- Motion-ready component structure, with reduced-motion support

Do **not** build every feature yet.

Create the initial foundation with:

1. App shell
2. Homepage placeholder
3. `/gta-6` hub placeholder
4. `/gta-6/map` placeholder
5. `/gta-6/vehicles` placeholder
6. `/gta-6/weapons` placeholder
7. `/gta-6/missions` placeholder
8. `/gta-6/ask` placeholder
9. `/admin` placeholder
10. Shared layout/navigation
11. Design token setup
12. Basic UI component system
13. Motion-ready components
14. Database schema starter based on the provided SQL/data docs
15. Environment variable template
16. README setup instructions
17. Basic SEO metadata structure
18. Unofficial fan-site disclaimer placeholder

Architecture rules:

- Keep the app modular.
- Use `/docs` for project documentation.
- Use `/components` for reusable UI.
- Use `/lib` for utilities and clients.
- Use `/app` for routes.
- Use `/db` for database schema and migrations.
- Do not hardcode fake GTA data into app logic.
- Prepare for future Supabase/Neon PostgreSQL connection.
- Prepare for future Hermes agent cron workflows.
- Prepare for future AI/RAG, but do not implement live AI calls yet.
- Prepare for future MapLibre map, but do not implement the full map yet.
- Keep the design clean, premium, modern, cinematic, mobile-first, and fast.
- Do not copy Rockstar branding, art, or assets.

When finished, provide:

- summary of files created/changed
- how to run the app in Replit
- any environment variables needed
- known limitations
- suggested next task

The goal is a stable foundation we can build on, not a finished product.
