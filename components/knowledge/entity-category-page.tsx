import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SourceBadge } from "@/components/ui/source-badge";
import { getDatabaseUrl } from "@/lib/db/client";
import {
  getPublicGameBySlug,
  listPublicEntities
} from "@/lib/db/repositories/knowledge";
import { formatDate } from "@/lib/utils/date";
import type { EntityType } from "@/types/nexus";

type EntityCategoryPageProps = {
  gameSlug: string;
  entityType: EntityType;
  icon: LucideIcon;
  label: string;
  title: string;
  description: string;
};

export async function EntityCategoryPage({
  gameSlug,
  entityType,
  icon: Icon,
  label,
  title,
  description
}: EntityCategoryPageProps) {
  const state = await getPublishedEntities(gameSlug, entityType);

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        eyebrow={label}
        title={title}
        description={description}
        actions={
          <Badge tone={state.entities.length > 0 ? "success" : "warning"}>
            {state.statusLabel}
          </Badge>
        }
      />

      {state.entities.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {state.entities.map((entity) => (
            <Link
              key={entity.id}
              href={`/gta-6/entities/${entity.slug}`}
              className="group block"
            >
              <Card className="h-full transition duration-200 ease-standard group-hover:-translate-y-1 group-hover:border-accent-secondary/50 group-hover:shadow-glow">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-lg font-semibold tracking-tight text-text-primary">
                    {entity.name}
                  </h2>
                  <SourceBadge
                    verification={entity.verification}
                    className="shrink-0"
                  />
                </div>
                {entity.summary ? (
                  <p className="mt-3 text-sm leading-6 text-text-secondary">
                    {entity.summary}
                  </p>
                ) : null}
                <p className="mt-4 text-xs font-medium text-text-muted">
                  Last updated {formatDate(entity.updatedAt)}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <div className="mx-auto flex max-w-xl flex-col items-center py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
              <Icon
                className="h-6 w-6 text-accent-secondary"
                aria-hidden="true"
              />
            </div>
            <h2 className="mt-6 text-xl font-semibold tracking-tight text-text-primary">
              Nothing confirmed here yet
            </h2>
            <p className="mt-3 text-sm leading-6 text-text-secondary">
              {state.message}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="secondary">
                <Link href="/gta-6/submit">Submit evidence</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/gta-6">Back to the hub</Link>
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

async function getPublishedEntities(gameSlug: string, entityType: EntityType) {
  if (!getDatabaseUrl()) {
    return {
      statusLabel: "Database not configured",
      message:
        "Set DATABASE_URL to render published records from the knowledge graph. Until then, this page stays empty by design.",
      entities: []
    };
  }

  try {
    const game = await getPublicGameBySlug(gameSlug);

    if (!game) {
      return {
        statusLabel: "No published game",
        message:
          "No published game record is available yet. Draft foundation records are intentionally not shown on public pages.",
        entities: []
      };
    }

    const entities = await listPublicEntities({
      gameId: game.id,
      type: entityType
    });

    return {
      statusLabel:
        entities.length > 0 ? `${entities.length} published` : "No records yet",
      message:
        entities.length > 0
          ? "These records are loaded from published knowledge graph entries."
          : "No published records exist for this category yet. Empty sections stay empty until officially sourced and reviewed data is available — nothing is generated to fill space.",
      entities
    };
  } catch (error) {
    return {
      statusLabel: "Database unavailable",
      message:
        error instanceof Error
          ? error.message
          : "The database could not be reached.",
      entities: []
    };
  }
}
