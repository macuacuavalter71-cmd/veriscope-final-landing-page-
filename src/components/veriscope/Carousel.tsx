import { useRef, useState } from "react";

import type { Screenshot } from "@/lib/veriscope";

/**
 * Premium screenshot carousel: swipe on mobile, arrows on desktop, slide dots.
 * When no verified screenshots exist yet, it renders reserved slots instead of
 * inventing imagery.
 */
export function Carousel({ slides, label }: { slides: Screenshot[]; label: string }) {
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);

  if (slides.length === 0) {
    return (
      <div className="panel flex aspect-[16/10] w-full flex-col items-center justify-center gap-2 p-6 text-center">
        <p className="eyebrow">{label}</p>
        <p className="text-xs text-muted-foreground">
          Espaço reservado para as screenshots reais do produto.
        </p>
      </div>
    );
  }

  const go = (next: number) => {
    const clamped = Math.max(0, Math.min(slides.length - 1, next));
    setIndex(clamped);
    const track = trackRef.current;
    if (track) {
      track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
    }
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={(e) => {
          const el = e.currentTarget;
          setIndex(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
        }}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-roledescription="carousel"
        aria-label={label}
      >
        {slides.map((slide) => (
          <figure key={slide.src} className="w-full shrink-0 snap-center px-0.5">
            <div className="panel overflow-hidden p-2">
              <img
                src={slide.src}
                alt={slide.alt}
                loading="lazy"
                className="w-full rounded-sm object-cover"
              />
            </div>
            <figcaption className="mt-3 text-center text-sm text-muted-foreground">
              {slide.caption}
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          aria-label="Slide anterior"
          className="hidden size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-gold/40 hover:text-gold disabled:opacity-30 sm:inline-flex"
        >
          ←
        </button>

        <div className="flex items-center gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => go(i)}
              aria-label={`Ir para o slide ${i + 1}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-gold" : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(index + 1)}
          disabled={index === slides.length - 1}
          aria-label="Próximo slide"
          className="hidden size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-gold/40 hover:text-gold disabled:opacity-30 sm:inline-flex"
        >
          →
        </button>
      </div>
    </div>
  );
}
