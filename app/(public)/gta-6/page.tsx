import Link from "next/link";
import { Bot, Car, Crosshair, Map, Route, Search, Send } from "lucide-react";

import { ModuleGrid } from "@/components/cards/module-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const modules = [
  {
    title: "Map",
    href: "/gta-6/map",
    description:
      "Placeholder for future MapLibre layers, markers, filters, and detail sheets.",
    icon: Map
  },
  {
    title: "Vehicles",
    href: "/gta-6/vehicles",
    description:
      "Database-ready route for vehicle records, verification states, and comparisons.",
    icon: Car
  },
  {
    title: "Weapons",
    href: "/gta-6/weapons",
    description:
      "Placeholder list route for future weapon records, stats, and unlocks.",
    icon: Crosshair
  },
  {
    title: "Missions",
    href: "/gta-6/missions",
    description:
      "Mission guide shell prepared for spoiler controls, rewards, and related records.",
    icon: Route
  },
  {
    title: "Search",
    href: "/gta-6/search",
    description:
      "Published-record search using the PostgreSQL fallback until a dedicated search provider is selected.",
    icon: Search
  },
  {
    title: "Submit",
    href: "/gta-6/submit",
    description:
      "Community evidence intake that creates moderation records without publishing submitted content.",
    icon: Send
  },
  {
    title: "Ask Nexus",
    href: "/gta-6/ask",
    description:
      "Non-live assistant placeholder. Future AI will answer only from approved data.",
    icon: Bot
  }
];

export default function GtaSixHubPage() {
  return (
    <div className="space-y-10 pb-12">
      <section className="relative left-1/2 min-h-[620px] w-screen -translate-x-1/2 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[url('/images/nexus-city-intel-hero.png')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,10,15,0.96)_0%,rgba(8,10,15,0.78)_42%,rgba(8,10,15,0.32)_100%),linear-gradient(180deg,rgba(8,10,15,0.08)_0%,rgba(8,10,15,0.86)_100%)]" />

        <div className="relative mx-auto flex min-h-[620px] max-w-6xl flex-col justify-end px-4 pb-12 pt-24 sm:px-6">
          <Badge tone="accent">Game hub foundation</Badge>
          <div className="mt-6 max-w-3xl">
            <h1 className="text-balance text-5xl font-semibold text-text-primary sm:text-7xl">
              GTA VI
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-lg leading-8 text-text-secondary">
              The first Project Nexus hub is wired for verified records, source
              attribution, search, map markers, and moderation intake. No
              unverified gameplay facts are published.
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/gta-6/map">Open map shell</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/gta-6/search">Search records</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/gta-6/submit">Submit evidence</Link>
            </Button>
          </div>
        </div>
      </section>

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              Data status
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
              Pre-release foundation. Future records must carry source,
              verification status, game association, moderation state, and last
              updated metadata.
            </p>
          </div>
          <Badge tone="warning">No live facts yet</Badge>
        </div>
      </Card>

      <ModuleGrid modules={modules} />
    </div>
  );
}
