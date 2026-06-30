# Product Requirements Document: Project Nexus

## 1. Product overview

Project Nexus is an AI-powered game companion platform that helps players find verified answers, locations, recommendations, and strategies while they play.

The first public game hub will focus on GTA VI. The platform must be designed so future games can be added through data configuration, reusable schemas, templates, map layers, AI retrieval, and game-specific content modules.

## 2. Product goals

### Goal 1: Become the best second-screen GTA VI companion

Players should use Nexus while playing because it is faster and more useful than Google, Reddit, YouTube, or static guides.

### Goal 2: Build a reusable game knowledge engine

GTA VI should prove the platform. The underlying engine must support future game hubs.

### Goal 3: Make structured data the source of truth

Every guide, map pin, AI answer, calculator, and SEO page should be generated from verified structured data where possible.

### Goal 4: Create a premium modern experience

The product should feel modern, motion-rich, mobile-first, and premium without becoming cluttered or gimmicky.

### Goal 5: Monetise without damaging trust

Monetisation should start with ads and affiliates, but long-term revenue should come from premium tools, saved progress, advanced planning, sponsorships, and possible API/data products.

## 3. Non-goals

The MVP will not:

- Build a native mobile app.
- Include real-time game telemetry unless a compliant API/integration exists.
- Publish confidential leaks.
- Copy competitor databases.
- Build every game at once.
- Build advanced route optimisation before map/data foundations exist.
- Launch a paid tier before the core free experience is useful.

## 4. Target users

### Player persona A: The quick-answer player

Needs:

- “Where is this?”
- “How do I unlock this?”
- “What should I do next?”

Success means receiving a reliable answer in under 10 seconds.

### Player persona B: The completionist

Needs:

- Map markers
- Progress tracking
- Checklists
- Achievements/trophies
- Spoiler controls

Success means knowing exactly what remains to complete.

### Player persona C: The grinder/optimizer

Needs:

- Money calculators
- Business ROI
- Route planning
- Upgrade priorities
- Best vehicles/weapons

Success means maximising reward per play session.

### Player persona D: The community discoverer

Needs:

- Submit discoveries
- Get credit
- Correct outdated data
- Share screenshots/video proof

Success means contributing to a living knowledge base.

### Admin persona

Needs:

- Review submissions
- Maintain data quality
- Use AI to draft/summarise/extract
- Publish updates fast
- Track stale content

Success means a small team can maintain a large database.

## 5. Core features

### 5.1 Game hub

The GTA VI hub is the main landing page for the first game.

Requirements:

- Hero section with strong visual identity and motion.
- Search-first entry point.
- Quick links to map, vehicles, weapons, missions, money, collectibles, news, and AI assistant.
- Clear data status: pre-release, confirmed, community-verified, speculative, outdated.
- SEO-friendly content and internal linking.
- Email capture/waitlist.

Acceptance criteria:

- User can reach key modules from the first screen on mobile.
- Page loads quickly on mobile.
- Page does not rely on copied Rockstar assets beyond legally permitted embeds/links or original artwork.

### 5.2 Global search

Requirements:

- Search vehicles, weapons, missions, guides, map markers, businesses, properties, characters, FAQs.
- Typo tolerance.
- Mobile-first search UI.
- Results grouped by type.
- “Ask Nexus” fallback when exact result is not found.
- Admin log of failed searches.

Acceptance criteria:

- Common queries return useful results in under one second where cached/indexed.
- Failed queries are stored for content/data improvements.

### 5.3 AI assistant

Requirements:

- Answers only from verified internal data and approved content.
- Shows source links to Nexus pages.
- Clearly labels unknown, speculative, or outdated data.
- Supports questions about vehicles, weapons, missions, locations, collectibles, money, progress, and comparisons.
- Can return structured actions: open map pin, compare items, show route, save objective.
- Logs unanswered questions for admin review.

Acceptance criteria:

- AI never invents stats when missing.
- AI shows at least one related internal source when answering factually.
- AI can say “we do not have that confirmed yet.”

### 5.4 Interactive map

Requirements:

- Pan/zoom map.
- Marker filtering by category.
- Search within map.
- Marker detail drawer.
- Related entity links.
- User save/found state later.
- Community submission entry point.
- Mobile bottom sheet pattern.
- Marker clustering.
- Lazy-loaded markers.

MVP marker categories:

- Vehicles
- Weapons
- Missions
- Collectibles
- Businesses
- Shops
- Properties
- Easter eggs
- Activities
- Safe houses
- POIs

Acceptance criteria:

- Map remains usable on mobile.
- Markers can link to database records.
- Admin can add/edit markers.
- Map supports category filters.

### 5.5 Vehicle database

Requirements:

- List all confirmed/known vehicles with filtering and status labels.
- Vehicle detail page.
- Category pages.
- Comparison pages later.
- Relationships to map markers, missions, shops, unlocks, guides.

Fields:

- Name
- Slug
- Game
- Category
- Manufacturer
- Price
- Top speed
- Acceleration
- Handling
- Braking
- Seats
- Acquisition methods
- Spawn locations
- Unlock requirements
- Customisation
- Best use case
- Source status
- Last verified date

Acceptance criteria:

- Admin can create vehicle records.
- Public pages are generated from records.
- Empty fields do not generate fake text.

### 5.6 Weapons database

Similar structure to vehicles.

Fields:

- Name
- Type
- Damage
- Range
- Fire rate
- Accuracy
- Price
- Unlock condition
- Purchase location
- Ammo type
- Attachments
- Best use case
- Related missions
- Map markers

### 5.7 Mission guides

Requirements:

- Mission detail pages.
- Spoiler controls.
- Objectives.
- Rewards.
- Requirements.
- Recommended loadout.
- Common fail points.
- Related map pins.
- Related unlocks.
- FAQ.

Acceptance criteria:

- Guide template supports spoiler-free mode.
- Mission pages can be generated from database and enhanced manually.

### 5.8 Money/business calculators

MVP calculator requirements:

- User enters available cash, play time, solo/online status if relevant, owned businesses, and preferred play style.
- Output recommends method, estimated reward, time, requirements, and next steps.

Later:

- Route planner
- Business ROI
- Upgrade optimiser
- “How long to earn X?” calculator

### 5.9 Community submissions

Requirements:

- Submit location/item/discovery/correction.
- Optional screenshot/evidence URL.
- Category selection.
- AI duplicate detection.
- Admin approval queue.
- Contributor credit when approved.
- Spam prevention.

Acceptance criteria:

- Submission does not publish automatically.
- Admin sees AI summary, suggested entity links, duplicate warnings, and verification status.

### 5.10 Admin CMS

Requirements:

- Role-based access.
- Entity CRUD.
- Marker CRUD.
- Guide editor.
- Submission queue.
- Source management.
- Version history.
- AI suggestions.
- Publishing workflow.
- SEO metadata editor.
- Staleness dashboard.

Acceptance criteria:

- Admin can create a vehicle, add marker, publish page, and see it in search/map.
- Every edit is versioned.

## 6. Design requirements

Design is a product requirement, not cosmetic polish.

Requirements:

- Mobile-first.
- Modern, premium, and motion-rich.
- Inspired by cinematic gaming energy but not a copy of Rockstar.
- Calm information hierarchy.
- Strong typography.
- Large tap targets.
- Smooth micro-interactions.
- Signature motion moments.
- Dark mode first, light mode later.
- Accessibility by default.

Acceptance criteria:

- Core mobile flows usable one-handed.
- Motion can be reduced via system preference.
- No critical functionality depends on animation.

## 7. Data requirements

Every data record must include:

- ID
- Game ID
- Name/title
- Type
- Slug
- Status
- Verification status
- Source references
- Created/updated timestamps
- Last verified timestamp
- Version history

Verification statuses:

- Confirmed official
- Confirmed gameplay
- Community verified
- Likely
- Speculative
- Outdated
- Rejected

## 8. SEO requirements

Each indexable page requires:

- Human-readable URL
- Unique title
- Meta description
- H1
- Structured data where appropriate
- Last updated date
- Internal links
- Canonical URL
- Sitemap inclusion
- Content quality checks
- No thin AI-only pages

## 9. Analytics requirements

Track:

- Search queries
- Zero-result searches
- AI questions
- AI helpfulness
- Map filters used
- Marker opens
- Saved/found actions
- Submission starts/completions
- SEO landing pages
- Revenue events
- Core Web Vitals

## 10. MVP scope

### Must-have

- Public GTA VI hub
- Search
- AI assistant v1
- Interactive map v1
- Vehicle database
- Weapon database
- Guide template
- Admin CMS
- Community submissions
- SEO foundation
- Analytics
- Basic monetisation slots

### Should-have

- Money calculator v1
- Email capture
- Saved favourites
- Spoiler-free mode
- FAQ blocks

### Could-have

- Accounts
- Progress tracking
- Route planner
- Premium
- Social posting automation

### Not yet

- Native mobile app
- Live game telemetry
- Full multi-game support
- Advanced community reputation

## 11. Success metrics

Pre-launch:

- Pages indexed
- Organic impressions
- Waitlist signups
- Search usage
- Returning users

Launch:

- Daily active users
- Map interactions
- AI questions
- Time to answer
- Approved submissions
- Pages per session

Retention:

- Return sessions
- Saved markers
- Completion tracking usage
- AI repeat usage

Revenue:

- RPM
- Affiliate CTR
- Premium conversion later

Quality:

- Verified record percentage
- Outdated reports
- AI hallucination reports
- Duplicate submission rate

## 12. Open questions

- Final public brand/domain.
- Final monetisation timing.
- Whether to use custom tile map or image map overlay for GTA VI.
- Whether to include speculative pre-release data in public pages or hide behind filters.
- What legal guidance is required before launch.
- Which ad network/affiliate partners are realistic early.
- Whether a forum/Discord should be owned directly or avoided early.
