import { HeroBackdrop, type HeroMedia } from "@/components/media/hero-backdrop";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils/cn";

type HeroShellProps = {
  media: HeroMedia;
  size?: "tall" | "standard";
  children: React.ReactNode;
  className?: string;
};

/**
 * Full-bleed cinematic hero: media-library backdrop with scrims and the
 * attribution chip, content bottom-anchored in the site column, entrance
 * motion via Reveal. `tall` for landing pages, `standard` for hub pages.
 */
export function HeroShell({
  media,
  size = "standard",
  children,
  className
}: HeroShellProps) {
  const minHeight =
    size === "tall"
      ? "min-h-[82svh] sm:min-h-[calc(100vh-8rem)]"
      : "min-h-[62svh] sm:min-h-[620px]";

  return (
    <section
      className={cn(
        "relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-b border-white/10",
        minHeight,
        className
      )}
    >
      <HeroBackdrop media={media} />
      <Reveal
        trigger="mount"
        className={cn(
          "relative mx-auto flex max-w-6xl flex-col justify-end px-4 pb-10 pt-24 sm:px-6 sm:pb-14",
          minHeight
        )}
      >
        {children}
      </Reveal>
    </section>
  );
}
