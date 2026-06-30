# Project Nexus Tech Stack v0.2: Replit, Codex and Hermes Agents

## Purpose

This document updates the Project Nexus technical plan to reflect the real working style: building inside Replit with Codex, while using Hermes Agents for scheduled AI operations, cron jobs, monitoring, research workflows and internal automation.

## Stack summary

Project Nexus should use a three-layer execution model:

1. **Product layer**: the public app, admin app, database, search, map and AI assistant.
2. **Build layer**: Replit workspace plus Codex for fast development and refactoring.
3. **Operations/agent layer**: Hermes Agents for scheduled intelligence, cron workflows, research, QA, monitoring and admin preparation.

Hermes should not replace the core app architecture. It should sit above the app as an automation and operations layer.

## Recommended MVP stack

### Frontend

- Next.js App Router
- TypeScript
- Tailwind CSS or token-based CSS system
- Framer Motion for premium motion and micro-interactions
- Mobile-first responsive layout
- Server-rendered and statically generated SEO pages where possible
- Client components for map, AI chat, account progress and interactive tools

### Development environment

- Replit as the main build workspace if that remains the preferred workflow
- Codex CLI/agent for code generation, refactors, tests, bug fixes and repetitive implementation work
- GitHub repository as the long-term source of truth
- Pull-request style workflow even if the first phase is built by one person

### Backend

- Next.js API routes/server actions for MVP
- PostgreSQL via Supabase or Neon
- Prisma or Drizzle ORM
- Row-level security where useful, especially for user progress and submissions
- Modular monolith first, with clear boundaries for map, entities, search, AI, submissions, admin and SEO

### Database and knowledge graph

- PostgreSQL as the source of truth
- Relational entities for games, vehicles, weapons, missions, map markers, guides, sources, submissions and users
- Edge/relationship tables for the knowledge graph
- Versioning tables for every material content/data change
- Source attribution and verification status on every fact

### Search

- Typesense or Meilisearch for fast keyword and faceted search
- PostgreSQL full-text search as fallback
- pgvector for AI retrieval and semantic search
- Zero-result query logging to discover missing content

### AI

- RAG over approved structured data and approved guide chunks
- AI assistant only answers from trusted internal data
- Structured outputs for extraction, classification, summaries and admin suggestions
- AI-generated public content requires admin review for factual claims
- Cache common AI answers to control cost

### Map

- MapLibre GL JS or equivalent for performant interactive map rendering
- Custom tile/image-layer support if legally usable map assets become available
- Marker clustering and lazy loading
- Mobile-first bottom sheet marker UX
- Saved/found markers for logged-in users

### Hosting and deployment

Preferred production stack:

- Vercel for Next.js frontend and API routes
- Supabase or Neon for Postgres
- Cloudflare for DNS, CDN, WAF and bot protection
- Object storage for screenshots, proof images and user uploads
- Dedicated worker/queue layer for jobs that should not run inside a request lifecycle

Alternative Replit-friendly MVP:

- Replit for building and early deployment
- Replit Autoscale for the public web app if keeping everything inside Replit
- Replit Scheduled Deployments for simple periodic scripts
- Move to Vercel/Cloudflare/Supabase when traffic, SEO and reliability requirements increase

## Hermes Agents role

Hermes Agents should become the agentic operations layer for Project Nexus.

Hermes should handle:

- Scheduled research scans
- Official news and update checks
- Patch note analysis
- Competitor monitoring
- Broken-link checks
- SEO opportunity reports
- Stale-content detection
- Community-submission triage
- Duplicate submission grouping
- Drafting admin-ready updates
- Daily summaries for the owner/admin
- Creating issues/tickets from findings
- Running non-LLM scripts on a schedule where possible

Hermes should not directly publish factual game data to the public site without approval in the MVP.

## Cron and scheduled job architecture

Use a layered cron model.

### 1. App-level crons

Used for deterministic product jobs:

- Revalidate pages
- Refresh sitemap
- Update search index
- Process queue batches
- Expire caches
- Run health checks
- Send email digests
- Run backups

These can be handled by Vercel Cron, Supabase Cron, Replit Scheduled Deployments, or a queue provider depending final deployment.

### 2. Hermes agent crons

Used for judgement-heavy or research-heavy operations:

- Scan official sources
- Summarise changes
- Compare competitor pages
- Prepare admin review drafts
- Find missing content opportunities
- Group suspicious community submissions
- Write daily owner report

### 3. Event-driven jobs

Triggered by product actions:

- Admin approves new vehicle -> generate page, update search, update embeddings, update sitemap
- Admin approves map marker -> update map layer, related pages and AI knowledge
- User submits discovery -> classify, duplicate-check, queue for moderation
- Guide updated -> refresh embeddings and internal links

## Recommended schedule

### Hourly

- Check official Rockstar/news source changes
- Scan community submissions and group duplicates
- Check zero-result searches and trending internal queries
- Process pending embedding/index queues
- Check site health and job failures

### Daily

- SEO opportunity report
- Stale content scan
- Broken link scan
- Competitor feature/content delta report
- Analytics summary
- Cost report for AI usage
- Backup verification

### Weekly

- Full content quality audit
- Internal-link audit
- Knowledge graph relationship gap report
- Database cleanup suggestions
- Monetisation report
- Feature backlog grooming

### On publish/update

- Rebuild affected pages
- Update sitemap
- Update search index
- Update vector embeddings
- Refresh related rankings/comparison pages
- Log change history

## AI cost-control rules

- Do not use AI for work a script can do.
- Use cheap deterministic jobs for fetching, diffing, indexing and status checks.
- Use AI only for judgement, extraction, classification, summarisation or recommendation.
- Cache repeated AI answers.
- Batch similar AI tasks.
- Keep public assistant grounded to approved internal data.
- Log every expensive AI run with purpose, model, token usage and output status.

## Security rules for agents

- Hermes must use restricted credentials.
- Separate read-only research credentials from write-capable credentials.
- Production database writes should go through controlled API endpoints, not raw database access, unless explicitly approved.
- Dangerous actions require human confirmation.
- Agent outputs should go to review queues, not straight to public pages.
- Every agent action should be logged.
- Secrets must stay in environment variables/secrets stores, never in prompts or docs.

## Recommended build order with this stack

1. Set up GitHub repo and Replit workspace.
2. Build Next.js app shell.
3. Add Postgres schema and ORM.
4. Build admin CMS basics.
5. Add entity database pages.
6. Add map v1.
7. Add search.
8. Add AI assistant with RAG over approved data.
9. Add event-driven jobs for indexing and embeddings.
10. Add Hermes crons for daily/hourly research and reports.
11. Add community submissions and moderation queue.
12. Add SEO automation.
13. Harden production deployment and monitoring.

## Architecture decision

Project Nexus should be a modular monolith for the MVP, supported by external queues and Hermes agent workflows.

Avoid microservices early. The system should be easy to build, easy to debug and easy for Codex/Hermes agents to work on. Split services only when scaling or operational pain demands it.

