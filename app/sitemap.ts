import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/config/site";
import { sitemapRoutes } from "@/lib/routes/public-routes";

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapRoutes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7
  }));
}
