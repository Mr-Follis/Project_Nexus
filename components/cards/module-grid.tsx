import type { LucideIcon } from "lucide-react";

import { FeatureCard } from "@/components/cards/feature-card";

type Module = {
  title: string;
  href: string;
  description: string;
  icon: LucideIcon;
};

export function ModuleGrid({ modules }: { modules: Module[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {modules.map((module) => (
        <FeatureCard
          key={module.href}
          icon={module.icon}
          title={module.title}
          body={module.description}
          href={module.href}
        />
      ))}
    </div>
  );
}
