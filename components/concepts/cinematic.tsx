import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";

import type { HeroMedia } from "@/components/media/hero-backdrop";
import type { MediaPanelAsset } from "@/components/media/media-panel";
import { MediaAttribution } from "@/components/media/media-attribution";
import { Reveal } from "@/components/motion/reveal";
import { resolveMediaAttribution } from "@/lib/validation/media";
import { cn } from "@/lib/utils/cn";

/**
 * Concept A hero: the world at full bleed, the title lockup pushed hard to
 * the bottom-left, metadata to the bottom-right — an editorial cover, not a
 * centered landing hero.
 */
export function CinematicHero({
  media,
  recordCount,
  daysToLaunch
}: {
  media: HeroMedia;
  recordCount: number | null;
  daysToLaunch: number;
}) {
  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <div
        role="img"
        aria-label={media.altText}
        className="hero-zoom absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${media.imageUrl}')` }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,15,0.55)_0%,rgba(8,10,15,0.15)_35%,rgba(8,10,15,0.92)_100%)]" />
      <div
        className="grain-overlay absolute inset-0 opacity-[0.06]"
        aria-hidden="true"
      />

      <div className="absolute left-5 top-1/2 hidden -translate-y-1/2 lg:block">
        <p className="rotate-180 text-[11px] font-medium uppercase tracking-[0.4em] text-white/40 [writing-mode:vertical-rl]">
          Unofficial GTA VI archive — every record sourced
        </p>
      </div>

      <Reveal
        trigger="mount"
        className="absolute inset-x-0 bottom-0 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-16 sm:px-10"
      >
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-accent-secondary">
              Project Nexus presents
            </p>
            <h1 className="mt-4 font-display text-[17vw] font-bold leading-[0.82] tracking-tight text-white sm:text-8xl lg:text-[9.5rem]">
              Vice City,
              <span className="text-display-gradient block pl-[8vw] sm:pl-24">
                decoded.
              </span>
            </h1>
            <p className="mt-8 max-w-md text-pretty text-base leading-7 text-white/70">
              The verified archive of Leonida. Characters, places, machines —
              nothing published without an official source.
            </p>
          </div>

          <div className="shrink-0 border-l border-white/20 pl-6 text-sm leading-7 text-white/60 lg:pb-2 lg:text-right lg:border-l-0 lg:border-r lg:pl-0 lg:pr-6">
            {recordCount !== null ? (
              <p>
                <span className="font-mono text-white">{recordCount}</span>{" "}
                verified records
              </p>
            ) : null}
            <p>
              <span className="font-mono text-white">{daysToLaunch}</span> days
              to launch
            </p>
            <p>Nov 19, 2026 — PS5 · Xbox Series X|S</p>
          </div>
        </div>

        <div className="mt-14 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/40">
          <ArrowDown className="h-4 w-4" aria-hidden="true" />
          Scroll the story
        </div>
      </Reveal>

      {media.attribution || media.provenance ? (
        <div className="absolute right-4 top-4 z-10 max-w-[80%] rounded-full border border-white/10 bg-black/45 px-3 py-1 backdrop-blur">
          <MediaAttribution
            attribution={media.attribution}
            provenance={media.provenance}
            className="text-[11px] leading-tight"
          />
        </div>
      ) : null}
    </section>
  );
}

/**
 * Numbered editorial chapter: ghost index numeral, offset heading, and an
 * image that bleeds to the viewport edge — alternating sides per chapter.
 */
export function EditorialChapter({
  index,
  kicker,
  title,
  body,
  href,
  linkLabel,
  media,
  align = "right"
}: {
  index: string;
  kicker: string;
  title: string;
  body: string;
  href: string;
  linkLabel: string;
  media?: MediaPanelAsset;
  align?: "left" | "right";
}) {
  const imageUrl = media ? (media.filePath ?? media.externalUrl) : null;

  return (
    <section className="relative mx-auto max-w-7xl px-5 sm:px-10">
      <div
        className={cn(
          "grid items-center gap-10 lg:grid-cols-12",
          align === "left" && "lg:[direction:rtl]"
        )}
      >
        <Reveal className="relative lg:col-span-5 lg:[direction:ltr]">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-0 select-none font-display text-[11rem] font-bold leading-none text-white/[0.045]"
          >
            {index}
          </span>
          <p className="relative font-mono text-xs uppercase tracking-[0.35em] text-accent-secondary">
            {kicker}
          </p>
          <h2 className="relative mt-4 font-display text-4xl font-bold leading-[1.02] tracking-tight text-text-primary sm:text-6xl">
            {title}
          </h2>
          <p className="relative mt-6 max-w-md text-pretty text-base leading-7 text-text-secondary">
            {body}
          </p>
          <Link
            href={href}
            className="group relative mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-text-primary transition hover:text-accent-secondary"
          >
            {linkLabel}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 ease-standard group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </Reveal>

        {imageUrl && media ? (
          <Reveal delay={0.1} className="lg:col-span-7 lg:[direction:ltr]">
            <figure
              className={cn(
                "relative overflow-hidden",
                align === "right"
                  ? "lg:-mr-10 lg:rounded-l-2xl"
                  : "lg:-ml-10 lg:rounded-r-2xl",
                "rounded-2xl lg:rounded-2xl"
              )}
            >
              <div
                role="img"
                aria-label={media.altText ?? media.title}
                className="aspect-[16/10] bg-cover bg-center"
                style={{ backgroundImage: `url('${imageUrl}')` }}
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(8,10,15,0.85)_100%)]" />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
                <p className="text-sm font-semibold text-white">
                  {media.title}
                </p>
                <MediaAttribution
                  attribution={resolveMediaAttribution(media)}
                  provenance={media.provenance}
                  className="justify-end text-right text-[10px] leading-tight"
                />
              </figcaption>
            </figure>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}

/**
 * Full-width closing spread: one image, one declarative line, one action.
 */
export function FeaturedDiscovery({
  media,
  title,
  body,
  href,
  linkLabel
}: {
  media?: MediaPanelAsset;
  title: string;
  body: string;
  href: string;
  linkLabel: string;
}) {
  const imageUrl = media ? (media.filePath ?? media.externalUrl) : null;

  return (
    <section className="relative overflow-hidden">
      {imageUrl && media ? (
        <>
          <div
            role="img"
            aria-label={media.altText ?? media.title}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${imageUrl}')` }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,10,15,0.94)_0%,rgba(8,10,15,0.72)_45%,rgba(8,10,15,0.3)_100%)]" />
          <div
            className="grain-overlay absolute inset-0 opacity-[0.05]"
            aria-hidden="true"
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-bg-surface" />
      )}

      <Reveal className="relative mx-auto flex min-h-[70svh] max-w-7xl flex-col justify-center px-5 py-24 sm:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-accent-secondary">
          Featured discovery
        </p>
        <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-[1.0] tracking-tight text-white sm:text-7xl">
          {title}
        </h2>
        <p className="mt-6 max-w-lg text-pretty text-base leading-7 text-white/70">
          {body}
        </p>
        <Link
          href={href}
          className="group mt-10 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:text-accent-secondary"
        >
          {linkLabel}
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 ease-standard group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
        {media ? (
          <div className="absolute bottom-4 right-4 max-w-[70%] rounded-full border border-white/10 bg-black/45 px-3 py-1 backdrop-blur">
            <MediaAttribution
              attribution={resolveMediaAttribution(media)}
              provenance={media.provenance}
              className="text-[10px] leading-tight"
            />
          </div>
        ) : null}
      </Reveal>
    </section>
  );
}
