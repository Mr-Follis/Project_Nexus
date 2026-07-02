import type { ComponentPropsWithoutRef } from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils/cn";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  asChild?: boolean;
  variant?: "primary" | "secondary";
};

export function Button({
  asChild,
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-nexus px-4 text-sm font-semibold transition duration-150 ease-standard focus:outline-none focus:ring-2 focus:ring-accent-secondary/70 active:scale-[0.98]",
        variant === "primary" &&
          "bg-gradient-to-b from-accent-primary to-accent-primary/85 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_0_40px_rgb(var(--color-accent-primary)/0.18)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_0_48px_rgb(var(--color-accent-primary)/0.3)] hover:brightness-110",
        variant === "secondary" &&
          "border border-white/10 bg-white/[0.08] text-text-primary hover:bg-white/[0.12]",
        className
      )}
      type={asChild ? undefined : type}
      {...props}
    />
  );
}
