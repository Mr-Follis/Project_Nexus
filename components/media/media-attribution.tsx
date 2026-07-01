import { cn } from "@/lib/utils/cn";

const PROVENANCE_LABEL: Record<string, string> = {
  official_promotional: "Official promotional media",
  project_nexus_original: "Project Nexus original",
  community_approved: "Community-approved",
  placeholder: "Placeholder art"
};

/**
 * Renders the provenance label and required credit for a media asset. Keeping
 * this in one component means official promotional media never appears without
 * its attribution, and the label makes the "replace later" plan visible.
 */
export function MediaAttribution({
  attribution,
  provenance,
  className
}: {
  attribution?: string | null;
  provenance?: string | null;
  className?: string;
}) {
  const label = provenance ? (PROVENANCE_LABEL[provenance] ?? null) : null;

  if (!attribution && !label) {
    return null;
  }

  return (
    <p className={cn("flex flex-wrap items-center gap-x-2 gap-y-1", className)}>
      {label ? (
        <span className="font-medium uppercase tracking-wide text-text-secondary">
          {label}
        </span>
      ) : null}
      {attribution ? (
        <span className="text-text-muted">{attribution}</span>
      ) : null}
    </p>
  );
}
