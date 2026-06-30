import Link from "next/link";

import { MainNav } from "@/components/layout/main-nav";
import { Disclaimer } from "@/components/layout/disclaimer";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <div className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-bg-base/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="Project Nexus home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-nexus border border-white/10 bg-bg-elevated text-sm font-semibold shadow-glow">
              NX
            </span>
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-text-primary">
              Nexus
            </span>
          </Link>
          <MainNav />
        </div>
      </div>

      <main className="mx-auto min-h-screen w-full max-w-6xl px-4 pb-12 pt-24 sm:px-6">
        {children}
      </main>

      <footer className="border-t border-white/10 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Disclaimer compact />
        </div>
      </footer>
    </div>
  );
}
