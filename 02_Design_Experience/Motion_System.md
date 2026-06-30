# Motion System

## 1. Motion philosophy

Motion is one of Project Nexus' signature differentiators. The product should feel modern and alive, but never chaotic.

Motion must serve at least one purpose:

- Feedback: “Your action worked.”
- Orientation: “You moved from here to there.”
- Hierarchy: “This is now important.”
- Delight: “This feels premium.”
- Perceived speed: “The system is responding.”

If an animation does not help, remove it.

## 2. Motion constraints

- Respect `prefers-reduced-motion`.
- Never block core actions behind long animation.
- Keep routine interactions fast.
- Use consistent easing.
- Avoid particle effects except rare celebratory moments.
- Avoid “gaming RGB” overload.

## 3. Timing scale

| Token | Duration | Use |
|---|---:|---|
| `motion.instant` | 80ms | Tap feedback, tiny state changes |
| `motion.fast` | 120–180ms | Buttons, chips, hover states |
| `motion.medium` | 220–320ms | Cards, filters, drawers |
| `motion.slow` | 400–600ms | Page reveals, route drawing, hero sequences |
| `motion.signature` | 700–1200ms | Rare wow moments |

## 4. Easing

Recommended curves:

- Standard: smooth ease-out for UI transitions.
- Enter: slightly slower ease-out.
- Exit: quick ease-in.
- Spring: only for tactile bottom sheets, marker selection, and card expansion.

Example CSS tokens:

```css
:root {
  --ease-standard: cubic-bezier(0.2, 0.8, 0.2, 1);
  --ease-enter: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-exit: cubic-bezier(0.7, 0, 0.84, 0);
  --duration-fast: 160ms;
  --duration-medium: 280ms;
  --duration-slow: 520ms;
}
```

## 5. Component motion

### Buttons

- Tap down scale: 0.98.
- Release returns to 1.0 quickly.
- Primary buttons may have subtle glow on hover/focus.
- Disabled state should fade, not jump.

### Cards

- Hover: 2–4px lift on desktop.
- Active/tap: slight compression.
- Expansion: card grows into drawer or detail view where possible.

### Search

- Search input expands smoothly.
- Results fade/slide in quickly.
- Typing suggestions should feel instant.
- Zero state should gently appear, not flash.

### Bottom sheets

- Spring-like movement.
- Snap points: collapsed, half, full.
- Drag handle always visible.
- Background map remains interactive where safe.

### Tabs/filters

- Active indicator glides.
- Filter chips animate on/off.
- Count updates should crossfade.

### Toasts

- Slide up from bottom on mobile.
- Auto-dismiss but allow undo for destructive actions.

## 6. Map motion

### Marker hover/select

- Marker softly grows on hover/select.
- Selected marker pulses once, not continuously.
- Marker detail bottom sheet rises from bottom on mobile.

### Marker clusters

- Clusters expand with radial or spatial reveal.
- Avoid abrupt marker explosions.
- Preserve spatial awareness.

### Route drawing

- Route animates from start to finish.
- Estimated time/reward appears after route completes.
- Reduced-motion mode shows route instantly.

### Layer transitions

- Layers fade in/out over 180–280ms.
- Marker categories should not flicker.

### Search-to-map transition

- Selecting a search result smoothly pans/zooms to marker.
- The bottom sheet opens after camera movement begins, not before.

## 7. AI motion

### Answer generation

Do not fake overly slow typing. Use chunked reveal:

1. Assistant acknowledges query.
2. Shows skeleton answer blocks.
3. Reveals structured answer.
4. Reveals action cards.
5. Shows confidence/source state.

### Action cards

AI-generated actions should animate in as separate cards:

- Open map
- Compare
- Save plan
- View guide
- Start route

### Unknown answer

If data is missing, use calm empty-state motion. Do not make failure feel dramatic.

## 8. Page transitions

Use subtle transitions:

- Hub → map: content shifts/fades into full-screen map.
- Search → entity page: selected result expands into header area.
- Entity → comparison: cards rearrange into table.
- Guide → map pin: guide context remains in bottom sheet.

## 9. Celebration moments

Use sparingly.

Examples:

- Region completed.
- Achievement path finished.
- First approved community submission.
- 100% completion milestone.

Celebration should be premium, not childish.

## 10. Reduced motion

In reduced-motion mode:

- Remove parallax.
- Remove route drawing animation.
- Replace movement with fades.
- No pulsing loops.
- No hero camera movement.
- Preserve state changes clearly.

## 11. Motion QA checklist

- Does this improve understanding?
- Does this preserve orientation?
- Does this feel fast?
- Does it work on low-end phones?
- Does reduced-motion mode work?
- Is it consistent with system tokens?
- Would this still feel good after 100 uses?
