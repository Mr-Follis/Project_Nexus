import Link from "next/link";

import { Disclaimer } from "@/components/layout/disclaimer";
import { Badge } from "@/components/ui/badge";

const footerColumns = [
  {
    heading: "Explore",
    links: [
      { href: "/gta-6", label: "GTA VI hub" },
      { href: "/gta-6/characters", label: "Characters" },
      { href: "/gta-6/regions", label: "Places & Regions" },
      { href: "/gta-6/vehicles", label: "Vehicles" },
      { href: "/gta-6/shops", label: "Shops & Services" },
      { href: "/gta-6/map", label: "Map" }
    ]
  },
  {
    heading: "Community",
    links: [
      { href: "/gta-6/search", label: "Search the database" },
      { href: "/gta-6/submit", label: "Submit evidence" },
      { href: "/gta-6/ask", label: "Ask Nexus" },
      { href: "/admin", label: "Moderation" }
    ]
  }
];

/**
 * Site footer and the single home of the legal/attribution note. Pages must
 * not render their own Disclaimer copies.
 */
export function LegalFooter() {
  return (
    <footer className="border-t border-white/10 bg-bg-surface/40 pb-20 md:pb-0">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-nexus border border-white/10 bg-gradient-to-br from-accent-primary/30 to-accent-secondary/20 text-sm font-bold shadow-glow">
                NX
              </span>
              <span className="font-display text-sm font-bold uppercase tracking-[0.18em] text-text-primary">
                Project Nexus
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-6 text-text-secondary">
              A structured, verified game-knowledge platform. Every published
              fact carries its source, verification status, and history.
            </p>
            <Badge className="mt-5">Unofficial fan project</Badge>
          </div>

          {footerColumns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                {column.heading}
              </p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary transition hover:text-text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <Disclaimer compact />
        </div>
      </div>
    </footer>
  );
}
