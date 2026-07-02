import type { Metadata } from "next";
import Link from "next/link";

import {
  CinematicHero,
  EditorialChapter,
  FeaturedDiscovery
} from "@/components/concepts/cinematic";
import { Reveal } from "@/components/motion/reveal";
import { getConceptData, daysUntilLaunch } from "@/lib/concepts/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Concept A — Cinematic"
};

/**
 * Concept A: the world as an editorial blockbuster. Typography and official
 * imagery carry the identity; there are no cards and no feature grids.
 */
export default async function CinematicConceptPage() {
  const { hero, stats, media, latestEntities } = await getConceptData();
  const chapterMedia = media.filter((asset) => asset.filePath);

  const featured = latestEntities[0];

  return (
    <div className="bg-bg-base pb-32">
      <CinematicHero
        media={hero}
        recordCount={stats ? stats.totalEntities : null}
        daysToLaunch={daysUntilLaunch()}
      />

      <div className="space-y-32 pt-28 sm:space-y-44 sm:pt-40">
        <EditorialChapter
          index="01"
          kicker="Chapter one — the cast"
          title="Jason. Lucia. And everyone Leonida answers to."
          body={`${stats?.entityCounts.character ?? "The"} officially revealed characters, each published with its source, verification level, and history — never a rumor dressed as a fact.`}
          href="/gta-6/characters"
          linkLabel="Meet the cast"
          media={chapterMedia[0]}
          align="right"
        />

        <EditorialChapter
          index="02"
          kicker="Chapter two — the state"
          title="From Vice City neon to the quiet of the Keys."
          body="Every officially named region, mapped and documented with Rockstar's own promotional archive — and structured to be replaced by original captures at launch."
          href="/gta-6/regions"
          linkLabel="Explore Leonida"
          media={chapterMedia[1]}
          align="left"
        />

        <EditorialChapter
          index="03"
          kicker="Chapter three — the machines"
          title="Every ride on the record."
          body="Confirmed vehicles and weapons, from the '55 Vapid Stanier to the Shitzu Squalo. Stats stay empty until Rockstar says otherwise — nothing is invented to fill space."
          href="/gta-6/vehicles"
          linkLabel="Open the garage"
          media={chapterMedia[2]}
          align="right"
        />

        <FeaturedDiscovery
          media={chapterMedia[3]}
          title={
            featured
              ? `Latest verified: ${featured.name}.`
              : "Evidence first. Always."
          }
          body="Spotted something in a trailer frame or a Newswire post? Submit the evidence — a moderator reviews every claim before the archive changes."
          href="/gta-6/submit"
          linkLabel="Submit evidence"
        />

        <Reveal className="mx-auto max-w-7xl px-5 text-center sm:px-10">
          <h2 className="text-display-gradient mx-auto max-w-3xl font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-8xl">
            Enter the archive.
          </h2>
          <div className="mt-10">
            <Link
              href="/gta-6"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-black transition duration-150 ease-standard hover:bg-white/90 active:scale-[0.98]"
            >
              Open the GTA VI hub
            </Link>
          </div>
          <p className="mt-12 text-xs leading-5 text-text-muted">
            Unofficial fan project. Not affiliated with Rockstar Games or
            Take-Two Interactive.
          </p>
        </Reveal>
      </div>
    </div>
  );
}
