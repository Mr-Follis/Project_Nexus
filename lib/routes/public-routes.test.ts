import { existsSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { requiredRouteSmokePaths, sitemapRoutes } from "./public-routes";

const routeFiles: Record<(typeof requiredRouteSmokePaths)[number], string> = {
  "/": "app/(public)/page.tsx",
  "/gta-6": "app/(public)/gta-6/page.tsx",
  "/gta-6/search": "app/(public)/gta-6/search/page.tsx",
  "/gta-6/map": "app/(public)/gta-6/map/page.tsx",
  "/gta-6/submit": "app/(public)/gta-6/submit/page.tsx",
  "/gta-6/characters": "app/(public)/gta-6/characters/page.tsx",
  "/gta-6/regions": "app/(public)/gta-6/regions/page.tsx",
  "/gta-6/vehicles": "app/(public)/gta-6/vehicles/page.tsx",
  "/gta-6/weapons": "app/(public)/gta-6/weapons/page.tsx",
  "/gta-6/missions": "app/(public)/gta-6/missions/page.tsx",
  "/gta-6/shops": "app/(public)/gta-6/shops/page.tsx",
  "/admin": "app/admin/page.tsx"
};

describe("public route smoke coverage", () => {
  it("tracks the required public and admin routes", () => {
    expect(requiredRouteSmokePaths).toEqual([
      "/",
      "/gta-6",
      "/gta-6/search",
      "/gta-6/map",
      "/gta-6/submit",
      "/gta-6/characters",
      "/gta-6/regions",
      "/gta-6/vehicles",
      "/gta-6/weapons",
      "/gta-6/missions",
      "/gta-6/shops",
      "/admin"
    ]);
  });

  it("keeps each required route backed by an App Router page file", () => {
    for (const route of requiredRouteSmokePaths) {
      expect(
        existsSync(join(process.cwd(), routeFiles[route])),
        `${route} should have ${routeFiles[route]}`
      ).toBe(true);
    }
  });

  it("keeps required smoke routes in the sitemap route registry", () => {
    for (const route of requiredRouteSmokePaths) {
      expect(sitemapRoutes).toContain(route === "/" ? "" : route);
    }
  });
});
