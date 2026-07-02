"use client";

import { motion, useReducedMotion } from "framer-motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Stagger offset in seconds (use 0.06-0.12 steps between siblings). */
  delay?: number;
  /** `mount` animates immediately (heroes); `view` waits for viewport entry. */
  trigger?: "mount" | "view";
};

/**
 * Once-only entrance: fade + 20px rise on the enter curve. Below-the-fold
 * sections use the default `view` trigger so they reveal as they arrive;
 * above-the-fold hero content uses `mount`. Never replays on scroll-up.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  trigger = "view"
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const hidden = shouldReduceMotion ? false : { opacity: 0, y: 20 };
  const visible = shouldReduceMotion ? undefined : { opacity: 1, y: 0 };
  const transition = { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] as const };

  if (trigger === "mount") {
    return (
      <motion.div
        className={className}
        initial={hidden}
        animate={visible}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={hidden}
      whileInView={visible}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
