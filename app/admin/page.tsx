import { Database, Inbox, ShieldCheck } from "lucide-react";

import {
  AdminLogin,
  AdminLogoutButton
} from "@/components/admin/admin-session";
import { EntityActions } from "@/components/admin/entity-actions";
import { SubmissionActions } from "@/components/admin/submission-actions";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getAdminSession } from "@/lib/auth/session";
import { getDatabaseUrl } from "@/lib/db/client";
import {
  listAdminEntities,
  listModerationSubmissions
} from "@/lib/db/repositories/knowledge";
import {
  getAllowedModerationStatuses,
  type ModerationStatus
} from "@/lib/validation/moderation";
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
        {state.entities.length > 0 ? (
          state.entities.map(({ entity, game }) => (
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
              <EntityActions
                entityId={entity.id}
                currentStatus={entity.status}
              />
            </Card>
          ))
        ) : (
          <Card>
            <p className="text-sm leading-6 text-text-secondary">
              No knowledge entities yet. Approve a submission to create the
              first draft record.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

type AdminEntity = Awaited<ReturnType<typeof listAdminEntities>>[number];

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
      entities: [] as AdminEntity[]
    };
  }

  try {
    const [submissions, entities] = await Promise.all([
      listModerationSubmissions({ limit: 25 }),
      listAdminEntities({ limit: 25 })
    ]);
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
      entities
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
      entities: [] as AdminEntity[]
    };
  }
}

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
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
