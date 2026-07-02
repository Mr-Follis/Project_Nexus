import { cn } from "@/lib/utils/cn";

/**
 * The single legal/attribution note. Rendered once, in the site footer — do
 * not add extra copies to individual pages.
 */
export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <p
      className={cn(
        "leading-6 text-text-muted",
        compact
          ? "max-w-4xl text-xs sm:text-sm"
          : "rounded-nexus border border-white/10 bg-bg-surface p-4 text-sm"
      )}
    >
      Project Nexus is an unofficial fan companion and is not affiliated with,
      endorsed by, or sponsored by Rockstar Games or Take-Two Interactive. Grand
      Theft Auto, GTA VI, and all related trademarks and promotional media are
      the property of their respective owners. Promotional imagery is used for
      editorial and identification purposes and will be supplemented or replaced
      by original Project Nexus content over time.
    </p>
  );
}
