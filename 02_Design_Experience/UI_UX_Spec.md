# UI/UX Specification

## 1. Primary navigation model

Nexus should use search as the primary navigation pattern with clear secondary routes.

### Mobile navigation

Recommended bottom nav:

1. Home
2. Map
3. Search/Ask
4. Progress
5. Profile

For MVP without accounts, Progress/Profile can be replaced with Submit/Updates.

### Desktop navigation

Top navigation:

- Search
- Map
- Vehicles
- Weapons
- Missions
- Money
- News
- Ask Nexus

## 2. Homepage / game hub

### Objective

Make users understand within five seconds:

- This is not a normal gaming site.
- They can ask questions.
- They can use the map.
- The data is verified/status-labelled.

### Sections

1. Cinematic hero.
2. AI/search input.
3. Quick actions.
4. Live data status.
5. Featured map layer preview.
6. Trending questions.
7. Core databases.
8. Latest verified updates.
9. Community discoveries.
10. Email/waitlist.

### Hero concept

Dark cinematic background with abstract map lines, subtle gradient movement, and a floating search panel. Avoid using official artwork as the default unless permissions are clear.

## 3. Search experience

### Mobile pattern

- Search is a full-screen command sheet.
- Input at top.
- Suggestions grouped by category.
- Recent searches.
- Popular searches.
- Ask Nexus option.

### Result card content

- Title
- Type icon
- Status badge
- Short description
- Primary action
- Related action

Example:

- “Banshee”
- Vehicle • Confirmed
- Sports car. Known from official footage.
- Actions: View details, show on map

## 4. AI assistant UX

### Layout

AI should not look like a generic chat app only. It should produce structured answer cards.

Answer anatomy:

1. Direct answer.
2. Status/confidence.
3. Recommended action.
4. Related map/entities.
5. Sources/last verified.
6. Follow-up suggestions.

### Example answer structure

```text
Best option: Buy/Find X
Why: Faster reward path for your current cash/time.
Do this next:
1. Go to marker A
2. Complete mission B
3. Upgrade C
Map route: Open
Sources: Updated June 30, 2026
```

## 5. Map UX

### Mobile

- Full-screen map.
- Bottom sheet for marker details.
- Floating filter button.
- Floating search button.
- Quick category chips.
- Location list alternative.

### Desktop

- Split layout: map left/full, details panel right.
- Filter sidebar collapsible.
- Search overlay.
- Hover previews.

### Marker detail sheet

Must include:

- Title
- Type
- Verification status
- Short description
- Coordinates/region
- Related entity/page
- Evidence/source
- Last verified
- Save/found action later
- Report correction

## 6. Entity pages

### Vehicle page structure

1. Header with name/status/category.
2. Key stats cards.
3. Where to find/buy.
4. Map preview.
5. Unlock requirements.
6. Best use case.
7. Related vehicles.
8. Related guides.
9. Source/verification.
10. FAQ.

### Weapon page structure

Same pattern: stats, unlocks, where to buy/find, best use cases, related missions.

### Mission page structure

1. Spoiler warning/control.
2. Overview.
3. Requirements.
4. Objectives.
5. Rewards.
6. Recommended loadout.
7. Step-by-step guide.
8. Map markers.
9. Unlocks.
10. FAQ.

## 7. Admin UX

Admin dashboard should prioritise work queues:

- Submissions pending review
- Duplicate conflicts
- Stale records
- Failed searches
- Unanswered AI questions
- Missing source data
- Pages needing review

Record editing must be structured first, rich text second.

## 8. Empty states

Good empty states turn missing data into trust.

Examples:

- “No confirmed spawn locations yet. We’ll update this once verified gameplay data is available.”
- “This is still pre-release information. Follow this page for updates.”
- “No results found. Ask Nexus or submit what you discovered.”

## 9. Loading states

- Use skeletons for cards.
- Map markers can load in layers.
- AI answer shows structured skeleton blocks.
- Avoid full-screen spinners except first-load edge cases.

## 10. Error states

- Error messages must be plain English.
- Offer retry.
- Preserve user input.
- For failed submissions, do not discard entered data.

## 11. Mobile acceptance checklist

- All core buttons reachable by thumb.
- Tap targets 44x44px minimum.
- Works in dark environments.
- Search is usable with one hand.
- Bottom sheets do not cover critical map context.
- Content does not require pinch zoom.
- AI answers are scannable, not walls of text.
