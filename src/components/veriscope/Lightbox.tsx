import { useCallback, useEffect, useState } from "react";

type LightboxImage = { src: string; alt: string; caption?: string };

const LightboxContextDefault: {
  open: (image: LightboxImage) => void;
} = { open: () => {} };

let openHandler: (image: LightboxImage) => void = LightboxContextDefault.open;

export function openLightbox(image: LightboxImage) {
  openHandler(image);
}

/** Full-screen viewer with pinch/scroll zoom, mounted once at page level. */
export function Lightbox() {
  const [image, setImage] = useState<LightboxImage | null>(null);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    openHandler = (next) => {
      setImage(next);
      setZoomed(false);
    };
    return () => {
      openHandler = LightboxContextDefault.open;
    };
  }, []);

  const close = useCallback(() => setImage(null), []);

  useEffect(() => {
    if (!image) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [image, close]);

  if (!image) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={image.alt}
      className="fixed inset-0 z-50 flex flex-col bg-background/97 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between px-5 py-3">
        <span className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
          {zoomed ? "Tap image to fit" : "Tap image to zoom"}
        </span>
        <button
          type="button"
          onClick={close}
          className="rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Close
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto overscroll-contain p-3">
        <div className={zoomed ? "min-w-max" : "flex h-full items-center justify-center"}>
          <img
            src={image.src}
            alt={image.alt}
            onClick={() => setZoomed((v) => !v)}
            className={
              zoomed
                ? "h-auto w-auto max-w-none cursor-zoom-out"
                : "max-h-full w-full cursor-zoom-in object-contain"
            }
            style={zoomed ? { width: "220vw" } : undefined}
          />
        </div>
      </div>

      {image.caption && (
        <p className="px-5 pb-5 text-center text-xs text-muted-foreground">{image.caption}</p>
      )}
    </div>
  );
}

export function ZoomableShot({
  src,
  alt,
  caption,
  className = "",
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => openLightbox({ src, alt, ...(caption ? { caption } : {}) })}
      className={`panel group block w-full cursor-zoom-in overflow-hidden text-left ${className}`}
      aria-label={`Open larger view — ${alt}`}
    >
      <img src={src} alt={alt} loading="lazy" className="h-auto w-full object-contain" />
    </button>
  );
}
