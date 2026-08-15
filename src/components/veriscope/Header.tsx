import { DiamondMark } from "./Section";

export function Header({ live }: { live: boolean }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-center gap-3 px-5 py-5 sm:gap-4 sm:py-6">
        <div className="flex items-center gap-2.5">
          <DiamondMark className="h-4 w-4 text-gold" />
          <span className="font-display text-sm font-medium tracking-[0.34em] text-foreground">
            VERISCOPE
          </span>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-2.5 py-1 text-[0.625rem] tracking-[0.18em] text-gold uppercase sm:text-[0.6875rem]">
          <span
            className={`h-1.5 w-1.5 rounded-full ${live ? "animate-pulse bg-gold" : "bg-muted-foreground"}`}
          />
          {live ? "Em lançamento" : "Lançado"}
        </span>
      </div>
    </header>
  );
}
