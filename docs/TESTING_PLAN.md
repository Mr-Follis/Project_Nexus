# Testing Plan

## Current Testing Foundation

- Unit test runner: Vitest.
- Current validation command: `npm run validate`.
- Current validation coverage: format check, unit tests, typecheck, lint, and production build.
- Current smoke coverage: required public/admin route registry checks and App Router page-file existence checks.

## Stabilization Checks

Run these before adding new feature work:

- `npm run test:unit`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run dev`, then verify:
  - `/`
  - `/gta-6`
  - `/gta-6/search`
  - `/gta-6/map`
  - `/gta-6/submit`
  - `/gta-6/vehicles`
  - `/gta-6/weapons`
  - `/gta-6/missions`
  - `/admin`

## Recommended Next Testing Step

Adopt Playwright for browser-level smoke tests after the next sprint starts.

Initial Playwright scope should stay small:

- Start the Next.js app in test mode.
- Visit each required public/admin route.
- Assert HTTP 200 and one stable page-level heading or landmark per route.
- Run in CI after unit tests and before production build.

## Deferred Testing Scope

- Database-backed integration tests with a disposable PostgreSQL database.
- Admin workflow tests for moderation and publishing transitions.
- Search behavior tests with seeded fixtures.
- Accessibility checks for navigation, forms, and route landmarks.
- Visual regression checks for Replit Preview-critical pages.
