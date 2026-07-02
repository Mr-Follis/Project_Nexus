import { MediaAttribution } from "@/components/media/media-attribution";
import { resolveMediaAttribution } from "@/lib/validation/media";
import { cn } from "@/lib/utils/cn";

export type MediaPanelAsset = {
  id: string;
  title: string;
  caption?: string | null;
  altText?: string | null;
  filePath?: string | null;
  externalUrl?: string | null;
  provenance: string;
  attributionRequired: boolean;
  attributionText?: string | null;
  copyrightOwner?: string | null;
  sourceName?: string | null;
};

/**
 * Cinematic image panel for showcase sections. Renders a media-library asset
 * with a hover zoom, gradient scrim, and the mandatory attribution line —
 * swap the underlying asset and the panel follows.
 */
export function MediaPanel({
  asset,
  className
}: {
  asset: MediaPanelAsset;
  className?: string;
}) {
  const imageUrl = asset.filePath ?? asset.externalUrl;

  if (!imageUrl) {
    return null;
  }

  return (
    <figure
      className={cn(
        "group relative overflow-hidden rounded-nexus border border-white/10 bg-bg-surface shadow-[0_18px_80px_rgba(0,0,0,0.34)]",
        className
      )}
    >
      <div
        role="img"
        aria-label={asset.altText ?? asset.title}
        className="aspect-[16/10] bg-cover bg-center transition duration-500 ease-standard group-hover:scale-[1.04]"
        style={{ backgroundImage: `url('${imageUrl}')` }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(8,10,15,0.9)_100%)]" />
      <figcaption className="absolute inset-x-0 bottom-0 p-4">
        <p className="text-sm font-semibold text-text-primary">{asset.title}</p>
        {asset.caption ? (
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-text-secondary">
            {asset.caption}
          </p>
        ) : null}
        <MediaAttribution
          attribution={resolveMediaAttribution(asset)}
          provenance={asset.provenance}
          className="mt-2 text-[10px] opacity-80"
        />
      </figcaption>
    </figure>
  );
}
