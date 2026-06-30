# Personas, Journeys, and Jobs To Be Done

## 1. Personas

### A. Quick-answer player

**Context:** Playing on console, phone beside them.  
**Motivation:** Wants an answer now.  
**Pain:** Google results are long, noisy, outdated, or spoil story content.  
**Need:** Search, answer, act.

Key jobs:

- Find an item/location quickly.
- Understand unlock requirements.
- Avoid spoilers.
- Return to gameplay fast.

Success moments:

- “That answered it in five seconds.”
- “I didn't have to watch a 12-minute video.”

### B. Completionist

**Context:** Wants 100% completion.  
**Motivation:** Clear every region, collect everything, track progress.  
**Pain:** Losing track of what is done.  
**Need:** Map + checklist + saved progress.

Key jobs:

- See all remaining collectibles by area.
- Mark found items.
- Track achievements/trophies.
- Avoid missing one item in a huge map.

Success moments:

- “I know exactly what I still need.”
- “The map remembers what I found.”

### C. Grinder/optimizer

**Context:** Wants to make money/progress efficiently.  
**Motivation:** Maximise cash, unlocks, businesses, upgrades.  
**Pain:** Conflicting advice.  
**Need:** Calculators and personalised recommendations.

Key jobs:

- Compare businesses by ROI.
- Decide what to buy next.
- Plan a two-hour session.
- Optimise route and loadout.

Success moments:

- “This saved me wasting money.”
- “I know exactly what to do tonight.”

### D. Explorer/discoverer

**Context:** Loves finding secrets.  
**Motivation:** Share discoveries and get credit.  
**Pain:** Good discoveries get buried on Reddit/Discord.  
**Need:** Submit, prove, receive credit.

Key jobs:

- Submit a new marker.
- Add screenshot/video proof.
- See credit when approved.
- Correct inaccurate data.

Success moments:

- “My discovery is now on the map.”
- “The community actually benefits.”

### E. Admin/editor

**Context:** Maintaining data during high traffic.  
**Motivation:** Publish fast and accurately.  
**Pain:** Repetitive data entry, duplicates, spam, stale info.  
**Need:** AI-assisted review and structured workflows.

Key jobs:

- Approve submissions.
- Update records.
- Publish pages.
- Fix stale content.
- Track trends.

Success moments:

- “One approval updated five product surfaces.”
- “AI prepared the work, I made the judgement.”

## 2. Primary user journeys

### Journey 1: Find a vehicle while playing

1. User opens Nexus on phone.
2. Taps search.
3. Searches vehicle name or “fastest car near Vice City”.
4. Search returns vehicle and relevant map markers.
5. User opens marker.
6. Bottom sheet shows location, unlock status, related guide.
7. User saves marker or starts route.

Design requirements:

- Search must be thumb-friendly.
- Map drawer must be readable in one glance.
- If data is not confirmed, status must be visible.

### Journey 2: Complete a region

1. User opens map.
2. Selects region.
3. Filters to collectibles only.
4. Marks found items.
5. Progress bar updates.
6. Nexus suggests next cluster or route.

Design requirements:

- Filtering must be fast.
- Progress must feel rewarding but not childish.
- Route and marker density must avoid overwhelm.

### Journey 3: Ask for a play plan

1. User opens AI assistant.
2. Enters: “I have $500k and 2 hours. What should I do?”
3. Assistant asks one clarifying question only if needed.
4. Assistant returns a structured plan.
5. User can open map route, save plan, or view related guides.

Design requirements:

- Answer should be structured, not a wall of text.
- Actions should be tappable cards.
- The plan must state assumptions.

### Journey 4: Submit a discovery

1. User opens marker submission.
2. Chooses category.
3. Drops pin.
4. Adds description and proof.
5. AI suggests duplicate matches.
6. User submits.
7. Admin reviews.
8. Approved marker credits user.

Design requirements:

- Submission must be easy but not spam-prone.
- Duplicate warnings should reduce admin burden.
- Contributor credit should encourage quality.

## 3. Jobs To Be Done

### Functional jobs

- Find game information quickly.
- Navigate the game world.
- Optimise progress.
- Track completion.
- Compare items.
- Understand updates.
- Share discoveries.

### Emotional jobs

- Feel confident.
- Avoid wasting time.
- Avoid missing important items.
- Feel ahead of other players.
- Feel part of a community.

### Social jobs

- Share useful routes.
- Credit discoveries.
- Support friends.
- Post impressive progress.
- Become known as a contributor.

## 4. Habit loops

### Search loop

Question → instant answer → action → repeat.

### Progress loop

Find item → mark complete → progress increases → suggested next step.

### Community loop

Discover → submit → approval → credit → reputation.

### Update loop

Patch/news → Nexus explains changes → user returns after updates.

## 5. UX implications

- Search must be the main navigation pattern.
- Map and AI should not be separate silos.
- Every answer should lead to an action.
- Every saved action should strengthen retention.
- Every failed search should strengthen the content roadmap.
