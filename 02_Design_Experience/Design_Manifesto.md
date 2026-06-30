# Design Manifesto

## 1. Design ambition

Project Nexus should not look like a traditional gaming website.

Many gaming sites are crowded, ad-heavy, dark by default, visually noisy, and difficult to use on mobile. Nexus should feel modern, premium, calm, fast, and alive.

The desired feeling:

> Apple-level clarity, Linear-level speed, Framer-level motion, Google Maps-level utility, with cinematic gaming energy.

## 2. Relationship to Rockstar/GTA VI visual style

Nexus should learn from Rockstar's GTA VI site but not copy it.

Rockstar sells the fantasy: cinematic characters, place, mood, and media.

Nexus sells clarity: what to do, where to go, what to choose, and what changed.

Design direction:

- Take inspiration from cinematic presentation, bold typography, premium spacing, and confident motion.
- Avoid copying Rockstar layouts, brand elements, visual identity, or art direction too closely.
- Build an original identity that can support future games beyond GTA VI.

## 3. Experience principles

### 3.1 Calm, not boring

Calm design reduces cognitive load. It should still feel alive through motion, depth, and precision.

### 3.2 Useful before beautiful

Every screen must answer: “What can the player do from here?”

### 3.3 Mobile first

Mobile is not a responsive afterthought. It is the primary gameplay companion surface.

### 3.4 Second-screen first

A player may have seconds to glance at the phone before returning to the game. Make information scannable, touchable, and persistent.

### 3.5 Motion with purpose

Motion should improve:

- Orientation
- Feedback
- Hierarchy
- Delight
- Perceived speed

Motion should not exist purely because it is trendy.

### 3.6 Premium restraint

Use a small number of signature wow moments. Everything else should be understated.

### 3.7 Trust through clarity

Show verification state, source, last updated date, and uncertainty clearly.

### 3.8 Glanceable density

Nexus will contain dense information. The interface must use progressive disclosure: summary first, details on tap.

## 4. Visual personality

Nexus should feel:

- Intelligent
- Fast
- Premium
- Cinematic
- Useful
- Calm
- Connected
- Confident

Nexus should not feel:

- Cheap
- Spammy
- Over-gamified
- Like a casino
- Like a generic wiki
- Like copied Rockstar branding
- Like an AI wrapper

## 5. Colour direction

Initial recommendation:

- Dark mode first.
- Deep charcoal/ink backgrounds, not pure black everywhere.
- Soft off-white text.
- High contrast for readability.
- A signature accent gradient for action states.
- Muted secondary colours for categories.
- Status colours for verification, warnings, speculative data, and outdated data.

Suggested starting palette:

| Token | Purpose | Suggested value |
|---|---|---|
| `bg.base` | Main background | `#080A0F` |
| `bg.surface` | Cards/sheets | `#10131B` |
| `bg.elevated` | Elevated panels | `#171B26` |
| `text.primary` | Main text | `#F5F7FA` |
| `text.secondary` | Supporting text | `#AAB2C0` |
| `text.muted` | Metadata | `#707A8C` |
| `accent.primary` | Main action | `#7C5CFF` |
| `accent.secondary` | Motion/route glow | `#36D1DC` |
| `success` | Confirmed | `#31D67B` |
| `warning` | Likely/speculative | `#F5B84B` |
| `danger` | Outdated/error | `#FF5C7A` |

Final colours should be tested in Figma with contrast checks.

## 6. Typography direction

Typography must be readable on mobile.

Suggested approach:

- Use a premium modern sans-serif.
- Avoid overly “gaming” fonts.
- Big headings.
- Comfortable body line-height.
- Strong numeric/table typography for stats.
- No tiny metadata below accessibility thresholds.

Typography scale:

| Token | Mobile | Desktop | Use |
|---|---:|---:|---|
| Display | 40–48px | 72–96px | Homepage hero |
| H1 | 32px | 56px | Page titles |
| H2 | 24px | 36px | Section headers |
| H3 | 20px | 28px | Cards/details |
| Body | 16px | 17–18px | Main copy |
| Small | 13–14px | 14px | Metadata |

## 7. Layout principles

- Use generous spacing.
- Prioritise vertical flow on mobile.
- Use bottom sheets for map details.
- Use sticky search/navigation where helpful.
- Keep primary actions reachable by thumb.
- Avoid dense sidebars on mobile.
- On desktop, use split-screen map/detail patterns.

## 8. Signature design moments

Nexus should have a limited “wow budget.”

Recommended signature moments:

1. Homepage cinematic reveal.
2. AI answer unfolding into actions/cards.
3. Map route drawing animation.
4. Marker cluster expansion.
5. Progress completion celebration.
6. Patch diff visual reveal.

Everything else should be restrained.

## 9. Accessibility requirements

- Respect `prefers-reduced-motion`.
- Full keyboard navigation on desktop.
- Adequate colour contrast.
- Icons paired with labels where meaning is important.
- Tap targets at least 44x44px.
- Loading states that do not trap the user.
- AI answers readable by screen readers.
- Map alternatives: list view for markers.

## 10. Design acceptance criteria

Before release, each core screen must pass:

- Mobile usability review.
- Dark-mode contrast check.
- Reduced-motion review.
- Loading/error/empty state review.
- Thumb-zone review.
- Performance review.
- “Can this be used while playing?” review.
