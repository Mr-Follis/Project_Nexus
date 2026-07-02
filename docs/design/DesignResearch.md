# Design Research — Project Nexus Design Reset

Research date: 2026-07-02. Live analysis of motionsites.ai, Apple product pages, Linear, Framer, Arc Browser, Raycast, Stripe, and Vercel, supplemented by design-token teardowns and motion-accessibility guidance (NN/g, web.dev, WCAG). This is the foundation for the first-principles redesign — not a catalogue of things to copy.

## 1. What makes each product memorable

| Product            | The one thing you remember              | How they do it                                                                                                                                                         |
| ------------------ | --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Apple**          | The product floating in darkness        | Photography carries all depth; the page has almost no CSS decoration. Scroll-scrubbed sequences you drive yourself. Absolute restraint.                                |
| **Linear**         | Instrument-panel severity               | Near-black #010102 canvas, −4% display tracking, zero drop shadows, one lavender accent on exactly one action. Numbered section eyebrows like an engineering document. |
| **Framer**         | Light as material                       | Radial glows behind cards, 1px alpha borders, top-edge highlights — depth built from light, not shadow. Staggered spring entrances everywhere.                         |
| **Arc**            | Software with a personality             | Pastel per-Space gradients, serif display against sans body, tinted diffuse shadows, hand-drawn imperfections against polished UI. Sells belonging, not features.      |
| **Raycast**        | The marketing page behaves like the app | Four-step surface ladder, keycap gradients, a single red stripe band per page, real command-palette UI as imagery.                                                     |
| **Stripe**         | The living gradient                     | One WebGL mesh animation, quarantined by a skewed clip. Diagonal section edges. Everything else is calm navy-on-white finance.                                         |
| **Vercel**         | The blueprint                           | Visible hairline grid lines running through the layout; content sits inside drawn cells. Monochrome discipline with one rainbow moment.                                |
| **motionsites.ai** | The formula, commoditized               | Dark + glass + glow + staggered reveals is now a _template you can buy_. Proof that the aesthetic alone is generic — identity has to come from somewhere else.         |

The motionsites.ai observation is the pivotal one for this reset: the "dark cinematic SaaS" look is literally purchasable as a template. Using its ingredients (gradient glows, rounded glass cards, centered hero, three-card feature grid) produces a site that reads as AI-generated **because thousands of sites are assembled from exactly these parts**. Identity must come from structure, voice, and purpose-built components — not from the shared ingredient list.

## 2. Motion observations

- Universal budget: **one ambient signature animation per page** + sub-250ms functional transitions + once-only entrance reveals. Nothing else moves.
- Premium reveal recipe: opacity + 16–32px rise, 500–700ms ease-out, trigger near viewport entry, animate once, stagger siblings 60–120ms, cap groups at ~6.
- Apple's motion is scroll-scrubbed (user-driven, reversible); Framer's is entry-triggered (plays once). Both are deliberate about _who controls time_. Autoplay attention-grabbers are the mark of cheap sites.
- Only `transform` and `opacity` animate continuously. Layout properties never. Jank reads as cheap instantly.
- Reduced motion: reduce, don't remove — keep crossfades, kill movement.
- The dividing line: "the sophistication isn't in the animation, it's in the restraint."

## 3. Typography observations

- One family site-wide, tuned hard, with an OpenType quirk as the fingerprint (Stripe ss01, Raycast ss03, Vercel's own Geist, Linear's custom sets).
- Display: 500–700 weight (never 900), negative tracking (Linear −4%, Vercel −0.06em), line-height 1.0–1.17. Hierarchy from **weight and muted color**, not size steps.
- Eyebrows — tracked-out caps or monospace — mark every section start. Vercel and Linear use mono/numbered eyebrows to feel like engineering documents.
- Copy austerity: ≤8-word headlines, one-sentence subheads. Muted-gray subheads do the de-emphasis.
- Apple puts color _inside_ the headline (muted lead-in, bright key phrase) — hierarchy within a single line.
- Arc's serif-display-over-sans-body pairing shows a second face is viable when it _is_ the personality.

## 4. Layout observations

- ~96px section metronome on a 4/8px grid for marketing surfaces; density for reference surfaces.
- Whitespace and hairlines group content — not boxes, not background tints.
- Apple: one idea per viewport, alternating dark/light chapters, narrative arc down the page.
- Vercel: the layout itself is drawn (visible grid) — structure as decoration.
- Stripe: diagonal section edges break the horizontal-band monotony.
- **Symmetric, centered, three-card-grid layouts are the template smell.** The memorable sites are asymmetric somewhere deliberate: Apple's off-center product shots, Framer's bento spans, Arc's floating offset screenshots.

## 5. Navigation observations

- Convergent anatomy: slim (≤64px) sticky translucent blur header, logo left, links center, persistent CTA right, hamburger/sheet under 768px.
- Header responds to scroll (blur/border deepen). The chrome reacting to you is what makes it feel like software.
- Apple's pinned product-local subnav (name + anchors + action) is the best pattern for deep detail pages.
- Raycast keeps the primary CTA pill visible at every breakpoint.

## 6. Visual hierarchy observations

- Extreme size contrast (4–5× display vs body) plus muted secondary color does nearly all the work.
- Depth ideologies: hairline school (Linear/Raycast/Vercel — borders + luminance ladders, no shadows) vs shadow school (Stripe — soft shadows on white). Dark themes belong to the hairline school.
- Accent rationing: one color event per viewport. Semantic color exiled to content, never chrome.
- Metrics rendered as designed display objects (Framer's "LCP 1.1s", Linear's changelog numbers) — data as typography is a hierarchy tool.

## 7. Component observations

- The premium sites have almost no generic components. Raycast's store rows, Linear's issue mockups, Framer's agent modules, Apple's compare tables — every component is **specific to the product's domain** and unusable anywhere else.
- That specificity is precisely what template sites lack: a FeatureCard could be anyone's; an "issue timeline with live activity" could only be Linear's.
- Real product UI as imagery beats illustration everywhere. The database _is_ our product UI — records, verification states, sources, and counts should be rendered as designed objects.
- Controls are standardized (Raycast: 36px), states designed for every component, radius vocabularies small and intentional (4/6/8/10/16 — not one radius everywhere).

## 8. Mobile observations

- Section rhythm compresses ~50%; display type drops 40–50% but stays huge relative to viewport.
- Grids stack or become swipeable rows; CTAs go full-width; heavy hero media falls back to static.
- Bottom tab bars (app convention) out-perform hamburgers for products with few core destinations.
- Every studied site keeps its identity intact on mobile — the signature (gradient, grid, glow) survives the collapse.

## 9. What makes Project Nexus different?

Every reference above is a _marketing site_ selling a product. **Project Nexus is not a marketing site — it is the product.** A verified knowledge instrument for a game world. That is the identity no template has:

1. **We have a database with provenance.** Records, verification levels, official sources, audit history, live counts. No GTA fan site and no SaaS template has truthful "29 verified records · 7 official sources · zero speculation" to show. Our data rendered as designed objects is our equivalent of Apple's product photography.
2. **We have the world's best editorial imagery** — official key art and screenshots with mandatory attribution — but we are _not Rockstar_ and must not look like them. Rockstar sells fantasy; Nexus verifies it. The visual voice is the instrument reading the world, not the world itself.
3. **We have a mission vocabulary**: evidence, intel, verification, sources, records, moderation. Components should be named and designed from this vocabulary (Intel Card, Evidence Panel, World Status, Command Search) — not Feature Card, not Stat Card.
4. **Users return.** Marketing pages are seen once; Nexus is the companion left open while playing. It must respect repeat visits: instant reference pages, dense useful surfaces, motion only where arrival deserves it.

**Positioning line: the operating system gamers leave open while they play.** Mission control for a game world — cinematic where the world appears, instrument-precise where the data appears, calm everywhere else.

### Design-language consequences

- Bespoke domain components over generic cards; every component earns a Nexus-vocabulary name and a purpose.
- Data as typography: counts, verification states, and timestamps rendered as display objects (mono accents for readouts).
- Asymmetry with intent: editorial offsets, uneven panel spans, vertical rails — break the centered-template rhythm.
- Imagery always framed by _our_ instrument chrome (attribution chips, provenance labels, scanline restraint) so official media reads as evidence in our system, never as us impersonating Rockstar.
- One accent event per viewport; hairline school elevation; small deliberate radius vocabulary instead of one global radius.
- Motion: one ambient signature per page, entry reveals on arrival surfaces only, everything reduced-motion safe.

## 10. The three concepts this research produces

- **Concept A — Cinematic**: the world as editorial blockbuster. Full-bleed key art, numbered chapters, asymmetric image/type spreads, typography as atmosphere. Tests how far _imagery + editorial type_ carry identity.
- **Concept B — Mission Control**: the companion OS. Status bar, command search, world-status readouts, intel feed, mission objectives — panel chrome with hairline grid and mono labels. Tests how far _instrument density + domain components_ carry identity.
- **Concept C — Luxury**: the confident minimum. Near-monochrome, enormous statements, one floating framed image, typographic index instead of card grids. Tests how far _restraint + typography_ carry identity.

The recommendation after building all three: see the sprint summary. The likely destination is a fusion — Cinematic's imagery where the world appears, Mission Control's instrument components where the data appears, Luxury's restraint everywhere else — but each concept must stand alone first so the choice is made by looking, not guessing.
