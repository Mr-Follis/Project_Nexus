# Knowledge Graph Design

## 1. Purpose

The knowledge graph is the heart of Project Nexus.

It connects game entities such as vehicles, weapons, missions, characters, businesses, collectibles, regions, map markers, guides, sources, and user progress.

The graph allows Nexus to answer questions such as:

- Where can I find this vehicle?
- Which missions unlock this weapon?
- What is the best business near this region?
- Which collectibles are near my current objective?
- What changed after the latest patch?
- What should I do next based on my current cash/progress?

## 2. Core concept

Everything is either:

- An entity
- A relationship
- A source
- A user state
- A generated view

## 3. Entity types

MVP entity types:

- Game
- Region
- Vehicle
- Weapon
- Mission
- Character
- Business
- Property
- Shop
- Collectible
- Achievement
- Activity
- Faction
- Animal
- MapMarker
- Guide
- PatchNote

Future entity types:

- Quest
- Skill
- Item
- CraftingRecipe
- Enemy
- Boss
- Dungeon
- ResourceNode
- NPC
- Class/Build

## 4. Relationship types

Common relationships:

- `LOCATED_IN`
- `SPAWNS_AT`
- `UNLOCKED_BY`
- `REQUIRES`
- `REWARDS`
- `USED_IN`
- `SOLD_BY`
- `OWNED_BY`
- `RELATED_TO`
- `BETTER_THAN_FOR`
- `PART_OF`
- `APPEARS_IN`
- `HAS_MARKER`
- `HAS_GUIDE`
- `UPDATED_BY_PATCH`
- `SUBMITTED_BY`
- `VERIFIED_BY`

## 5. Verification model

### Record status

- Draft
- Published
- Hidden
- Archived

### Verification status

- Confirmed official
- Confirmed gameplay
- Community verified
- Likely
- Speculative
- Outdated
- Rejected

### Source quality

- Official
- Direct gameplay
- Trusted community
- User submission
- Editorial research
- Third-party article
- Unknown

## 6. Data confidence

Each record can include a `confidence_score` from 0 to 100.

Suggested defaults:

- Official: 95–100
- Direct gameplay verification: 90–100
- Multiple trusted submissions: 75–90
- Single submission with evidence: 50–75
- Unverified speculation: 10–40

The AI assistant should use confidence to decide wording.

## 7. Source tracking

Every important fact should be traceable.

Source fields:

- Source type
- URL or internal reference
- Author/contributor
- Date accessed
- Date published
- Notes
- Reliability score
- Copyright/permission notes

## 8. Versioning

Every record edit should produce a version.

Version includes:

- Record ID
- Previous data
- New data
- Changed fields
- Changed by
- Change reason
- Timestamp
- Source reference

## 9. AI retrieval summaries

For each entity, generate a controlled retrieval summary:

- What it is
- Known stats
- Where to find it
- Unlock requirements
- Related records
- Verification status
- Last updated

AI should retrieve these summaries rather than raw admin data when possible.

## 10. Graph-powered product surfaces

### Map

Map markers are connected to entities and guides.

### Search

Search uses entity names, aliases, categories, and relationship context.

### AI

AI queries entity summaries, relationships, sources, and guides.

### SEO

Programmatic templates generate pages from entity data and relationships.

### Calculators

Money/ROI calculators use structured businesses, rewards, time estimates, unlocks, and user-owned records.

### Progress

User progress connects user IDs to markers/entities/objectives.

## 11. Data quality rules

- Do not publish unsourced confirmed claims.
- Do not let AI invent missing values.
- Do not overwrite official data with community speculation.
- Do not remove old data without version history.
- Do not generate SEO pages unless the entity has enough useful data.

## 12. Minimal viable graph

For MVP, the graph must support:

- Game → Entity
- Entity → MapMarker
- Entity → Guide
- Entity → Source
- Entity → Entity relationship
- User → Saved/Favourite/Found entity or marker

Everything else can be extended later.
