import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils/cn";

export function Card({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "relative rounded-nexus border border-white/10 bg-gradient-to-b from-bg-elevated/70 to-bg-surface/88 p-5 shadow-[0_18px_80px_rgba(0,0,0,0.34)] ring-1 ring-white/[0.03] backdrop-blur before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/15 before:to-transparent sm:p-6",
        className
      )}
      {...props}
    />
  );
}
