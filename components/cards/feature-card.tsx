import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  body: string;
  href?: string;
  className?: string;
};

/**
 * Icon-led content card. With `href` it becomes a full-card link with hover
 * lift and a corner arrow; without, it renders as a static feature blurb.
 */
export function FeatureCard({
  icon: Icon,
  title,
  body,
  href,
  className
}: FeatureCardProps) {
  const card = (
    <Card
      className={cn(
        "h-full overflow-hidden",
        href &&
          "transition duration-200 ease-standard group-hover:-translate-y-1 group-hover:border-accent-secondary/50 group-hover:shadow-glow",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-nexus border border-white/10 bg-gradient-to-br from-white/[0.1] to-white/[0.02]">
          <Icon className="h-5 w-5 text-accent-secondary" aria-hidden="true" />
        </div>
        {href ? (
          <ArrowUpRight
            className="h-5 w-5 text-text-muted transition duration-200 ease-standard group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text-primary"
            aria-hidden="true"
          />
        ) : null}
      </div>
      <h3 className="mt-6 text-lg font-semibold tracking-tight text-text-primary sm:text-xl">
        {title}
      </h3>
      <p className="mt-2.5 text-sm leading-6 text-text-secondary">{body}</p>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="group block h-full">
        {card}
      </Link>
    );
  }

  return card;
}
