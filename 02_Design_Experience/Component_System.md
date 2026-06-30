# Component System

## 1. Design tokens

Tokens should be stored in code and design tooling.

Categories:

- Colour
- Typography
- Spacing
- Radius
- Shadow
- Blur
- Motion
- Z-index
- Breakpoints

## 2. Core components

### Button

Variants:

- Primary
- Secondary
- Ghost
- Danger
- Icon
- Floating action

States:

- Default
- Hover
- Focus
- Active
- Disabled
- Loading

Motion:

- Active compression.
- Hover glow only on primary desktop.
- Loading spinner or progress shimmer.

### Card

Variants:

- Entity card
- Guide card
- Stat card
- Map marker preview
- AI action card
- Submission card

Requirements:

- Clear hierarchy.
- Status badge support.
- Optional image.
- Primary and secondary actions.

### Badge

Variants:

- Confirmed official
- Confirmed gameplay
- Community verified
- Likely
- Speculative
- Outdated
- Premium

Badges must use text plus colour/icon, not colour alone.

### Search input

Features:

- Large mobile target.
- Suggestions.
- Loading state.
- Clear button.
- Voice input later.
- Ask Nexus fallback.

### Bottom sheet

Features:

- Snap points.
- Drag handle.
- Dismiss.
- Accessible focus management.
- Map-safe interaction.

### Tabs/filters

Features:

- Horizontal scroll on mobile.
- Count badges.
- Clear all.
- Active state motion.

### Data table

Used for stats and comparisons.

Requirements:

- Mobile card fallback.
- Sticky first column on desktop comparisons.
- Highlight best/worst values carefully.

### AI answer block

Components:

- Direct answer
- Confidence/status
- Steps
- Action cards
- Sources
- Follow-ups

### Map marker

Variants by category:

- Vehicle
- Weapon
- Mission
- Collectible
- Business
- Shop
- Property
- Easter egg
- Activity

States:

- Default
- Hover
- Selected
- Found/saved
- Unverified
- Outdated

### Toast

Used for save/undo/submit success.

Requirements:

- Mobile bottom position.
- Undo support for destructive reversible actions.
- Does not cover nav.

## 3. Component documentation standard

Every component spec must include:

- Purpose
- Props
- States
- Accessibility requirements
- Motion behaviour
- Mobile behaviour
- Desktop behaviour
- Error/empty/loading states
- Analytics events

## 4. Naming convention

Use product-level names that remain cross-game:

- `EntityCard`
- `MarkerSheet`
- `VerificationBadge`
- `AssistantAnswer`
- `RoutePreview`
- `ProgressRing`
- `SubmissionReviewCard`

Avoid game-specific component names unless inside game adapters.

## 5. Component acceptance criteria

A component is ready when:

- It exists in Figma and code.
- It has light/dark compatibility if applicable.
- It supports keyboard access.
- It supports reduced motion.
- It has loading, error, disabled states.
- It is documented with examples.
