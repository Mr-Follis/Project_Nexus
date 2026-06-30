# Epics and Initial Tickets

## Epic 1: Project setup

### Ticket 1.1: Create monorepo/project structure

Acceptance criteria:

- App runs locally.
- TypeScript configured.
- Linting/formatting configured.
- Environment variables documented.

### Ticket 1.2: CI/CD pipeline

Acceptance criteria:

- Pull requests run typecheck/lint/tests.
- Main branch deploys to staging.

## Epic 2: Database and data model

### Ticket 2.1: Add core schema migrations

Acceptance criteria:

- Games/entities/sources/relationships tables exist.
- Verification enums added.
- Migration is repeatable.

### Ticket 2.2: Add extension tables

Acceptance criteria:

- Vehicles/weapons/missions/businesses/collectibles tables exist.

### Ticket 2.3: Add audit logging

Acceptance criteria:

- Admin edits create audit records.

## Epic 3: Admin CMS

### Ticket 3.1: Admin authentication

Acceptance criteria:

- Admin-only routes protected.
- Roles supported.

### Ticket 3.2: Entity CRUD

Acceptance criteria:

- Admin can create/edit/publish/hide entity.
- Status and verification editable.

### Ticket 3.3: Source management

Acceptance criteria:

- Admin can attach sources to entity fields.

### Ticket 3.4: Marker CRUD

Acceptance criteria:

- Admin can add marker and link to entity.

## Epic 4: Public app

### Ticket 4.1: GTA VI hub page

Acceptance criteria:

- Renders core sections.
- Mobile-first layout.
- Search entry visible above fold.

### Ticket 4.2: Entity detail pages

Acceptance criteria:

- Vehicle/weapon pages render from database.
- Verification/status visible.

### Ticket 4.3: Category pages

Acceptance criteria:

- Filter/list entities by type/category.

## Epic 5: Search

### Ticket 5.1: Search index integration

Acceptance criteria:

- Published entities indexed.
- Draft/hidden entities excluded.

### Ticket 5.2: Search UI

Acceptance criteria:

- Mobile command-sheet search.
- Results grouped by type.

### Ticket 5.3: Zero-result logging

Acceptance criteria:

- No-result queries saved for admin.

## Epic 6: Map

### Ticket 6.1: Map shell

Acceptance criteria:

- Map loads on mobile/desktop.
- Basic pan/zoom.

### Ticket 6.2: Marker rendering

Acceptance criteria:

- Published markers visible.
- Markers filtered by category.

### Ticket 6.3: Marker detail sheet

Acceptance criteria:

- Tap marker opens detail sheet.
- Links to entity/guide.

## Epic 7: AI assistant

### Ticket 7.1: Retrieval chunk generation

Acceptance criteria:

- Published entities generate retrieval summaries.

### Ticket 7.2: Embeddings pipeline

Acceptance criteria:

- Chunks embedded and searchable.

### Ticket 7.3: Assistant API

Acceptance criteria:

- Query returns structured answer schema.
- Unknowns handled safely.

### Ticket 7.4: Assistant UI

Acceptance criteria:

- Answer cards, actions, sources rendered.

## Epic 8: Community submissions

### Ticket 8.1: Submission form

Acceptance criteria:

- User can submit discovery/correction with evidence.

### Ticket 8.2: AI triage

Acceptance criteria:

- AI categorises submission and detects potential duplicates.

### Ticket 8.3: Review queue

Acceptance criteria:

- Admin can approve/edit/reject.

## Epic 9: Design system

### Ticket 9.1: Design tokens

Acceptance criteria:

- Colour/type/spacing/radius/motion tokens in code.

### Ticket 9.2: Core components

Acceptance criteria:

- Buttons/cards/badges/search/sheets implemented.

### Ticket 9.3: Motion system

Acceptance criteria:

- Motion tokens applied.
- Reduced-motion support.

## Epic 10: SEO and analytics

### Ticket 10.1: Sitemap/canonicals

Acceptance criteria:

- Published pages appear in sitemap.
- Canonicals correct.

### Ticket 10.2: SEO metadata generator

Acceptance criteria:

- Metadata generated from records and reviewable.

### Ticket 10.3: Analytics events

Acceptance criteria:

- Core search/map/AI events tracked.

## Epic 11: Launch readiness

### Ticket 11.1: Legal pages/disclaimer

Acceptance criteria:

- Privacy, terms, unofficial disclaimer published.

### Ticket 11.2: Monitoring

Acceptance criteria:

- Errors, performance, queues monitored.

### Ticket 11.3: Load test core pages

Acceptance criteria:

- Public read traffic handles expected launch spikes via caching.
