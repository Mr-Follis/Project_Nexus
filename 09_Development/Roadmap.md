# Development Roadmap

## 1. Build philosophy

Build the smallest complete loop first:

Data → Admin → Public page → Search → AI → Map → Analytics.

Do not build advanced features until this loop works.

## 2. Milestone 0: Setup and decisions

Deliverables:

- Repo created
- Stack finalised
- Domain/brand shortlist
- Coding standards
- Environment setup
- CI/CD foundation
- Design tokens v0
- Database migration system

Exit criteria:

- Dev can run app locally.
- Deployment pipeline works.

## 3. Milestone 1: Knowledge core

Deliverables:

- Game/entity schema
- Source schema
- Relationship schema
- Admin CRUD
- Verification statuses
- Audit log

Exit criteria:

- Admin can create GTA VI game and entities.
- Entity has source/status/version.

## 4. Milestone 2: Public pages

Deliverables:

- Game hub page
- Entity detail template
- Category pages
- SEO metadata
- Sitemap
- Last updated/verification display

Exit criteria:

- Vehicle/weapon pages render from database.

## 5. Milestone 3: Search

Deliverables:

- Search index
- Global search UI
- Result grouping
- Zero-result logging
- Entity alias support

Exit criteria:

- User can search entities/guides and click results.

## 6. Milestone 4: Map v1

Deliverables:

- Map shell
- Marker CRUD
- Marker categories
- Filter UI
- Marker detail sheet
- Entity-marker linking

Exit criteria:

- Admin creates marker and public map displays it.

## 7. Milestone 5: AI assistant v1

Deliverables:

- Retrieval chunks
- Embeddings
- Question classifier
- Answer generator
- Source/action cards
- Unknown-data handling
- AI logs

Exit criteria:

- Assistant answers from approved data and refuses unknowns safely.

## 8. Milestone 6: Community submissions

Deliverables:

- Submission form
- Evidence upload/link
- AI triage
- Duplicate detection
- Admin review queue
- Approval workflow

Exit criteria:

- Submission can become a marker/entity after approval.

## 9. Milestone 7: Design polish and motion

Deliverables:

- Motion tokens
- Component polish
- Homepage reveal
- Map animations
- AI answer card transitions
- Reduced-motion support

Exit criteria:

- Product feels premium and remains performant.

## 10. Milestone 8: SEO/content engine

Deliverables:

- Guide templates
- Programmatic page templates
- Internal linking suggestions
- FAQ generation
- Staleness dashboard

Exit criteria:

- New record can generate useful related pages and links.

## 11. Milestone 9: Analytics and launch readiness

Deliverables:

- Event tracking
- Dashboards
- Error monitoring
- Core Web Vitals monitoring
- Launch checklist
- Backup and recovery test

Exit criteria:

- Team can monitor product during launch.

## 12. Post-MVP

- Accounts
- Saved/found progress
- Money calculator
- Route planner
- Premium
- Community reputation
- Multi-game support
- Native app exploration
