# Agents and Automation

## 1. Automation philosophy

Humans make judgement calls. AI prepares the work.

Nexus automation should reduce repetitive tasks without compromising trust.

## 2. Automation jobs

### Job 1: Source ingestion

Input:

- Official news/update URL
- Patch notes
- Approved public source

Output:

- Summary
- Entities detected
- Proposed data changes
- Draft guide/news post
- SEO metadata
- Internal links

Human approval required before publishing material facts.

### Job 2: Submission triage

Input:

- User submission
- Evidence URL/image
- Proposed marker/entity

Output:

- Category
- Duplicate score
- Suggested existing entities
- AI summary
- Confidence estimate
- Missing evidence checklist

### Job 3: SEO page generation

Input:

- Published record or relationship set

Output:

- Page draft
- FAQ block
- Meta title/description
- Internal links
- Schema suggestion

Quality gate:

- Minimum data depth.
- No fake filler.
- Verification visible.

### Job 4: Embedding updater

Trigger:

- Published entity/guide/marker changed.

Output:

- Updated retrieval summary.
- New embeddings.
- Old chunks archived.

### Job 5: Search index updater

Trigger:

- Public record changed.

Output:

- Search document created/updated/deleted.

### Job 6: Staleness scanner

Trigger:

- Scheduled daily/weekly.
- Patch note ingested.

Output:

- Records likely affected.
- Pages needing review.
- AI answer chunks needing regeneration.

### Job 7: Trend detector

Input:

- Search logs
- AI questions
- Google Search Console data later
- Social/community topics later

Output:

- Missing pages.
- Hot topics.
- Content opportunities.
- Data gaps.

### Job 8: Internal linking updater

Trigger:

- New entity/guide/page published.

Output:

- Suggested related links.
- Hub/category updates.
- Comparison opportunities.

## 3. Automation workflow pattern

All automation follows:

1. Trigger
2. Extract
3. Validate
4. Suggest
5. Review
6. Publish
7. Reindex
8. Monitor

## 4. Queues

Recommended queues:

- `source.ingest`
- `submission.triage`
- `entity.embed`
- `search.index`
- `seo.generate`
- `page.revalidate`
- `stale.scan`
- `social.draft`

## 5. Admin review queue

Each queued AI suggestion must show:

- What changed
- Why suggested
- Source/evidence
- Confidence
- Risk level
- Affected pages
- Actions: approve, edit, reject, request proof

## 6. Automation risk controls

- No autonomous publishing of material facts.
- Rate limits for source polling.
- Duplicate detection before new records.
- Audit logs.
- Rollback support.
- Alerts for high-volume failed jobs.

## 7. MVP automation scope

Build first:

- Submission triage
- Embedding updater
- Search indexing
- SEO metadata generation
- AI guide draft generation
- Stale content dashboard v1

Defer:

- Full social autoposting
- Fully automated news publishing
- Complex trend detection
- Advanced route optimisation
