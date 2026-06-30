import Link from "next/link";
import { Bot, Car, Crosshair, Map, Route } from "lucide-react";

import { ModuleGrid } from "@/components/cards/module-grid";
import { PageHeader } from "@/components/layout/page-header";
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
      <PageHeader
        eyebrow="Game hub placeholder"
        title="GTA VI"
        description="The first Project Nexus game hub. This Sprint 1 page establishes navigation and data status patterns without publishing unverified game facts."
        actions={
          <>
            <Button asChild>
              <Link href="/gta-6/map">Open map shell</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/gta-6/ask">Ask placeholder</Link>
            </Button>
          </>
        }
      />

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
