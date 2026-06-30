# System Architecture

## 1. Architecture goal

Build a modular, data-first platform that supports:

- Public SEO pages
- Fast search
- Interactive maps
- AI assistant/RAG
- Admin CMS
- Community submissions
- Automation jobs
- Multi-game expansion

The MVP should be simple enough to build quickly but structured enough to scale.

## 2. Recommended MVP stack

### Frontend

- Next.js App Router
- TypeScript
- Tailwind CSS or token-based CSS system
- Server-rendered and statically generated pages where possible
- Client components for map, AI chat, and interactive widgets

### Backend

- Next.js API routes/server actions for MVP
- PostgreSQL via Supabase or Neon
- Prisma or Drizzle ORM
- Background worker service for AI/automation

### Search

- Typesense or Meilisearch for fast keyword/faceted search
- PostgreSQL full-text fallback
- Vector search via pgvector for AI retrieval

### AI

- RAG over approved content and structured data
- Structured outputs for extraction/classification
- Admin approval before publishing AI-generated changes

### Map

- MapLibre GL JS for vector map rendering where appropriate
- Custom image/tile map layer if official/usable game map assets become available legally
- Marker clustering and lazy loading

### Hosting

- Vercel for frontend
- Supabase/Neon for database
- Cloudflare for CDN, caching, WAF
- Object storage for images/proofs
- Queue service such as Inngest, Trigger.dev, BullMQ, or Supabase queues depending stack decision

## 3. High-level services

### Web App

Public site, SEO pages, map, search, AI UI, user accounts.

### Admin App

Internal tools for data, submissions, guides, AI review, sources, and moderation.

### API Layer

Exposes data to frontend and AI tools.

### Knowledge Graph Store

Postgres relational schema for entities and relationships.

### Search Index

Keyword/faceted search over public entities, guides, markers, and FAQs.

### Vector Index

Embeddings over approved text chunks and structured summaries.

### AI Orchestrator

Handles retrieval, prompt assembly, structured output validation, and tool actions.

### Automation Workers

Runs ingestion, SEO generation, embeddings, freshness checks, duplicate checks, and scheduled jobs.

### Analytics Pipeline

Captures events, dashboards, funnels, and quality metrics.

## 4. Read/write patterns

### Read-heavy public traffic

Most public pages should be cached and statically generated where possible.

- Entity pages
- Category pages
- Guide pages
- SEO pages

Dynamic:

- User progress
- AI assistant
- Search suggestions
- Map interactions

### Write-heavy admin/community

Writes should go through validation and queues.

- Community submissions
- Admin record edits
- AI suggestions
- Embedding updates
- Search reindexing

## 5. Caching strategy

### Public pages

- Static generation for stable entity pages.
- Revalidate after data changes.
- Cache route/category pages.

### API

- Cache common query results.
- Cache AI answers where query and context match.
- Cache map marker tiles/layers.

### Search

- Search index updated on publish.
- Failed/zero-result searches stored.

## 6. Multi-game architecture

Every entity belongs to a `game_id`.

Core schemas should be cross-game:

- Game
- Entity
- Relationship
- MapMarker
- Guide
- Source
- Submission
- UserProgress
- AIChunk

Game-specific fields can live in typed extension tables:

- Vehicle
- Weapon
- Mission
- Business
- Collectible
- Achievement

## 7. Data update flow

1. Admin/community/automation proposes a change.
2. Data is validated.
3. Change enters review if needed.
4. Approved change updates primary database.
5. Search index updates.
6. Embeddings update.
7. Related pages revalidate.
8. Sitemap updates.
9. Audit log records change.

## 8. AI answer flow

1. User asks question.
2. Query classifier identifies intent and entities.
3. Retrieval fetches structured data and approved content chunks.
4. AI composes answer with guardrails.
5. Response includes status and sources.
6. Actions are returned as structured cards.
7. Analytics logs query, retrieval, helpfulness, and failure signals.

## 9. Security architecture

- Public read APIs only expose published/approved data.
- Admin routes protected by role-based access.
- Submissions rate-limited and spam checked.
- User uploads scanned/validated.
- AI tools cannot directly publish without permission.
- Audit logs for all admin edits.
- Secrets stored in environment manager.

## 10. Performance targets

Initial targets:

- LCP under 2.5s for key pages on good mobile connections.
- Search result response under 500ms p95 for indexed queries.
- Map initial interaction under 2s.
- AI first response chunk under 2s for cached/retrieved answers where possible.
- Public pages cached globally.

## 11. Observability

Track:

- Core Web Vitals
- API latency
- Search latency
- AI latency/cost
- Error rates
- Queue failures
- Submission spam rate
- Reindex failures
- Page revalidation failures

## 12. Architecture decision: monolith first

Start with a modular monolith rather than microservices.

Why:

- Faster to build.
- Easier to change.
- Lower operational burden.
- Team likely small.

But keep boundaries clear:

- `features/ai`
- `features/map`
- `features/entities`
- `features/search`
- `features/admin`
- `features/submissions`
- `features/seo`

Split services only when scale demands it.
