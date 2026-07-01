import { MediaAttribution } from "@/components/media/media-attribution";

export type HeroMedia = {
  imageUrl: string;
  altText: string;
  attribution?: string | null;
  provenance?: string | null;
};

/**
 * Full-bleed cinematic backdrop for a media asset, with layered gradients for
 * legible foreground text and a corner attribution chip. The image is a plain
 * CSS background so it can be swapped for official or original media purely by
 * changing the asset the caller resolves.
 */
export function HeroBackdrop({ media }: { media: HeroMedia }) {
  return (
    <>
      <div
        role="img"
        aria-label={media.altText}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${media.imageUrl}')` }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,10,15,0.96)_0%,rgba(8,10,15,0.82)_38%,rgba(8,10,15,0.22)_100%),linear-gradient(180deg,rgba(8,10,15,0.2)_0%,rgba(8,10,15,0.82)_100%)]" />
      {media.attribution || media.provenance ? (
        <div className="absolute bottom-3 right-3 z-10 max-w-[90%] rounded-full border border-white/10 bg-black/45 px-3 py-1 backdrop-blur">
          <MediaAttribution
            attribution={media.attribution}
            provenance={media.provenance}
            className="text-[11px] leading-tight"
          />
        </div>
      ) : null}
    </>
  );
}
