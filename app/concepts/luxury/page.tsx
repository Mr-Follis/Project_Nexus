import type { Metadata } from "next";
import Link from "next/link";

import { FramedMedia, IndexRow, Statement } from "@/components/concepts/luxury";
import { Reveal } from "@/components/motion/reveal";
import { getConceptData } from "@/lib/concepts/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Concept C — Luxury"
};

/**
 * Concept C: elegant restraint. Near-monochrome, one framed image, no cards —
 * typography, whitespace, and hairlines carry the entire identity.
 */
export default async function LuxuryConceptPage() {
  const { stats, media } = await getConceptData();
  const keyArt =
    media.find((asset) => asset.filePath && asset.title.match(/key art/i)) ??
    media[0];

  const indexRows = [
    {
      label: "Characters",
      count: stats?.entityCounts.character,
      href: "/gta-6/characters"
    },
    {
      label: "Places",
      count: stats?.entityCounts.region,
      href: "/gta-6/regions"
    },
    {
      label: "Vehicles",
      count: stats?.entityCounts.vehicle,
      href: "/gta-6/vehicles"
    },
    { label: "Shops", count: stats?.entityCounts.shop, href: "/gta-6/shops" }
  ];

  return (
    <div className="bg-bg-base pb-36">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-8">
        <Link
          href="/concepts/luxury"
          className="font-display text-lg font-bold tracking-tight text-text-primary"
        >
          Nexus.
        </Link>
        <nav className="flex items-center gap-6 text-sm text-text-secondary">
          <Link href="/gta-6" className="transition hover:text-text-primary">
            Archive
          </Link>
          <Link
            href="/gta-6/submit"
            className="transition hover:text-text-primary"
          >
            Submit
          </Link>
        </nav>
      </header>

      <main className="space-y-36 sm:space-y-48">
        <section className="pt-[16vh]">
          <Reveal trigger="mount" className="mx-auto w-full max-w-4xl px-6">
            <h1 className="font-display text-6xl font-bold leading-[0.95] tracking-tight text-text-primary sm:text-8xl lg:text-9xl">
              Every fact.
              <span className="block text-text-muted">Verified.</span>
            </h1>
            <p className="mt-8 max-w-md text-pretty text-base leading-7 text-text-secondary sm:text-lg sm:leading-8">
              The GTA VI knowledge archive where nothing is published without an
              official source.
            </p>
            <Link
              href="/gta-6"
              className="group mt-10 inline-flex items-center gap-2 text-sm font-semibold text-text-primary transition hover:text-accent-secondary"
            >
              Enter the archive
              <span
                className="transition-transform duration-200 ease-standard group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </Link>
          </Reveal>
        </section>

        {stats ? (
          <Reveal className="mx-auto w-full max-w-4xl px-6">
            <dl className="flex flex-wrap gap-x-14 gap-y-8">
              {[
                { value: stats.totalEntities, label: "Verified records" },
                { value: stats.officialSourceCount, label: "Official sources" },
                { value: 0, label: "Instances of speculation" }
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="order-2 mt-2 text-xs font-medium uppercase tracking-[0.25em] text-text-muted">
                    {stat.label}
                  </dt>
                  <dd className="order-1 font-display text-5xl font-bold tabular-nums tracking-tight text-text-primary sm:text-6xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        ) : null}

        <FramedMedia asset={keyArt} />

        <Statement
          eyebrow="The principle"
          title="Entered once."
          dimmed="Trusted everywhere."
          body="Pages, galleries, search, and maps all read from the same verified records. Empty fields stay empty until sourced data passes review — nothing is generated to fill space."
        />

        <section className="mx-auto w-full max-w-4xl px-6">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-text-muted">
              The index
            </p>
            <ul className="mt-8 border-b border-white/10">
              {indexRows.map((row) => (
                <IndexRow
                  key={row.label}
                  label={row.label}
                  count={row.count}
                  href={row.href}
                />
              ))}
            </ul>
          </Reveal>
        </section>

        <Statement
          eyebrow="Built in the open"
          title="Seen something official?"
          body="Submissions pass through moderation before the archive changes. Every record keeps its history."
        >
          <Link
            href="/gta-6/submit"
            className="mt-10 inline-flex h-12 items-center justify-center rounded-full bg-text-primary px-8 text-sm font-semibold text-bg-base transition duration-150 ease-standard hover:bg-white active:scale-[0.98]"
          >
            Submit evidence
          </Link>
          <p className="mt-16 text-xs leading-5 text-text-muted">
            Unofficial fan project. Not affiliated with Rockstar Games or
            Take-Two Interactive.
          </p>
        </Statement>
      </main>
    </div>
  );
}
