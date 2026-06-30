# Technical Decisions / ADRs

## ADR-001: Build as a modular monolith first

### Decision

Use a modular monolith for MVP.

### Why

The project needs speed, iteration, and consistency more than distributed-service complexity. A small team should not manage unnecessary microservices on day one.

### Trade-off

Later extraction may be required for search, AI workers, or map services. Clear boundaries now reduce future migration pain.

## ADR-002: Postgres as source of truth

### Decision

Use Postgres for core relational data and knowledge graph relationships.

### Why

Nexus data has strong relationships, consistency needs, audit/history requirements, and multi-game structure.

### Trade-off

A graph database may be attractive later, but Postgres with relationship tables is simpler and robust for MVP.

## ADR-003: Separate verified data from generated content

### Decision

AI-generated drafts are not source of truth. Structured records and approved guide content are source of truth.

### Why

Prevents hallucinated facts from polluting the platform.

## ADR-004: Use verification status everywhere

### Decision

Every record, marker, guide, and AI answer should expose verification state.

### Why

Trust is a differentiator. Pre-release and post-patch uncertainty must be obvious.

## ADR-005: AI cannot publish directly

### Decision

AI can suggest, draft, classify, summarise, and extract. Publishing requires human approval for material game facts.

### Why

Protects accuracy, legal safety, and brand trust.

## ADR-006: Mobile-first design

### Decision

All UX decisions are validated on mobile first.

### Why

Console players will use Nexus as a second screen. Desktop is important but secondary for gameplay sessions.

## ADR-007: Programmatic SEO only from useful data

### Decision

Do not generate thousands of thin pages from weak data.

### Why

Quality and long-term ranking matter. Data depth, uniqueness, and usefulness must drive page creation.

## ADR-008: Map is a product surface, not an embedded widget

### Decision

The map is a first-class Nexus experience connected to entities, AI, progress, and guides.

### Why

This creates differentiation against basic map sites and static database pages.

## ADR-009: Design motion as a system

### Decision

Motion tokens and rules are required before extensive UI build.

### Why

Motion is central to the “wow” feel but must remain consistent, performant, and accessible.

## ADR-010: Future game readiness from day one

### Decision

Every core schema includes `game_id`, and game-specific logic should be adapter-based where possible.

### Why

Prevents GTA-only architecture from blocking future expansion.
