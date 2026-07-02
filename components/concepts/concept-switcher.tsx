"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils/cn";

const concepts = [
  { href: "/concepts/cinematic", label: "Cinematic", key: "A" },
  { href: "/concepts/mission-control", label: "Mission Control", key: "B" },
  { href: "/concepts/luxury", label: "Luxury", key: "C" }
];

/**
 * Review-only floating pill for flipping between the three design-concept
 * homepages and the live site. Not part of any concept's design language.
 */
export function ConceptSwitcher() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Design concept switcher"
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2"
    >
      <div className="flex items-center gap-1 rounded-full border border-white/15 bg-black/70 p-1 shadow-[0_12px_48px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        {concepts.map((concept) => {
          const isActive = pathname === concept.href;

          return (
            <Link
              key={concept.href}
              href={concept.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition duration-150 ease-standard",
                isActive
                  ? "bg-white text-black"
                  : "text-text-secondary hover:bg-white/10 hover:text-text-primary"
              )}
            >
              <span
                className={cn(
                  "font-mono text-[10px]",
                  isActive ? "text-black/60" : "text-text-muted"
                )}
              >
                {concept.key}
              </span>
              <span className="hidden sm:inline">{concept.label}</span>
            </Link>
          );
        })}
        <span className="mx-1 h-4 w-px bg-white/15" aria-hidden="true" />
        <Link
          href="/"
          className="rounded-full px-3 py-1.5 text-xs font-semibold text-text-muted transition duration-150 ease-standard hover:bg-white/10 hover:text-text-primary"
        >
          Live site
        </Link>
      </div>
    </nav>
  );
}
