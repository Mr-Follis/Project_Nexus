# Analytics and KPIs

## 1. North Star metric

**Minutes actively helped per player session.**

Definition: time where the user is engaging with Nexus features that directly help gameplay: search, map, AI, guides, progress, calculators.

## 2. Core event taxonomy

### Search

- `search_opened`
- `search_submitted`
- `search_result_clicked`
- `search_zero_results`
- `search_ask_nexus_clicked`

### AI

- `ai_question_submitted`
- `ai_answer_rendered`
- `ai_action_clicked`
- `ai_answer_helpful`
- `ai_answer_not_helpful`
- `ai_unknown_answer`

### Map

- `map_opened`
- `map_filter_applied`
- `map_marker_clicked`
- `map_marker_saved`
- `map_marker_found`
- `map_route_started`

### Entity pages

- `entity_page_viewed`
- `entity_related_clicked`
- `entity_map_clicked`
- `entity_report_issue_clicked`

### Community

- `submission_started`
- `submission_completed`
- `submission_duplicate_warning_seen`
- `submission_approved`

### Progress

- `progress_item_saved`
- `progress_item_completed`
- `progress_region_completed`

### Monetisation

- `ad_viewed`
- `affiliate_clicked`
- `premium_viewed`
- `premium_started`
- `premium_subscribed`

## 3. Dashboards

### Product dashboard

- DAU/WAU/MAU
- Sessions per user
- Active helped minutes
- Top features
- Return rate

### Search dashboard

- Top searches
- Zero-result searches
- Searches leading to AI
- CTR by result type

### AI dashboard

- Questions/day
- Helpful rate
- Unknown rate
- Average latency
- Cost per answer
- Top failed intents

### Map dashboard

- Opens/day
- Marker clicks
- Filters used
- Top markers
- Saved/found actions

### SEO dashboard

- Organic sessions
- Impressions
- CTR
- Top landing pages
- Pages with ranking decline
- Query gaps

### Data quality dashboard

- Verified record percentage
- Speculative records
- Outdated records
- Submissions pending
- Average approval time

## 4. Alerting

Alerts for:

- 5xx error spike
- AI error/cost spike
- Search latency spike
- Map load failure
- Submission spam spike
- Core Web Vitals decline
- Queue failures
- Page revalidation failures

## 5. Experiment ideas

- Search-first homepage vs map-first homepage.
- AI answer cards vs chat bubbles.
- Map bottom sheet snap points.
- Progress celebration intensity.
- Affiliate placement.
- Signup prompt timing.

## 6. Quality metrics

- AI hallucination reports
- Wrong marker reports
- Outdated page reports
- Submission rejection rate
- User trust rating
- Unverified content exposure rate
