import { MediaAttribution } from "@/components/media/media-attribution";
import { Card } from "@/components/ui/card";
import { resolveMediaAttribution } from "@/lib/validation/media";

export type GalleryAsset = {
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
 * Published media for one knowledge entity. Every asset renders with its
 * provenance label and required attribution, mirroring the hero treatment.
 */
export function EntityMediaGallery({ assets }: { assets: GalleryAsset[] }) {
  const renderable = assets.filter(
    (asset) => asset.filePath || asset.externalUrl
  );

  if (renderable.length === 0) {
    return null;
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold text-text-primary">Media</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {renderable.map((asset) => {
          const imageUrl = asset.filePath ?? asset.externalUrl ?? "";

          return (
            <figure
              key={asset.id}
              className="overflow-hidden rounded-nexus border border-white/10 bg-white/[0.03]"
            >
              <div
                role="img"
                aria-label={asset.altText ?? asset.title}
                className="aspect-video bg-cover bg-center"
                style={{ backgroundImage: `url('${imageUrl}')` }}
              />
              <figcaption className="space-y-1 p-3">
                <p className="text-sm font-medium text-text-primary">
                  {asset.title}
                </p>
                {asset.caption ? (
                  <p className="text-xs leading-5 text-text-secondary">
                    {asset.caption}
                  </p>
                ) : null}
                <MediaAttribution
                  attribution={resolveMediaAttribution(asset)}
                  provenance={asset.provenance}
                  className="text-[11px]"
                />
              </figcaption>
            </figure>
          );
        })}
      </div>
    </Card>
  );
}
