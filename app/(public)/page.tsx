import Link from "next/link";
import {
  ArrowRight,
  Database,
  Landmark,
  ShieldCheck,
  Users
} from "lucide-react";

import { FeatureCard } from "@/components/cards/feature-card";
import { StatCard } from "@/components/cards/stat-card";
import { HeroShell } from "@/components/layout/hero-shell";
import { SectionHeader } from "@/components/layout/section-header";
import {
  MediaPanel,
  type MediaPanelAsset
} from "@/components/media/media-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getDatabaseUrl } from "@/lib/db/client";
import { getPublicContentStats } from "@/lib/db/repositories/knowledge";
import { getGameBySlug } from "@/lib/db/repositories/knowledge";
import { listPublicMediaForGame } from "@/lib/db/repositories/media";
import { getGameHeroMedia } from "@/lib/media/hero";

export const dynamic = "force-dynamic";

const featureCards = [
  {
    title: "Verified knowledge",
    body: "Characters, places, vehicles, and more — every published fact is tied to an official source and labelled with its verification level.",
    icon: ShieldCheck
  },
  {
    title: "The world of Leonida",
    body: "From Vice City neon to the Leonida Keys, explore the officially revealed regions with galleries from Rockstar's own archive.",
    icon: Landmark
  },
  {
    title: "Built with the community",
    body: "Spotted something? Submit evidence and it goes through moderation before anything changes on a public page.",
    icon: Users
  }
];

export default async function HomePage() {
  const [heroMedia, stats, showcase] = await Promise.all([
    getGameHeroMedia("gta-6"),
    getStats(),
    getShowcaseMedia()
  ]);

  return (
    <div className="space-y-16 pb-4 sm:space-y-20">
      <HeroShell media={heroMedia} size="tall">
        <div className="max-w-3xl">
          <Badge tone="accent">Unofficial GTA VI companion</Badge>
          <h1 className="mt-6 text-balance text-5xl font-bold tracking-tight text-text-primary sm:text-7xl lg:text-8xl">
            Project Nexus
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-base leading-7 text-text-secondary sm:text-lg sm:leading-8">
            Vice City, decoded. A verified knowledge platform for GTA VI —
            characters, places, vehicles, media, and maps, every record sourced
            from official announcements.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/gta-6">
                Open the GTA VI hub
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/gta-6/characters">Meet the cast</Link>
            </Button>
          </div>
        </div>

        {stats ? (
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
            <StatCard
              tone="cyan"
              value={String(stats.totalEntities)}
              label="Verified records"
            />
            <StatCard
              tone="amber"
              value={String(stats.mediaCount)}
              label="Official media assets"
            />
            <StatCard
              tone="violet"
              value={String(stats.officialSourceCount)}
              label="Official sources"
            />
            <StatCard tone="green" value="Nov 19, 2026" label="GTA VI launch" />
          </div>
        ) : null}
      </HeroShell>

      <section className="space-y-8">
        <SectionHeader
          eyebrow="Why Nexus"
          title="One knowledge layer. Every surface."
          description="Data is entered once, verified, and reused across pages, galleries, search, maps, and future AI answers — never copied around, never invented."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {featureCards.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              body={feature.body}
            />
          ))}
        </div>
      </section>

      {showcase.length > 0 ? (
        <section className="space-y-8">
          <SectionHeader
            eyebrow="From the official archive"
            title="Leonida, on the record"
            description="Official promotional media, stored in a structured library with full attribution — and replaceable with original Project Nexus captures after launch."
            actions={
              <Button asChild variant="secondary">
                <Link href="/gta-6/regions">Explore the places</Link>
              </Button>
            }
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {showcase.map((asset) => (
              <MediaPanel key={asset.id} asset={asset} />
            ))}
          </div>
        </section>
      ) : null}

      <Card className="border-accent-primary/30 bg-gradient-to-br from-bg-surface to-bg-elevated">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent-secondary">
              <Database className="h-4 w-4" aria-hidden="true" />
              Data-first rule
            </div>
            <p className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
              Enter data once. Use it everywhere.
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-text-secondary">
              Public pages, galleries, search, and maps all read from the same
              verified records — empty fields stay empty until sourced data is
              reviewed, and nothing is ever generated to fill space.
            </p>
          </div>
          <Button asChild variant="secondary" className="shrink-0">
            <Link href="/gta-6/search">Search the database</Link>
          </Button>
        </div>
      </Card>
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

async function getShowcaseMedia(): Promise<MediaPanelAsset[]> {
  if (!getDatabaseUrl()) {
    return [];
  }

  try {
    const game = await getGameBySlug("gta-6");

    if (!game || game.status !== "published") {
      return [];
    }

    const assets = await listPublicMediaForGame(game.id, {
      types: ["screenshot"],
      limit: 3
    });

    return assets;
  } catch {
    return [];
  }
}
