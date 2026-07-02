import type { Metadata } from "next";
import { Bot, Car, MapPin, Store, Users } from "lucide-react";

import {
  CommandSearch,
  IntelRow,
  MapPanel,
  MissionCard,
  PanelFrame,
  StatusBar,
  SystemChip,
  WorldStatus
} from "@/components/concepts/mission-control";
import { getConceptData, daysUntilLaunch } from "@/lib/concepts/data";
import { getDatabaseUrl } from "@/lib/db/client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Concept B — Mission Control"
};

/**
 * Concept B: the companion OS. A dense, asymmetric panel grid of live
 * instruments — command search, world status, intel feed, objectives —
 * built entirely from Nexus-vocabulary components.
 */
export default async function MissionControlConceptPage() {
  const { stats, latestEntities } = await getConceptData();
  const databaseLinked = Boolean(getDatabaseUrl() && stats);

  return (
    <div className="min-h-screen bg-bg-base pb-32">
      <StatusBar
        databaseLinked={databaseLinked}
        daysToLaunch={daysUntilLaunch()}
      />

      <main className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Leonida, under watch.
          </h1>
          <p className="max-w-xl text-sm leading-6 text-text-secondary">
            The verified GTA VI archive as an operations surface. Every readout
            below is live database state — nothing is decorative.
          </p>
        </div>

        <CommandSearch />

        <div className="mt-3 flex flex-wrap gap-2">
          <SystemChip
            icon={Users}
            label="Characters"
            href="/gta-6/characters"
          />
          <SystemChip icon={MapPin} label="Regions" href="/gta-6/regions" />
          <SystemChip icon={Car} label="Vehicles" href="/gta-6/vehicles" />
          <SystemChip icon={Store} label="Shops" href="/gta-6/shops" />
          <SystemChip icon={Bot} label="Ask Nexus" href="/gta-6/ask" />
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-12">
          <PanelFrame
            label="World status"
            meta={databaseLinked ? "live" : "no database bound"}
            className="lg:col-span-7"
          >
            {stats ? (
              <WorldStatus
                entityCounts={stats.entityCounts}
                totalEntities={stats.totalEntities}
                mediaCount={stats.mediaCount}
                sourceCount={stats.officialSourceCount}
              />
            ) : (
              <p className="py-8 text-center font-mono text-xs uppercase tracking-widest text-text-muted">
                No telemetry — bind a database to bring this panel online.
              </p>
            )}
          </PanelFrame>

          <PanelFrame
            label="Active objectives"
            meta="3 available"
            className="lg:col-span-5"
          >
            <MissionCard
              title="Submit evidence"
              brief="Send a trailer frame, screenshot, or Newswire link into the moderation queue."
              href="/gta-6/submit"
              status="open"
              statusTone="open"
            />
            <MissionCard
              title="Explore the archive"
              brief="Browse every published record with sources and verification levels."
              href="/gta-6"
              status="live"
              statusTone="live"
            />
            <MissionCard
              title="Ask Nexus"
              brief="The assistant will answer from approved records only — no invented facts."
              href="/gta-6/ask"
              status="in dev"
              statusTone="dev"
            />
          </PanelFrame>

          <PanelFrame
            label="Latest intel"
            meta="most recently updated"
            className="lg:col-span-7"
          >
            {latestEntities.length > 0 ? (
              <ul>
                {latestEntities.map((entity) => (
                  <IntelRow key={entity.id} entity={entity} />
                ))}
              </ul>
            ) : (
              <p className="py-8 text-center font-mono text-xs uppercase tracking-widest text-text-muted">
                No published records yet.
              </p>
            )}
          </PanelFrame>

          <PanelFrame
            label="Tactical map"
            meta="v0 shell"
            className="lg:col-span-5"
          >
            <MapPanel />
          </PanelFrame>
        </div>

        <p className="mt-10 border-t border-white/10 pt-5 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-text-muted">
          Unofficial companion — not affiliated with Rockstar Games or Take-Two
          Interactive
        </p>
      </main>
    </div>
  );
}
