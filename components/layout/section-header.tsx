import { cn } from "@/lib/utils/cn";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
};

/**
 * Standard heading block for a page section: small uppercase eyebrow, large
 * title, optional supporting line and right-aligned actions.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  actions,
  className
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-secondary">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-2 text-balance font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-pretty text-sm leading-6 text-text-secondary sm:text-base sm:leading-7">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
