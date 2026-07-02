import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { EntityMediaGallery } from "@/components/media/entity-media-gallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SourceBadge } from "@/components/ui/source-badge";
import { getDatabaseUrl } from "@/lib/db/client";
import {
  getPublicEntityBySlug,
  getPublicGameBySlug,
  listSourcesForEntity
} from "@/lib/db/repositories/knowledge";
import { listPublicMediaForEntity } from "@/lib/db/repositories/media";
import { formatDate } from "@/lib/utils/date";

type EntityDetailPageProps = {
  gameSlug: string;
  entitySlug: string;
};

export async function EntityDetailPage({
  gameSlug,
  entitySlug
}: EntityDetailPageProps) {
  const state = await getPublishedEntity(gameSlug, entitySlug);

  if (state.kind === "not-found") {
    notFound();
  }

  if (state.kind === "unavailable") {
    return (
      <div className="space-y-8 pb-12">
        <PageHeader
          eyebrow="Entity detail"
          title="Published record unavailable"
          description={state.message}
          actions={<Badge tone="warning">{state.statusLabel}</Badge>}
        />
      </div>
    );
  }

  const { entity, sources, media } = state;

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        eyebrow={entity.type}
        title={entity.name}
        description={
          entity.summary ??
          "This published record has no summary yet. Empty fields remain blank until sourced data is reviewed."
        }
        actions={
          <>
            <SourceBadge verification={entity.verification} />
            <Button asChild variant="secondary">
              <Link href={getCategoryPath(entity.type)}>Back to category</Link>
            </Button>
          </>
        }
      />

      <Card>
        <div className="grid gap-6 md:grid-cols-3">
          <EntityFact label="Status" value={entity.status} />
          <EntityFact label="Verification" value={entity.verification} />
          <EntityFact
            label="Confidence"
            value={`${entity.confidenceScore}/100`}
          />
          <EntityFact
            label="Last updated"
            value={formatDate(entity.updatedAt)}
          />
          <EntityFact
            label="Last verified"
            value={formatDate(entity.lastVerifiedAt)}
          />
        </div>
      </Card>

      {entity.description ? (
        <Card>
          <h2 className="text-lg font-semibold text-text-primary">Details</h2>
          <p className="mt-3 text-sm leading-6 text-text-secondary">
            {entity.description}
          </p>
        </Card>
      ) : null}

      <EntityMediaGallery assets={media} />

      <Card>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Sources</h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Published records should retain source links for every public
              claim. This section stays empty until reviewed evidence is
              attached.
            </p>
          </div>
          <Badge tone={sources.length > 0 ? "success" : "warning"}>
            {sources.length > 0 ? `${sources.length} linked` : "No sources yet"}
          </Badge>
        </div>

        {sources.length > 0 ? (
          <div className="mt-6 space-y-4">
            {sources.map((sourceLink) => (
              <div
                key={`${sourceLink.source.id}-${sourceLink.fieldName ?? "record"}`}
                className="border-t border-white/10 pt-4 first:border-t-0 first:pt-0"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">
                      {sourceLink.source.title ?? sourceLink.source.url}
                    </h3>
                    {sourceLink.claim ? (
                      <p className="mt-2 text-sm leading-6 text-text-secondary">
                        {sourceLink.claim}
                      </p>
                    ) : null}
                  </div>
                  <Badge tone="default">{sourceLink.source.type}</Badge>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </Card>
    </div>
  );
}

const CATEGORY_PATHS: Record<string, string> = {
  character: "/gta-6/characters",
  region: "/gta-6/regions",
  vehicle: "/gta-6/vehicles",
  weapon: "/gta-6/weapons",
  mission: "/gta-6/missions",
  shop: "/gta-6/shops"
};

// Types without a dedicated category page (activity, other, ...) fall back
// to the game hub instead of a naive `${type}s` 404.
function getCategoryPath(entityType: string) {
  return CATEGORY_PATHS[entityType] ?? "/gta-6";
}

function EntityFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-text-muted">{label}</p>
      <p className="mt-2 text-sm font-medium text-text-primary">{value}</p>
    </div>
  );
}

async function getPublishedEntity(gameSlug: string, entitySlug: string) {
  if (!getDatabaseUrl()) {
    return {
      kind: "unavailable" as const,
      statusLabel: "Database not configured",
      message:
        "Set DATABASE_URL to render published entity details from the knowledge graph."
    };
  }

  try {
    const game = await getPublicGameBySlug(gameSlug);

    if (!game) {
      return { kind: "not-found" as const };
    }

    const entity = await getPublicEntityBySlug({
      gameId: game.id,
      slug: entitySlug
    });

    if (!entity) {
      return { kind: "not-found" as const };
    }

    const [sources, media] = await Promise.all([
      listSourcesForEntity(entity.id),
      listPublicMediaForEntity(entity.id)
    ]);

    return {
      kind: "ready" as const,
      entity,
      sources,
      media
    };
  } catch (error) {
    return {
      kind: "unavailable" as const,
      statusLabel: "Database unavailable",
      message:
        error instanceof Error
          ? error.message
          : "The database could not be reached."
    };
  }
}
