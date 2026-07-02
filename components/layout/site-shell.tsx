import Link from "next/link";

import { MainNav } from "@/components/layout/main-nav";
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

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(180deg,rgba(54,209,220,0.08),transparent_18rem),linear-gradient(120deg,rgba(245,184,75,0.08),transparent_28rem)]" />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-bg-base/78 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3"
            aria-label="Project Nexus home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-nexus border border-white/10 bg-gradient-to-br from-accent-primary/30 to-accent-secondary/20 text-sm font-bold tracking-tight shadow-glow">
              NX
            </span>
            <span className="hidden flex-col leading-none md:flex">
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-text-primary">
                Nexus
              </span>
              <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-text-muted">
                Unofficial companion
              </span>
            </span>
          </Link>
          <MainNav />
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-accent-secondary/40 to-transparent" />
      </header>

      <main className="mx-auto min-h-screen w-full max-w-6xl px-4 pb-16 pt-24 sm:px-6">
        {children}
      </main>

      <footer className="border-t border-white/10 bg-bg-surface/40">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-nexus border border-white/10 bg-gradient-to-br from-accent-primary/30 to-accent-secondary/20 text-sm font-bold shadow-glow">
                  NX
                </span>
                <span className="text-sm font-bold uppercase tracking-[0.18em] text-text-primary">
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
    </div>
  );
}
