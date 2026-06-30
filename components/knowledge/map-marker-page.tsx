import { Map } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getDatabaseUrl } from "@/lib/db/client";
import {
  getPublicGameBySlug,
  listPublicMapMarkers
} from "@/lib/db/repositories/knowledge";
import { formatDate } from "@/lib/utils/date";

type MapMarkerPageProps = {
  gameSlug: string;
};

export async function MapMarkerPage({ gameSlug }: MapMarkerPageProps) {
  const state = await getMarkers(gameSlug);

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        eyebrow="Map"
        title="Interactive map shell"
        description="Published marker records will power filters, detail sheets, and entity links before full MapLibre rendering is added."
        actions={
          <Badge tone={state.markers.length > 0 ? "success" : "warning"}>
            {state.statusLabel}
          </Badge>
        }
      />

      <Card>
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-nexus bg-white/[0.08]">
            <Map className="h-5 w-5 text-accent-secondary" aria-hidden />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              Marker records
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
              {state.message}
            </p>
          </div>
        </div>
      </Card>

      {state.markers.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {state.markers.map((marker) => (
            <Card key={marker.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">
                    {marker.title}
                  </h2>
                  {marker.description ? (
                    <p className="mt-3 text-sm leading-6 text-text-secondary">
                      {marker.description}
                    </p>
                  ) : null}
                  <p className="mt-4 text-xs font-medium text-text-muted">
                    Last updated {formatDate(marker.updatedAt)}
                  </p>
                </div>
                <Badge tone="default">{marker.markerType}</Badge>
              </div>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}

async function getMarkers(gameSlug: string) {
  if (!getDatabaseUrl()) {
    return {
      statusLabel: "Database not configured",
      message:
        "Set DATABASE_URL to render published marker records from the knowledge graph.",
      markers: []
    };
  }

  try {
    const game = await getPublicGameBySlug(gameSlug);

    if (!game) {
      return {
        statusLabel: "No published game",
        message:
          "No published game record is available yet. Draft foundation records are intentionally excluded.",
        markers: []
      };
    }

    const markers = await listPublicMapMarkers({ gameId: game.id });

    return {
      statusLabel:
        markers.length > 0 ? `${markers.length} published` : "No markers yet",
      message:
        markers.length > 0
          ? "These markers are loaded from published map records."
          : "No published markers exist yet. The visual map stays empty until sourced marker data is reviewed.",
      markers
    };
  } catch (error) {
    return {
      statusLabel: "Database unavailable",
      message:
        error instanceof Error
          ? error.message
          : "The database could not be reached.",
      markers: []
    };
  }
}
