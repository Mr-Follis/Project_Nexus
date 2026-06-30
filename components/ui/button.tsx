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
          "bg-accent-primary text-white shadow-glow hover:bg-accent-primary/90",
        variant === "secondary" &&
          "border border-white/10 bg-white/[0.08] text-text-primary hover:bg-white/[0.12]",
        className
      )}
      type={asChild ? undefined : type}
      {...props}
    />
  );
}
