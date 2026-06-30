import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

import { Card } from "@/components/ui/card";

type Module = {
  title: string;
  href: string;
  description: string;
  icon: LucideIcon;
};

export function ModuleGrid({ modules }: { modules: Module[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {modules.map((module) => {
        const Icon = module.icon;

        return (
          <Link key={module.href} href={module.href} className="group block">
            <Card className="h-full overflow-hidden transition duration-200 ease-standard group-hover:-translate-y-1 group-hover:border-accent-secondary/50">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent-secondary/80 via-status-warning/70 to-accent-primary/70" />
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-nexus bg-white/[0.08]">
                  <Icon
                    className="h-5 w-5 text-accent-secondary"
                    aria-hidden="true"
                  />
                </div>
                <ArrowRight
                  className="h-5 w-5 text-text-muted transition group-hover:translate-x-1 group-hover:text-text-primary"
                  aria-hidden="true"
                />
              </div>
              <h2 className="mt-6 text-xl font-semibold text-text-primary">
                {module.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-text-secondary">
                {module.description}
              </p>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
