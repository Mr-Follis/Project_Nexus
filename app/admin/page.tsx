import { Database, Inbox, ShieldCheck } from "lucide-react";

import {
  AdminLogin,
  AdminLogoutButton
} from "@/components/admin/admin-session";
import { InlineActionButton } from "@/components/admin/inline-action-button";
import {
  RecordForm,
  type RecordFieldConfig
} from "@/components/admin/record-form";
import { StatusActions } from "@/components/admin/status-actions";
import { SubmissionActions } from "@/components/admin/submission-actions";
import { MediaAttribution } from "@/components/media/media-attribution";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getAdminSession } from "@/lib/auth/session";
import { getDatabaseUrl } from "@/lib/db/client";
import {
  listAdminEntities,
  listAdminEntitySources,
  listAdminSources,
  listGames,
  listModerationSubmissions
} from "@/lib/db/repositories/knowledge";
import { listAdminMedia } from "@/lib/db/repositories/media";
import {
  entityTypeSchema,
  sourceTypeSchema,
  verificationStatusSchema
} from "@/lib/validation/knowledge";
import {
  getAllowedModerationStatuses,
  type ModerationStatus
} from "@/lib/validation/moderation";
import { resolveMediaAttribution } from "@/lib/validation/media";
import { formatDate } from "@/lib/utils/date";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = getAdminSession();

  if (!session.authenticated) {
    return (
      <div className="space-y-8 pb-12">
        <PageHeader
          eyebrow="Admin foundation"
          title="Moderation workspace"
          description="Review community submissions before any public factual record is created or changed."
        />
        {session.configured ? (
          <AdminLogin />
        ) : (
          <Card>
            <h2 className="text-lg font-semibold text-text-primary">
              Admin access is not configured
            </h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Set <code>ADMIN_ACCESS_TOKEN</code> in the environment (Replit
              Secrets) and restart the app to enable the moderation workspace.
            </p>
          </Card>
        )}
      </div>
    );
  }

  const state = await getModerationState();

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        eyebrow="Admin foundation"
        title="Moderation workspace"
        description="Review community submissions before any public factual record is created or changed."
        actions={
          <div className="flex items-center gap-3">
            <Badge tone={state.statusTone}>{state.statusLabel}</Badge>
            <AdminLogoutButton />
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <Inbox className="h-5 w-5 text-accent-secondary" aria-hidden />
          <p className="mt-5 text-3xl font-semibold text-text-primary">
            {state.submissions.length}
          </p>
          <p className="mt-2 text-sm text-text-secondary">Queue records</p>
        </Card>
        <Card>
          <ShieldCheck className="h-5 w-5 text-status-success" aria-hidden />
          <p className="mt-5 text-3xl font-semibold text-text-primary">
            {state.newCount}
          </p>
          <p className="mt-2 text-sm text-text-secondary">New submissions</p>
        </Card>
        <Card>
          <Database className="h-5 w-5 text-status-warning" aria-hidden />
          <p className="mt-5 text-3xl font-semibold text-text-primary">
            {state.configured ? "Ready" : "Off"}
          </p>
          <p className="mt-2 text-sm text-text-secondary">Database state</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-text-primary">
          {state.heading}
        </h2>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          {state.message}
        </p>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">Games</h2>
        <p className="text-sm leading-6 text-text-secondary">
          Public pages, APIs, search, and maps only expose a game once it is
          published. Publish a game to make its published entities and media
          visible.
        </p>
        <RecordForm
          endpoint="/api/admin/games"
          method="POST"
          fields={buildGameFields()}
          toggleLabel="New game"
          submitLabel="Create game"
          successMessage="Game created as a draft."
        />
        {state.games.length > 0 ? (
          state.games.map((game) => (
            <Card key={game.id}>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={getStatusTone(game.status)}>
                  {formatStatus(game.status)}
                </Badge>
                <Badge>{game.slug}</Badge>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-text-primary">
                {game.title}
              </h3>
              {game.description ? (
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  {game.description}
                </p>
              ) : null}
              <RecordForm
                endpoint={`/api/admin/games/${game.id}`}
                method="PUT"
                fields={buildGameFields(game)}
                toggleLabel="Edit game"
                submitLabel="Save changes"
                successMessage="Game updated."
              />
              <StatusActions
                endpoint={`/api/admin/games/${game.id}`}
                currentStatus={game.status}
              />
            </Card>
          ))
        ) : (
          <Card>
            <p className="text-sm leading-6 text-text-secondary">
              No games yet. Run the foundation seed or create the first game
              record above.
            </p>
          </Card>
        )}
      </div>

      {state.submissions.length > 0 ? (
        <div className="space-y-4">
          {state.submissions.map(({ game, submission }) => {
            const allowedStatuses = getAllowedModerationStatuses(
              submission.status as ModerationStatus
            );

            return (
              <Card key={submission.id}>
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={getStatusTone(submission.status)}>
                        {formatStatus(submission.status)}
                      </Badge>
                      <Badge>{game.title}</Badge>
                      <Badge>{submission.submissionType}</Badge>
                    </div>
                    <h2 className="mt-4 text-xl font-semibold text-text-primary">
                      {submission.title}
                    </h2>
                    {submission.description ? (
                      <p className="mt-3 text-sm leading-6 text-text-secondary">
                        {submission.description}
                      </p>
                    ) : null}
                    <div className="mt-4 flex flex-wrap gap-3 text-xs font-medium text-text-muted">
                      <span>Created {formatDate(submission.createdAt)}</span>
                      <span>Updated {formatDate(submission.updatedAt)}</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm">
                      {submission.evidenceUrl ? (
                        <a
                          href={submission.evidenceUrl}
                          className="text-accent-secondary hover:text-accent-secondary/80"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Evidence
                        </a>
                      ) : null}
                      {submission.screenshotUrl ? (
                        <a
                          href={submission.screenshotUrl}
                          className="text-accent-secondary hover:text-accent-secondary/80"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Screenshot
                        </a>
                      ) : null}
                    </div>
                    {submission.moderatorNotes ? (
                      <p className="mt-4 rounded-nexus border border-white/10 bg-white/[0.05] p-3 text-sm leading-6 text-text-secondary">
                        {submission.moderatorNotes}
                      </p>
                    ) : null}
                  </div>
                </div>
                <SubmissionActions
                  submissionId={submission.id}
                  allowedStatuses={[...allowedStatuses]}
                />
              </Card>
            );
          })}
        </div>
      ) : null}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">
          Knowledge entities
        </h2>
        <p className="text-sm leading-6 text-text-secondary">
          Draft records — including those created from approved submissions —
          stay unpublished until you publish them here.
        </p>
        {state.games.length > 0 ? (
          <RecordForm
            endpoint="/api/admin/entities"
            method="POST"
            fields={buildEntityFields({ games: state.games })}
            toggleLabel="New entity"
            submitLabel="Create entity"
            successMessage="Entity created as a draft."
          />
        ) : null}
        {state.entities.length > 0 ? (
          state.entities.map(({ entity, game }) => {
            const linkedSources = state.entitySourceLinks.filter(
              (link) => link.entityId === entity.id
            );

            return (
              <Card key={entity.id}>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={getStatusTone(entity.status)}>
                    {formatStatus(entity.status)}
                  </Badge>
                  <Badge>{game.title}</Badge>
                  <Badge>{entity.type}</Badge>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-text-primary">
                  {entity.name}
                </h3>
                {entity.summary ? (
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    {entity.summary}
                  </p>
                ) : null}
                <div className="mt-3 text-xs font-medium text-text-muted">
                  Updated {formatDate(entity.updatedAt)}
                </div>
                <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
                  <p className="text-xs font-medium text-text-muted">
                    Linked sources
                  </p>
                  {linkedSources.length > 0 ? (
                    linkedSources.map((link) => (
                      <div
                        key={link.id}
                        className="flex flex-wrap items-center gap-3 text-sm text-text-secondary"
                      >
                        <span className="min-w-0">
                          {link.source.title ?? "Untitled source"}
                          <span className="text-text-muted">
                            {" "}
                            ({formatStatus(link.source.type)})
                          </span>
                          {link.claim ? ` — ${link.claim}` : null}
                        </span>
                        <InlineActionButton
                          endpoint={`/api/admin/entity-sources/${link.id}`}
                          method="DELETE"
                          label="Detach"
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-text-muted">
                      No sources linked yet. Public factual records should cite
                      at least one source before publishing.
                    </p>
                  )}
                  {state.sources.length > 0 ? (
                    <RecordForm
                      endpoint={`/api/admin/entities/${entity.id}/sources`}
                      method="POST"
                      fields={buildEntitySourceFields(state.sources)}
                      toggleLabel="Link source"
                      submitLabel="Attach source"
                      successMessage="Source linked."
                    />
                  ) : null}
                </div>
                <RecordForm
                  endpoint={`/api/admin/entities/${entity.id}`}
                  method="PUT"
                  fields={buildEntityFields({ entity })}
                  toggleLabel="Edit entity"
                  submitLabel="Save changes"
                  successMessage="Entity updated."
                />
                <StatusActions
                  endpoint={`/api/admin/entities/${entity.id}`}
                  currentStatus={entity.status}
                />
              </Card>
            );
          })
        ) : (
          <Card>
            <p className="text-sm leading-6 text-text-secondary">
              No knowledge entities yet. Approve a submission or create a draft
              record above.
            </p>
          </Card>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">Sources</h2>
        <p className="text-sm leading-6 text-text-secondary">
          Source records back public factual claims. Record where each fact came
          from, who published it, and how reliable it is before linking it to
          knowledge entities.
        </p>
        <RecordForm
          endpoint="/api/admin/sources"
          method="POST"
          fields={buildSourceFields({ games: state.games })}
          toggleLabel="New source"
          submitLabel="Create source"
          successMessage="Source created."
        />
        {state.sources.length > 0 ? (
          state.sources.map(({ source, game }) => (
            <Card key={source.id}>
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{formatStatus(source.type)}</Badge>
                {game ? <Badge>{game.title}</Badge> : null}
                <Badge>Reliability {source.reliabilityScore}</Badge>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-text-primary">
                {source.title ?? "Untitled source"}
              </h3>
              {source.author ? (
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  {source.author}
                </p>
              ) : null}
              {source.notes ? (
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  {source.notes}
                </p>
              ) : null}
              {source.url ? (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-sm text-accent-secondary hover:text-accent-secondary/80"
                >
                  Open source
                </a>
              ) : null}
              <RecordForm
                endpoint={`/api/admin/sources/${source.id}`}
                method="PUT"
                fields={buildSourceFields({ source })}
                toggleLabel="Edit source"
                submitLabel="Save changes"
                successMessage="Source updated."
              />
            </Card>
          ))
        ) : (
          <Card>
            <p className="text-sm leading-6 text-text-secondary">
              No source records yet. Create one before publishing factual
              records.
            </p>
          </Card>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">
          Media library
        </h2>
        <p className="text-sm leading-6 text-text-secondary">
          Official promotional media is stored as editorial placeholders with
          full attribution and can be published, hidden, or replaced later by
          original Project Nexus content.
        </p>
        {state.media.length > 0 ? (
          state.media.map(({ media, game }) => (
            <Card key={media.id}>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={getStatusTone(media.status)}>
                  {formatStatus(media.status)}
                </Badge>
                <Badge>{game.title}</Badge>
                <Badge>{formatStatus(media.type)}</Badge>
                {media.isFeatured ? (
                  <Badge tone="accent">Featured</Badge>
                ) : null}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-text-primary">
                {media.title}
              </h3>
              {media.caption ? (
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  {media.caption}
                </p>
              ) : null}
              <MediaAttribution
                attribution={resolveMediaAttribution(media)}
                provenance={media.provenance}
                className="mt-3 text-xs"
              />
              {media.originalUrl ? (
                <a
                  href={media.originalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-sm text-accent-secondary hover:text-accent-secondary/80"
                >
                  Source
                </a>
              ) : null}
              <StatusActions
                endpoint={`/api/admin/media/${media.id}`}
                currentStatus={media.status}
              />
            </Card>
          ))
        ) : (
          <Card>
            <p className="text-sm leading-6 text-text-secondary">
              No media assets yet. Run the foundation seed to add the starter
              library.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

type AdminEntity = Awaited<ReturnType<typeof listAdminEntities>>[number];
type AdminMedia = Awaited<ReturnType<typeof listAdminMedia>>[number];
type AdminGame = Awaited<ReturnType<typeof listGames>>[number];
type AdminSource = Awaited<ReturnType<typeof listAdminSources>>[number];
type AdminEntitySourceLink = Awaited<
  ReturnType<typeof listAdminEntitySources>
>[number];

async function getModerationState() {
  if (!getDatabaseUrl()) {
    return {
      configured: false,
      statusTone: "warning" as const,
      statusLabel: "Database not configured",
      heading: "Moderation queue unavailable",
      message: "Set DATABASE_URL to load community submissions for moderation.",
      submissions: [],
      newCount: 0,
      entities: [] as AdminEntity[],
      media: [] as AdminMedia[],
      games: [] as AdminGame[],
      sources: [] as AdminSource[],
      entitySourceLinks: [] as AdminEntitySourceLink[]
    };
  }

  try {
    const [submissions, entities, media, games, sources] = await Promise.all([
      listModerationSubmissions({ limit: 25 }),
      listAdminEntities({ limit: 25 }),
      listAdminMedia({ limit: 25 }),
      listGames(),
      listAdminSources({ limit: 25 })
    ]);
    const entitySourceLinks = await listAdminEntitySources(
      entities.map(({ entity }) => entity.id)
    );
    const newCount = submissions.filter(
      ({ submission }) => submission.status === "new"
    ).length;

    return {
      configured: true,
      statusTone:
        submissions.length > 0 ? ("accent" as const) : ("success" as const),
      statusLabel:
        submissions.length > 0 ? `${submissions.length} queued` : "Queue clear",
      heading:
        submissions.length > 0
          ? "Submission review queue"
          : "No submissions waiting",
      message:
        submissions.length > 0
          ? "Review evidence and mark submissions before creating or changing public records."
          : "Community submissions will appear here after intake records are created.",
      submissions,
      newCount,
      entities,
      media,
      games,
      sources,
      entitySourceLinks
    };
  } catch (error) {
    return {
      configured: true,
      statusTone: "warning" as const,
      statusLabel: "Queue unavailable",
      heading: "Moderation queue unavailable",
      message:
        error instanceof Error
          ? error.message
          : "Could not load moderation submissions.",
      submissions: [],
      newCount: 0,
      entities: [] as AdminEntity[],
      media: [] as AdminMedia[],
      games: [] as AdminGame[],
      sources: [] as AdminSource[],
      entitySourceLinks: [] as AdminEntitySourceLink[]
    };
  }
}

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

function enumOptions(values: readonly string[]) {
  return values.map((value) => ({ value, label: formatStatus(value) }));
}

function buildGameFields(game?: AdminGame): RecordFieldConfig[] {
  return [
    {
      name: "title",
      label: "Title",
      kind: "text",
      required: true,
      defaultValue: game?.title
    },
    {
      name: "slug",
      label: "Slug",
      kind: "text",
      required: true,
      placeholder: "gta-6",
      help: "Lowercase URL-safe identifier. Changing it changes public URLs.",
      defaultValue: game?.slug
    },
    {
      name: "releaseDate",
      label: "Release date",
      kind: "date",
      defaultValue: game?.releaseDate ?? undefined
    },
    {
      name: "platforms",
      label: "Platforms (comma-separated)",
      kind: "tags",
      placeholder: "PS5, Xbox Series X|S",
      defaultValue: game?.platforms.join(", ")
    },
    {
      name: "description",
      label: "Description",
      kind: "textarea",
      defaultValue: game?.description ?? undefined
    }
  ];
}

function buildEntityFields(
  options:
    | { games: AdminGame[]; entity?: undefined }
    | { games?: undefined; entity: AdminEntity["entity"] }
): RecordFieldConfig[] {
  const entity = options.entity;
  const fields: RecordFieldConfig[] = [];

  if (!entity) {
    fields.push({
      name: "gameId",
      label: "Game",
      kind: "select",
      required: true,
      options: (options.games ?? []).map((game) => ({
        value: game.id,
        label: game.title
      }))
    });
  }

  fields.push(
    {
      name: "type",
      label: "Type",
      kind: "select",
      required: true,
      options: enumOptions(entityTypeSchema.options),
      defaultValue: entity?.type ?? "other"
    },
    {
      name: "name",
      label: "Name",
      kind: "text",
      required: true,
      defaultValue: entity?.name
    },
    {
      name: "slug",
      label: "Slug",
      kind: "text",
      required: true,
      placeholder: "coyote-hatchback",
      help: "Unique within the game. Changing it changes public URLs.",
      defaultValue: entity?.slug
    },
    {
      name: "verification",
      label: "Verification",
      kind: "select",
      required: true,
      options: enumOptions(verificationStatusSchema.options),
      defaultValue: entity?.verification ?? "speculative"
    },
    {
      name: "confidenceScore",
      label: "Confidence (0-100)",
      kind: "number",
      min: 0,
      max: 100,
      defaultValue: String(entity?.confidenceScore ?? 0)
    },
    {
      name: "summary",
      label: "Summary",
      kind: "textarea",
      defaultValue: entity?.summary ?? undefined
    },
    {
      name: "description",
      label: "Description",
      kind: "textarea",
      defaultValue: entity?.description ?? undefined
    }
  );

  return fields;
}

function buildEntitySourceFields(sources: AdminSource[]): RecordFieldConfig[] {
  return [
    {
      name: "sourceId",
      label: "Source",
      kind: "select",
      required: true,
      options: sources.map(({ source }) => ({
        value: source.id,
        label: source.title
          ? `${source.title} (${formatStatus(source.type)})`
          : formatStatus(source.type)
      }))
    },
    {
      name: "fieldName",
      label: "Field (optional)",
      kind: "text",
      placeholder: "top_speed",
      help: "Name the specific field this source backs, if any."
    },
    {
      name: "claim",
      label: "Claim (optional)",
      kind: "textarea",
      placeholder: "What does this source support?"
    }
  ];
}

function buildSourceFields(
  options:
    | { games: AdminGame[]; source?: undefined }
    | { games?: undefined; source: AdminSource["source"] }
): RecordFieldConfig[] {
  const source = options.source;
  const fields: RecordFieldConfig[] = [];

  if (!source) {
    fields.push({
      name: "gameId",
      label: "Game (optional)",
      kind: "select",
      options: (options.games ?? []).map((game) => ({
        value: game.id,
        label: game.title
      }))
    });
  }

  fields.push(
    {
      name: "type",
      label: "Type",
      kind: "select",
      required: true,
      options: enumOptions(sourceTypeSchema.options),
      defaultValue: source?.type ?? "official"
    },
    {
      name: "title",
      label: "Title",
      kind: "text",
      defaultValue: source?.title ?? undefined
    },
    {
      name: "url",
      label: "URL",
      kind: "text",
      placeholder: "https://…",
      defaultValue: source?.url ?? undefined
    },
    {
      name: "author",
      label: "Author",
      kind: "text",
      defaultValue: source?.author ?? undefined
    },
    {
      name: "publishedAt",
      label: "Published on",
      kind: "datetime",
      defaultValue: source?.publishedAt?.toISOString().slice(0, 10)
    },
    {
      name: "reliabilityScore",
      label: "Reliability (0-100)",
      kind: "number",
      min: 0,
      max: 100,
      defaultValue: String(source?.reliabilityScore ?? 50)
    },
    {
      name: "permissionNotes",
      label: "Permission notes",
      kind: "textarea",
      defaultValue: source?.permissionNotes ?? undefined
    },
    {
      name: "notes",
      label: "Notes",
      kind: "textarea",
      defaultValue: source?.notes ?? undefined
    }
  );

  return fields;
}

function getStatusTone(status: string) {
  if (status === "approved") {
    return "success";
  }

  if (status === "new" || status === "needs_more_info") {
    return "accent";
  }

  if (status === "duplicate" || status === "rejected" || status === "spam") {
    return "warning";
  }

  return "default";
}
