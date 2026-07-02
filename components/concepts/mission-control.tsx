import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Crosshair, Search } from "lucide-react";

import { MissionClock } from "@/components/concepts/mission-clock";
import type { ConceptEntity } from "@/lib/concepts/data";
import { cn } from "@/lib/utils/cn";

const TYPE_LABEL: Record<string, string> = {
  character: "CHR",
  region: "RGN",
  vehicle: "VEH",
  weapon: "WPN",
  shop: "SHP",
  activity: "ACT",
  mission: "MSN",
  other: "REC"
};

const VERIFIED_LEVELS = new Set(["official", "confirmed", "verified"]);

function CornerTicks() {
  return (
    <>
      <span
        className="absolute left-0 top-0 h-2 w-2 border-l border-t border-accent-secondary/50"
        aria-hidden="true"
      />
      <span
        className="absolute right-0 top-0 h-2 w-2 border-r border-t border-accent-secondary/50"
        aria-hidden="true"
      />
      <span
        className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-accent-secondary/50"
        aria-hidden="true"
      />
      <span
        className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-accent-secondary/50"
        aria-hidden="true"
      />
    </>
  );
}

/**
 * The Mission Control surface primitive: a squared hairline panel with corner
 * ticks and a mono header row. Everything on this concept lives in one.
 */
export function PanelFrame({
  label,
  meta,
  className,
  children
}: {
  label: string;
  meta?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "relative rounded-sm border border-white/10 bg-bg-surface/60",
        className
      )}
    >
      <CornerTicks />
      <header className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5">
        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-text-secondary">
          {label}
        </h2>
        {meta ? (
          <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
            {meta}
          </span>
        ) : null}
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}

/**
 * Top chrome of the OS: identity, database link state, live clock, countdown.
 */
export function StatusBar({
  databaseLinked,
  daysToLaunch
}: {
  databaseLinked: boolean;
  daysToLaunch: number;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-bg-base/90 backdrop-blur-xl">
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-bold tracking-tight text-text-primary">
            NEXUS<span className="text-accent-secondary">{"//"}</span>OS
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-widest text-text-muted sm:inline">
            unofficial companion
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest">
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                databaseLinked
                  ? "bg-status-success shadow-[0_0_8px_rgb(var(--color-status-success)/0.8)]"
                  : "bg-status-warning"
              )}
              aria-hidden="true"
            />
            <span
              className={
                databaseLinked ? "text-status-success" : "text-status-warning"
              }
            >
              {databaseLinked ? "DB LINKED" : "DB OFFLINE"}
            </span>
          </span>
          <span className="hidden font-mono text-xs tabular-nums text-text-secondary sm:inline">
            T–{daysToLaunch}d
          </span>
          <MissionClock />
        </div>
      </div>
    </header>
  );
}

/**
 * Command Search: the concept's primary control. Styled as a command-palette
 * input, routed to the real search page.
 */
export function CommandSearch() {
  return (
    <Link
      href="/gta-6/search"
      className="group relative flex h-14 items-center gap-3 rounded-sm border border-white/15 bg-bg-surface/80 px-4 transition duration-150 ease-standard hover:border-accent-secondary/50 hover:bg-bg-elevated/80"
    >
      <CornerTicks />
      <Search className="h-4 w-4 text-accent-secondary" aria-hidden="true" />
      <span className="flex-1 text-sm text-text-muted transition group-hover:text-text-secondary">
        Search the Leonida archive — characters, places, vehicles, shops…
      </span>
      <kbd className="hidden rounded-sm border border-white/15 bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-text-muted sm:inline">
        ⌘K
      </kbd>
    </Link>
  );
}

/**
 * World Status: live database counts as instrument readouts with level bars.
 */
export function WorldStatus({
  entityCounts,
  totalEntities,
  mediaCount,
  sourceCount
}: {
  entityCounts: Record<string, number>;
  totalEntities: number;
  mediaCount: number;
  sourceCount: number;
}) {
  const rows = Object.entries(entityCounts).sort((a, b) => b[1] - a[1]);
  const max = rows.length > 0 ? rows[0][1] : 1;

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 border-b border-white/10 pb-4">
        {[
          { value: totalEntities, label: "records" },
          { value: mediaCount, label: "media assets" },
          { value: sourceCount, label: "official sources" }
        ].map((stat) => (
          <div key={stat.label}>
            <p className="font-mono text-3xl font-bold tabular-nums text-text-primary">
              {stat.value}
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-text-muted">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
      <ul className="mt-4 space-y-2.5">
        {rows.map(([type, count]) => (
          <li key={type} className="flex items-center gap-3">
            <span className="w-24 shrink-0 font-mono text-[10px] uppercase tracking-widest text-text-muted">
              {type}
            </span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
              <span
                className="block h-full rounded-full bg-accent-secondary/70"
                style={{ width: `${Math.max(8, (count / max) * 100)}%` }}
              />
            </span>
            <span className="w-8 shrink-0 text-right font-mono text-xs tabular-nums text-text-secondary">
              {count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Intel feed row: one recently published record with type tag, verification
 * state, and last-update stamp.
 */
export function IntelRow({ entity }: { entity: ConceptEntity }) {
  const verified = VERIFIED_LEVELS.has(entity.verification);

  return (
    <li>
      <Link
        href={`/gta-6/entities/${entity.slug}`}
        className="group flex items-center gap-3 border-b border-white/[0.06] py-2.5 transition duration-150 ease-standard hover:bg-white/[0.03]"
      >
        <span className="w-10 shrink-0 font-mono text-[10px] font-semibold uppercase tracking-widest text-accent-secondary">
          {TYPE_LABEL[entity.type] ?? "REC"}
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-text-primary">
          {entity.name}
        </span>
        <span
          className={cn(
            "shrink-0 font-mono text-[9px] uppercase tracking-widest",
            verified ? "text-status-success" : "text-text-muted"
          )}
        >
          {verified ? "verified" : entity.verification}
        </span>
        <span className="hidden w-20 shrink-0 text-right font-mono text-[10px] tabular-nums text-text-muted sm:inline">
          {entity.updatedAt ? entity.updatedAt.toISOString().slice(0, 10) : "—"}
        </span>
      </Link>
    </li>
  );
}

/**
 * Mission Card: an objective the operator can run right now.
 */
export function MissionCard({
  title,
  brief,
  href,
  status,
  statusTone
}: {
  title: string;
  brief: string;
  href: string;
  status: string;
  statusTone: "live" | "open" | "dev";
}) {
  return (
    <Link
      href={href}
      className="group block border-b border-white/[0.06] py-3.5 transition duration-150 ease-standard last:border-b-0 hover:bg-white/[0.03]"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-text-primary">{title}</p>
        <span
          className={cn(
            "shrink-0 rounded-sm border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest",
            statusTone === "live" &&
              "border-status-success/40 text-status-success",
            statusTone === "open" &&
              "border-accent-secondary/40 text-accent-secondary",
            statusTone === "dev" && "border-white/15 text-text-muted"
          )}
        >
          {status}
        </span>
      </div>
      <p className="mt-1.5 text-xs leading-5 text-text-secondary">{brief}</p>
    </Link>
  );
}

/**
 * Tactical map tile: a gridded stand-in for the live map, ready for verified
 * markers as official location details emerge.
 */
export function MapPanel() {
  return (
    <Link
      href="/gta-6/map"
      className="group relative flex min-h-[180px] flex-col items-center justify-center overflow-hidden rounded-sm bg-[linear-gradient(rgba(54,209,220,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(54,209,220,0.06)_1px,transparent_1px)] bg-[size:24px_24px] transition duration-150 ease-standard hover:bg-[size:22px_22px]"
    >
      <Crosshair
        className="h-8 w-8 text-accent-secondary/70 transition duration-200 ease-standard group-hover:scale-110 group-hover:text-accent-secondary"
        aria-hidden="true"
      />
      <span className="mt-3 font-mono text-[11px] uppercase tracking-[0.25em] text-text-secondary">
        Open tactical map
      </span>
      <span className="mt-1 font-mono text-[9px] uppercase tracking-widest text-text-muted">
        awaiting verified markers
      </span>
    </Link>
  );
}

/**
 * Quick-jump module chip used in the systems row.
 */
export function SystemChip({
  icon: Icon,
  label,
  href
}: {
  icon: LucideIcon;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-2 rounded-sm border border-white/10 bg-bg-surface/60 px-3 py-2 transition duration-150 ease-standard hover:border-accent-secondary/40 hover:bg-bg-elevated/70"
    >
      <Icon className="h-3.5 w-3.5 text-accent-secondary" aria-hidden="true" />
      <span className="font-mono text-[11px] uppercase tracking-widest text-text-secondary transition group-hover:text-text-primary">
        {label}
      </span>
      <ArrowUpRight
        className="ml-auto h-3 w-3 text-text-muted opacity-0 transition duration-150 ease-standard group-hover:opacity-100"
        aria-hidden="true"
      />
    </Link>
  );
}
