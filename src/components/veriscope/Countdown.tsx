import { useEffect, useState } from "react";
import { LAUNCH_DURATION_MS } from "@/lib/veriscope";

const DEADLINE_KEY = "veriscope_launch_deadline";

/** Deadline for this visit: kept in sessionStorage so a refresh does not reset it. */
function visitDeadline(): number {
  const fresh = Date.now() + LAUNCH_DURATION_MS;
  try {
    const stored = Number(window.sessionStorage.getItem(DEADLINE_KEY));
    if (Number.isFinite(stored) && stored > Date.now()) return stored;
    window.sessionStorage.setItem(DEADLINE_KEY, String(fresh));
  } catch {
    /* storage unavailable — countdown simply restarts */
  }
  return fresh;
}

type Remaining = { days: number; hours: number; minutes: number; seconds: number; over: boolean };

function remainingFrom(target: number, now: number): Remaining {
  const diff = Math.max(0, target - now);
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    over: diff <= 0,
  };
}

/** Live countdown to LAUNCH_END_DATE. Returns null until hydrated (no SSR mismatch). */
export function useLaunchWindow() {
  const target = new Date(LAUNCH_END_DATE).getTime();
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    const tick = () => setRemaining(remainingFrom(target, Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  return remaining;
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-2">
      <span className="font-mono text-3xl tabular-nums sm:text-5xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[0.5625rem] tracking-[0.2em] text-muted-foreground uppercase sm:text-[0.625rem]">
        {label}
      </span>
    </div>
  );
}

export function Countdown({ remaining }: { remaining: Remaining | null }) {
  const over = remaining?.over ?? false;

  return (
    <div className="panel mx-auto w-full max-w-xl px-4 py-6 sm:px-8 sm:py-7">
      <p className="text-center text-[0.625rem] tracking-[0.22em] text-gold uppercase sm:text-[0.6875rem]">
        {over ? "Lançamento a decorrer" : "Lançamento"}
      </p>

      <div className="mt-5 flex items-start justify-center gap-1 sm:gap-3">
        {remaining && !over ? (
          <>
            <Unit value={remaining.days} label="Dias" />
            <span className="font-mono text-2xl text-border sm:text-4xl">:</span>
            <Unit value={remaining.hours} label="Horas" />
            <span className="font-mono text-2xl text-border sm:text-4xl">:</span>
            <Unit value={remaining.minutes} label="Min" />
            <span className="font-mono text-2xl text-border sm:text-4xl">:</span>
            <Unit value={remaining.seconds} label="Seg" />
          </>
        ) : (
          <p className="py-2 text-center text-sm text-muted-foreground">
            {over
              ? "A janela de lançamento terminou. Os produtos continuam disponíveis."
              : "A carregar o contador…"}
          </p>
        )}
      </div>
    </div>
  );
}
