import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils/cn";

export function Card({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "relative rounded-nexus border border-white/10 bg-bg-surface p-5 shadow-[0_18px_80px_rgba(0,0,0,0.28)] sm:p-6",
        className
      )}
      {...props}
    />
  );
}
