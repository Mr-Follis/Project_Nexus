import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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

      <Card>
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-nexus bg-white/[0.08]">
            <Icon className="h-5 w-5 text-accent-secondary" aria-hidden />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              Published records
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
              {state.message}
            </p>
          </div>
        </div>
      </Card>

      {state.entities.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {state.entities.map((entity) => (
            <Link
              key={entity.id}
              href={`/gta-6/entities/${entity.slug}`}
              className="group block"
            >
              <Card className="h-full transition duration-200 ease-standard group-hover:-translate-y-1 group-hover:border-accent-secondary/50">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-text-primary">
                      {entity.name}
                    </h2>
                    {entity.summary ? (
                      <p className="mt-3 text-sm leading-6 text-text-secondary">
                        {entity.summary}
                      </p>
                    ) : null}
                    <p className="mt-4 text-xs font-medium text-text-muted">
                      Last updated {formatDate(entity.updatedAt)}
                    </p>
                  </div>
                  <Badge tone="default">{entity.verification}</Badge>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : null}
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
          : "No published records exist for this category yet. Empty fields stay empty until sourced and reviewed data is available.",
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
