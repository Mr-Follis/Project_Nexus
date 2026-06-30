import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/config/site";

const routes = [
  "",
  "/gta-6",
  "/gta-6/map",
  "/gta-6/vehicles",
  "/gta-6/weapons",
  "/gta-6/missions",
  "/gta-6/search",
  "/gta-6/submit",
  "/gta-6/ask",
  "/admin"
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7
  }));
}
