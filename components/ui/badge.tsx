import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils/cn";

type BadgeProps = ComponentPropsWithoutRef<"span"> & {
  tone?: "default" | "accent" | "warning" | "success";
};

export function Badge({ className, tone = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]",
        tone === "default" &&
          "border-white/10 bg-white/[0.08] text-text-secondary",
        tone === "accent" &&
          "border-accent-secondary/30 bg-accent-secondary/10 text-accent-secondary",
        tone === "warning" &&
          "border-status-warning/40 bg-status-warning/10 text-status-warning",
        tone === "success" &&
          "border-status-success/40 bg-status-success/10 text-status-success",
        className
      )}
      {...props}
    />
  );
}
