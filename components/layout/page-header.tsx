import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actions
}: PageHeaderProps) {
  return (
    <Reveal
      trigger="mount"
      className="rounded-nexus border border-white/10 bg-bg-surface/70 p-6 shadow-glow sm:p-8"
    >
      {eyebrow ? <Badge tone="accent">{eyebrow}</Badge> : null}
      <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-display-gradient text-balance font-display text-4xl font-bold leading-[1.02] tracking-tight sm:text-6xl">
            {title}
          </h1>
          <p className="mt-4 text-pretty text-base leading-7 text-text-secondary sm:text-lg">
            {description}
          </p>
        </div>
        {actions ? (
          <div className="flex flex-col gap-3 sm:flex-row">{actions}</div>
        ) : null}
      </div>
    </Reveal>
  );
}
