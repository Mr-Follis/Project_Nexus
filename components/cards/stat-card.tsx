import { cn } from "@/lib/utils/cn";

type StatCardProps = {
  value: string;
  label: string;
  tone?: "cyan" | "violet" | "amber" | "green";
  className?: string;
};

const TONE_BORDER: Record<NonNullable<StatCardProps["tone"]>, string> = {
  cyan: "border-accent-secondary/70",
  violet: "border-accent-primary/70",
  amber: "border-status-warning/70",
  green: "border-status-success/70"
};

/**
 * Compact stat for hero strips and dashboards: a large value over a short
 * label, keyed by an accent rule on the left edge.
 */
export function StatCard({
  value,
  label,
  tone = "cyan",
  className
}: StatCardProps) {
  return (
    <div className={cn("border-l-2 pl-4", TONE_BORDER[tone], className)}>
      <p className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
        {value}
      </p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wider text-text-muted sm:text-sm sm:normal-case sm:tracking-normal sm:text-text-secondary">
        {label}
      </p>
    </div>
  );
}
