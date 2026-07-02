import { cn } from "@/lib/utils/cn";

type CTASectionProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions: React.ReactNode;
  className?: string;
};

/**
 * Closing call-to-action band: gradient-bordered panel with ambient glows,
 * a large display heading, and prominent actions.
 */
export function CTASection({
  eyebrow,
  title,
  description,
  actions,
  className
}: CTASectionProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-nexus border border-accent-primary/25 bg-bg-surface/80 px-6 py-12 text-center shadow-[0_18px_80px_rgba(0,0,0,0.34)] sm:px-10 sm:py-16",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(32rem_16rem_at_50%_-4rem,rgba(124,92,255,0.18),transparent),radial-gradient(24rem_12rem_at_15%_110%,rgba(54,209,220,0.12),transparent)]" />
      <div className="relative mx-auto max-w-2xl">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-secondary">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-4 text-pretty text-sm leading-6 text-text-secondary sm:text-base sm:leading-7">
            {description}
          </p>
        ) : null}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {actions}
        </div>
      </div>
    </section>
  );
}
