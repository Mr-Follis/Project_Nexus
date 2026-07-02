"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { MainNav } from "@/components/layout/main-nav";
import { cn } from "@/lib/utils/cn";

/**
 * Fixed glass header that strengthens once content scrolls underneath it:
 * near-transparent over the hero, deeper blur + hairline + backdrop after
 * 24px. Scroll state is read through a passive listener with an rAF guard.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      setScrolled(window.scrollY > 24);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ease-standard",
        scrolled
          ? "border-white/10 bg-bg-base/85 backdrop-blur-xl"
          : "border-transparent bg-bg-base/30 backdrop-blur-md"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
          aria-label="Project Nexus home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-nexus border border-white/10 bg-gradient-to-br from-accent-primary/30 to-accent-secondary/20 text-sm font-bold tracking-tight shadow-glow">
            NX
          </span>
          <span className="flex flex-col leading-none md:flex">
            <span className="font-display text-sm font-bold uppercase tracking-[0.18em] text-text-primary">
              Nexus
            </span>
            <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-text-muted">
              Unofficial companion
            </span>
          </span>
        </Link>
        <div className="hidden min-w-0 md:block">
          <MainNav />
        </div>
      </div>
      <div
        className={cn(
          "h-px bg-gradient-to-r from-transparent via-accent-secondary/40 to-transparent transition-opacity duration-300",
          scrolled ? "opacity-100" : "opacity-0"
        )}
      />
    </header>
  );
}
