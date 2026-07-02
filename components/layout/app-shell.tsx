import { LegalFooter } from "@/components/layout/legal-footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SiteHeader } from "@/components/layout/site-header";

/**
 * The application frame: scroll-aware glass header with the desktop pill nav,
 * a bottom tab bar on phones, ambient background glows, and the LegalFooter.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(60rem_32rem_at_85%_-8rem,rgba(124,92,255,0.12),transparent),radial-gradient(50rem_28rem_at_-10%_-6rem,rgba(54,209,220,0.1),transparent),linear-gradient(180deg,rgba(54,209,220,0.05),transparent_18rem)]" />

      <SiteHeader />

      <main className="mx-auto min-h-screen w-full max-w-6xl px-4 pb-28 pt-24 sm:px-6 md:pb-16">
        {children}
      </main>

      <LegalFooter />
      <MobileNav />
    </div>
  );
}
