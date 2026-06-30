import { cn } from "@/lib/utils/cn";

export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <p
      className={cn(
        "text-sm leading-6 text-text-muted",
        compact
          ? "max-w-4xl"
          : "rounded-nexus border border-white/10 bg-bg-surface p-4"
      )}
    >
      Project Nexus is an unofficial fan companion foundation. It is not
      affiliated with, endorsed by, or sponsored by Rockstar Games or Take-Two
      Interactive. Sprint 1 does not publish live GTA VI facts, maps, assets, or
      AI answers.
    </p>
  );
}
