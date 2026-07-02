# Design Research — Premium Web Experiences

Research sprint, 2026-07-02. Sources studied: motionsites.ai (curated motion-template library), Apple product pages, Linear, Framer, Arc Browser, Raycast, Stripe, Vercel, plus design-token teardowns and motion-accessibility guidance (NN/g, web.dev, WCAG). This document distills what makes those experiences feel premium and how it translates into Project Nexus — not what to copy.

## 1. Key observations

### The premium formula is a small system, executed with zero exceptions

Every studied site derives its "premium software" feel from consistency of a **small** system — one type family with strict weight rules, one lighting model, one motion signature, one accent logic. None of them feel premium because of any single effect.

### Typography

- One sans family site-wide, tuned hard: 500–600 weight display (never 800/900 black), **negative tracking on display text** (Linear ~−4%, Vercel −0.06em at 48px+), line-height 1.0–1.17 on headlines.
- Hierarchy comes from **weight + muted color**, not from many size steps. Muted-gray subheads do the de-emphasis work.
- Eyebrow labels (tracked-out caps or mono) mark section starts — the counterpoint to tight display type.
- Headlines are ≤8 words; body paragraphs never exceed two lines on marketing surfaces.

### Elevation and lighting — the hairline school

- Dark-first sites (Linear, Raycast, Vercel dark) use **1px hairline borders + luminance surface ladders** instead of drop shadows. Elevation = one lighter surface step, not a bigger shadow.
- Framer's dark-card lighting kit: 1px white/8–12% border, a **1px lighter top-edge highlight** (simulating overhead light), radial glow bleeding from behind featured cards. Depth = light, not shadow.
- Apple gets depth from photographic lighting inside the media itself, with almost no CSS effects.

### Color discipline

- All of these sites are functionally **monochrome with one rationed color event** per viewport: Linear's lavender on exactly one action, Vercel's rainbow triangle/glow, Stripe's contained WebGL gradient, Raycast's single red stripe band.
- Semantic/category color lives in content and illustration — never in the chrome.

### Heroes

- Shared hero anatomy: announcement pill/eyebrow → one-line headline → one-sentence subhead → 1–2 CTAs → one large media object. The media **is** the argument.
- Apple's pattern for full-bleed media: bottom-up gradient scrims for text legibility (no boxes), huge semibold title, product photography of exceptional quality. Game key art is one of the few content domains with media quality that can play the same role.
- Ambient hero motion is sub-perceptual: slow zoom (scale 1 → 1.05 over 10–30s), gradient drift, felt rather than seen.

### Motion

- The motion budget everywhere: **one ambient hero animation + sub-250ms functional transitions + once-only scroll reveals.** Nothing else.
- The premium scroll-reveal recipe: opacity 0→1 + translateY(16–32px)→0, 500–700ms ease-out, triggered near viewport entry, **animate once** (never replay on scroll-up), siblings staggered 60–120ms, stagger groups capped at ~6 items.
- 60/30/10 easing rule: ~60% workhorse ease-out (invisible), ~30% snap/exits, ~10% expressive. Entrances and exits never share a curve.
- Only `transform` and `opacity` animate continuously. Layout properties never animate. Jank instantly reads as cheap — performance is part of the aesthetic.
- "The sophistication isn't in the animation, it's in the restraint." Most elements stay static; motion is punctuation, not prose.

### Navigation

- Total convergence: slim (≤64px) sticky header, translucent + backdrop-blur, logo left / links center / persistent CTA right, hamburger or sheet below ~768px. Header treatment **strengthens on scroll** (blur/border appear or deepen once content moves underneath).
- Apple's most transferable pattern for deep content sites: a **pinned local subnav** on detail pages (entity name + section anchors + primary action).

### Layout, spacing, mobile

- ~96px vertical rhythm between major sections on a 4/8px base grid; whitespace and hairlines do the grouping, not boxes and background tints.
- Mobile: rhythm compresses (~96 → 48–64px), display type drops 40–50% but stays huge relative to the viewport, grids stack, CTAs go full-width, heavy hero media falls back to static.
- Raycast/Framer read "app-like" because the marketing page behaves like the product: standardized control heights, real UI as imagery, instant interactions.

## 2. What works well (and why)

- **Weight-based type hierarchy with tight display tracking** — instantly premium, costs nothing at runtime.
- **Hairline + surface-ladder elevation on dark themes** — crisper than shadows, reads as engineered.
- **Scrim-over-media heroes** — cinematic without sacrificing legibility or accessibility.
- **Once-only staggered reveals** — pages feel alive on arrival but never make a returning user wait.
- **Scroll-aware header** — the moment the chrome responds to you, the site feels like software.
- **Accent rationing** — one color event per viewport keeps the accent meaningful.
- **Metrics as designed objects** (Framer/Linear) — stats rendered as display type, not tables.
- **Reduce-not-remove motion accessibility** — crossfades stay, movement goes, under `prefers-reduced-motion`.

## 3. What should inspire Project Nexus

1. **Apple's hero grammar** for our key-art heroes: full-bleed official media, layered scrims, huge display title, short copy, 1–2 CTAs — plus a sub-perceptual slow zoom on the backdrop.
2. **Framer's card lighting kit** (already partly in place): hairline borders, top-edge highlight, elevated-to-surface gradient, glow-on-hover for interactive cards.
3. **Framer's entrance choreography** on landing surfaces: staggered fade-up, once per view, entry-triggered — never scroll-scrubbed.
4. **Linear/Raycast surface ladder** as our elevation model: `bg-base → bg-surface → bg-elevated`, hairlines everywhere, shadows only as large soft ambient depth behind hero-level panels.
5. **The universal nav anatomy**: our glass header should strengthen on scroll; the mobile bottom tab bar stays (it is more app-like than any hamburger).
6. **Arc's per-category gradient identity**, adapted: each knowledge category (characters, regions, vehicles…) can own an accent tint the way Arc Spaces own gradients — navigational color-coding inside content, never in chrome.
7. **96px section metronome** on landing/hub pages, compressed on reference pages where density matters.
8. **Copy austerity** in hero and section headers: short declarative headlines, muted one-sentence support.

## 4. What should NOT be copied

- **Canvas image-sequence scroll scrubbing** (Apple's 148-frame flipbooks) — wrong for a returning-visitor database: weight, jank, friction. Apple itself falls back to static on mobile.
- **Scroll-jacking, snap-sections, full-page parallax** — kills scanning, find-in-page, and deep links; a documented conversion and accessibility hazard.
- **MotionSites template aesthetics wholesale** (cursor trails, pixel-grid hovers, marquees, glassmorphism everywhere) — these are the _inventory_ of premium sites, not the _system_. We take the principles (stagger, layering, restraint), not the effects.
- **Rockstar's own site design** — we are an unofficial companion; visual distance is a legal and brand requirement. Official media appears as clearly attributed editorial content inside _our_ frame.
- **One-CTA funnel structure** — marketing pages converge on "Buy"; a knowledge product must diverge (search, browse, submit). Navigation stays rich.
- **Entrance animations on every surface** — category/detail pages are visited hundreds of times; they get instant rendering, reveals belong to landing surfaces.
- **Copy-as-art fragments for functional labels** — database headings stay literal and scannable.
- **Excessive dark-theme contrast reduction** — people actually read our content; body text keeps higher contrast and size than marketing pages need.

## 5. Translation into the Project Nexus design language

| System           | Decision                                                                                                                                                                                                                                                                                                               |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Type             | Inter (UI/body) + Space Grotesk (display). Display: weight 700, tracking-tight, line-height ~1.0–1.05, subtle white→dimmed vertical gradient fill on hero titles. Eyebrows: tracked-out caps. No new size steps — weight and muted color carry hierarchy.                                                              |
| Elevation        | Hairline school: `border-white/10` + surface ladder (`bg-base → bg-surface → bg-elevated`) + top-edge highlight on cards. Glow shadows reserved for hero-level panels and primary CTAs.                                                                                                                                |
| Color            | Near-black blue-tinted canvas, violet primary + cyan secondary accents, rationed: one accent event per viewport in chrome. Status colors only on badges/content. Category tints allowed inside content cards.                                                                                                          |
| Heroes           | `HeroShell` + `HeroBackdrop`: official key art, dual scrims, attribution chip, slow one-shot zoom (~1.06→1 over 16s, transform-only, reduced-motion safe), fine grain overlay for filmic texture.                                                                                                                      |
| Motion           | Tokens already match research (160/280/520ms, enter `cubic-bezier(0.16,1,0.3,1)`). `Reveal` = once-only viewport-entry fade-up (0.5s, 20px) with 60–120ms stagger via `delay`. Micro-interactions ≤200ms. One ambient animation per page (hero zoom). Transform/opacity only. Global reduced-motion kill-switch stays. |
| Navigation       | Fixed glass header that strengthens (bg/border/blur) after scroll; desktop pill nav; mobile bottom tab bar with safe-area padding. Future: pinned local subnav on entity detail pages.                                                                                                                                 |
| Spacing          | Landing/hub: ~80–96px section rhythm (`space-y-20 sm:space-y-24`). Reference pages: denser. 4/8px base grid.                                                                                                                                                                                                           |
| Buttons          | 44px targets, primary lit-from-above (inner top highlight + glow), active compression 0.98, hover ≤200ms.                                                                                                                                                                                                              |
| Media governance | All official Rockstar media renders inside our components with mandatory attribution chips and provenance fields, structured so assets can be swapped for original Project Nexus captures without layout changes.                                                                                                      |

### Sprint roadmap implied by this research

- **Round 1 (this sprint):** scroll-triggered staggered reveals on landing surfaces; hero slow-zoom + grain; display-type gradient + tighter leading; scroll-aware header; lit primary button; 96px landing rhythm.
- **Round 2 candidates:** category gradient identity system; entity-detail pinned subnav; metrics-as-display-objects on stat strips; View Transitions API for route crossfades; card spotlight hover on module grids.
- **Round 3 candidates:** search/command-palette experience (Raycast-style), map micro-interactions, empty/loading states with shimmer, motion polish on admin surfaces.
