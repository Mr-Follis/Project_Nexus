import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { MediaPanelAsset } from "@/components/media/media-panel";
import { MediaAttribution } from "@/components/media/media-attribution";
import { Reveal } from "@/components/motion/reveal";
import { resolveMediaAttribution } from "@/lib/validation/media";
import { cn } from "@/lib/utils/cn";

/**
 * A single typographic statement given room to breathe. The primary building
 * block of Concept C — where other concepts use panels, this uses sentences.
 */
export function Statement({
  eyebrow,
  title,
  dimmed,
  body,
  className,
  children
}: {
  eyebrow?: string;
  title: string;
  /** Optional second line rendered in muted color — Apple's color-in-type. */
  dimmed?: string;
  body?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <Reveal className={cn("mx-auto w-full max-w-4xl px-6", className)}>
      {eyebrow ? (
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-text-muted">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-5 font-display text-4xl font-bold leading-[1.02] tracking-tight text-text-primary sm:text-6xl">
        {title}
        {dimmed ? (
          <span className="block text-text-muted">{dimmed}</span>
        ) : null}
      </h2>
      {body ? (
        <p className="mt-6 max-w-xl text-pretty text-base leading-7 text-text-secondary sm:text-lg sm:leading-8">
          {body}
        </p>
      ) : null}
      {children}
    </Reveal>
  );
}

/**
 * The concept's single image: official media presented as a framed object
 * floating in space, attribution set quietly beneath it.
 */
export function FramedMedia({ asset }: { asset?: MediaPanelAsset }) {
  const imageUrl = asset ? (asset.filePath ?? asset.externalUrl) : null;

  if (!asset || !imageUrl) {
    return null;
  }

  return (
    <Reveal className="mx-auto w-full max-w-5xl px-6">
      <figure>
        <div className="overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.5)]">
          <div
            role="img"
            aria-label={asset.altText ?? asset.title}
            className="aspect-[16/9] bg-cover bg-center"
            style={{ backgroundImage: `url('${imageUrl}')` }}
          />
        </div>
        <figcaption className="mt-3 flex justify-end">
          <MediaAttribution
            attribution={resolveMediaAttribution(asset)}
            provenance={asset.provenance}
            className="text-[10px] leading-tight"
          />
        </figcaption>
      </figure>
    </Reveal>
  );
}

/**
 * Index row: a category rendered as typography — name, live count, arrow.
 * The anti-card.
 */
export function IndexRow({
  label,
  count,
  href
}: {
  label: string;
  count?: number;
  href: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="group flex items-baseline gap-4 border-t border-white/10 py-6 transition duration-150 ease-standard hover:bg-white/[0.02] sm:py-8"
      >
        <span className="font-display text-2xl font-bold tracking-tight text-text-primary transition duration-200 ease-standard group-hover:translate-x-2 sm:text-4xl">
          {label}
        </span>
        {typeof count === "number" ? (
          <span className="text-sm tabular-nums text-text-muted">
            {count} {count === 1 ? "record" : "records"}
          </span>
        ) : null}
        <ArrowRight
          className="ml-auto h-5 w-5 shrink-0 self-center text-text-muted transition duration-200 ease-standard group-hover:-translate-x-1 group-hover:text-text-primary"
          aria-hidden="true"
        />
      </Link>
    </li>
  );
}
