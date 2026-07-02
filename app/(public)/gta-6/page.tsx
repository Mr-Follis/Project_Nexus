import Link from "next/link";
import {
  Bot,
  Car,
  Crosshair,
  Map,
  MapPin,
  Route,
  Search,
  Send,
  Store,
  Users
} from "lucide-react";

import { ModuleGrid } from "@/components/cards/module-grid";
import { StatCard } from "@/components/cards/stat-card";
import { HeroShell } from "@/components/layout/hero-shell";
import { SectionHeader } from "@/components/layout/section-header";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getDatabaseUrl } from "@/lib/db/client";
import { getPublicContentStats } from "@/lib/db/repositories/knowledge";
import { getGameHeroMedia } from "@/lib/media/hero";

export const dynamic = "force-dynamic";

const modules = [
  {
    title: "Characters",
    href: "/gta-6/characters",
    description:
      "The officially revealed cast — Jason, Lucia, and the players of Leonida — with sources on every record.",
    icon: Users
  },
  {
    title: "Places & Regions",
    href: "/gta-6/regions",
    description:
      "Officially named regions of Leonida, from Vice City to the Keys, each backed by Rockstar announcements.",
    icon: MapPin
  },
  {
    title: "Vehicles",
    href: "/gta-6/vehicles",
    description:
      "Officially pictured rides, from the '55 Vapid Stanier to the Shitzu Squalo, with galleries and sources.",
    icon: Car
  },
  {
    title: "Shops & Services",
    href: "/gta-6/shops",
    description:
      "Officially revealed stores, salons, and mod shops across Leonida, from Rideout Customs to Electric Fang.",
    icon: Store
  },
  {
    title: "Weapons",
    href: "/gta-6/weapons",
    description:
      "Confirmed weapons like the Hawk & Little Morgan Revolvers — stats stay empty until officially verified.",
    icon: Crosshair
  },
  {
    title: "Map",
    href: "/gta-6/map",
    description:
      "The map shell, ready for verified markers as official location details emerge.",
    icon: Map
  },
  {
    title: "Missions",
    href: "/gta-6/missions",
    description:
      "Mission guides with spoiler controls will live here once verified story details exist.",
    icon: Route
  },
  {
    title: "Search",
    href: "/gta-6/search",
    description:
      "Search every published record — characters, places, vehicles, shops, and more.",
    icon: Search
  },
  {
    title: "Submit evidence",
    href: "/gta-6/submit",
    description:
      "Send screenshots and sources into the moderation queue and help grow the database.",
    icon: Send
  },
  {
    title: "Ask Nexus",
    href: "/gta-6/ask",
    description:
      "The future assistant will answer from approved records only — no invented facts.",
    icon: Bot
  }
];

export default async function GtaSixHubPage() {
  const [heroMedia, stats] = await Promise.all([
    getGameHeroMedia("gta-6"),
    getStats()
  ]);

  return (
    <div className="space-y-20 pb-4 sm:space-y-24">
      <HeroShell media={heroMedia}>
        <div className="max-w-3xl">
          <Badge tone="accent">Unofficial companion hub</Badge>
          <h1 className="text-display-gradient mt-6 text-balance font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-7xl">
            GTA VI
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-text-secondary sm:text-lg sm:leading-8">
            Jason and Lucia. The state of Leonida. November 19, 2026 on PS5 and
            Xbox Series X|S. Everything here is sourced from official Rockstar
            Games announcements — and labelled when it isn&apos;t confirmed.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/gta-6/characters">Meet the cast</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/gta-6/regions">Explore Leonida</Link>
            </Button>
          </div>
        </div>

        {stats ? (
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
            <StatCard
              tone="cyan"
              value={String(stats.entityCounts.character ?? 0)}
              label="Characters"
            />
            <StatCard
              tone="amber"
              value={String(stats.entityCounts.region ?? 0)}
              label="Places & regions"
            />
            <StatCard
              tone="violet"
              value={String(
                (stats.entityCounts.vehicle ?? 0) +
                  (stats.entityCounts.weapon ?? 0)
              )}
              label="Vehicles & weapons"
            />
            <StatCard
              tone="green"
              value={String(stats.entityCounts.shop ?? 0)}
              label="Shops & services"
            />
          </div>
        ) : null}
      </HeroShell>

      <section className="space-y-8">
        <Reveal>
          <SectionHeader
            eyebrow="The database"
            title="Explore everything on record"
            description="Every module below reads from the same verified knowledge layer. If a section looks light, it is because Rockstar has not confirmed more — not because we stopped looking."
          />
        </Reveal>
        <Reveal delay={0.08}>
          <ModuleGrid modules={modules} />
        </Reveal>
      </section>

      <Reveal>
        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-text-primary">
                How records earn their place
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
                Published records are limited to officially confirmed
                information from Rockstar Games sources. Every record carries
                source links, verification status, and last-updated metadata;
                community submissions go through moderation before anything
                changes here.
              </p>
            </div>
            <Badge tone="success" className="shrink-0">
              Officially sourced
            </Badge>
          </div>
        </Card>
      </Reveal>
    </div>
  );
}

async function getStats() {
  if (!getDatabaseUrl()) {
    return null;
  }

  try {
    return await getPublicContentStats("gta-6");
  } catch {
    return null;
  }
}
