import Link from "next/link";

import { LegalFooter } from "@/components/layout/legal-footer";
import { MainNav } from "@/components/layout/main-nav";
import { MobileNav } from "@/components/layout/mobile-nav";

/**
 * The application frame: fixed glass header with the desktop pill nav, a
 * bottom tab bar on phones, ambient background glows, and the LegalFooter.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(60rem_32rem_at_85%_-8rem,rgba(124,92,255,0.12),transparent),radial-gradient(50rem_28rem_at_-10%_-6rem,rgba(54,209,220,0.1),transparent),linear-gradient(180deg,rgba(54,209,220,0.05),transparent_18rem)]" />

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
        <div className="h-px bg-gradient-to-r from-transparent via-accent-secondary/40 to-transparent" />
      </header>

      <main className="mx-auto min-h-screen w-full max-w-6xl px-4 pb-28 pt-24 sm:px-6 md:pb-16">
        {children}
      </main>

      <LegalFooter />
      <MobileNav />
    </div>
  );
}
