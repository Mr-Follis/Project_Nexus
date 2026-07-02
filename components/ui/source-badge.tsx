import { ShieldCheck, ShieldQuestion } from "lucide-react";

import { cn } from "@/lib/utils/cn";

const VERIFICATION_LABELS: Record<string, string> = {
  confirmed_official: "Confirmed official",
  confirmed_gameplay: "Confirmed in gameplay",
  community_verified: "Community verified",
  likely: "Likely",
  speculative: "Speculative",
  outdated: "Outdated",
  rejected: "Rejected"
};

const CONFIRMED = new Set([
  "confirmed_official",
  "confirmed_gameplay",
  "community_verified"
]);

/**
 * Verification badge for knowledge records. Confirmed levels render green
 * with a check shield; everything below renders neutral with a question
 * shield so unverified data is always visually distinct.
 */
export function SourceBadge({
  verification,
  className
}: {
  verification: string;
  className?: string;
}) {
  const confirmed = CONFIRMED.has(verification);
  const Icon = confirmed ? ShieldCheck : ShieldQuestion;

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        confirmed
          ? "border-status-success/40 bg-status-success/10 text-status-success"
          : "border-white/10 bg-white/[0.08] text-text-secondary",
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {VERIFICATION_LABELS[verification] ?? verification.replaceAll("_", " ")}
    </span>
  );
}
