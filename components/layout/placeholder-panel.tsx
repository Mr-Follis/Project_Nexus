import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type PlaceholderPanelProps = {
  icon: LucideIcon;
  label: string;
  title: string;
  description: string;
  children?: React.ReactNode;
};

export function PlaceholderPanel({
  icon: Icon,
  label,
  title,
  description,
  children
}: PlaceholderPanelProps) {
  return (
    <div className="space-y-8 pb-12">
      <Card className="min-h-[420px] overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_10%,rgba(54,209,220,0.16),transparent_36%),radial-gradient(circle_at_10%_20%,rgba(124,92,255,0.18),transparent_32%)]" />
        <Badge tone="accent">{label}</Badge>
        <div className="mt-12 max-w-3xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-nexus border border-white/10 bg-bg-elevated">
            <Icon
              className="h-7 w-7 text-accent-secondary"
              aria-hidden="true"
            />
          </div>
          <h1 className="mt-6 text-balance text-4xl font-semibold text-text-primary sm:text-6xl">
            {title}
          </h1>
          <p className="mt-5 text-pretty text-base leading-7 text-text-secondary sm:text-lg">
            {description}
          </p>
        </div>
      </Card>
      {children}
    </div>
  );
}
