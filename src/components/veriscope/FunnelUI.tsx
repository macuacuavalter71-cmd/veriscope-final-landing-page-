import { AI_PROMPT_PACK, formatPrice } from "@/lib/veriscope";

/** Primary (accept) action of a post-purchase offer. */
export function AcceptButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-center text-xs font-medium tracking-[0.14em] text-primary-foreground uppercase transition-colors hover:bg-gold-light"
    >
      {children}
    </button>
  );
}

/** Refusal action — always visible, never hidden or disguised. */
export function DeclineButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-md border border-border px-5 py-3 text-center text-xs tracking-[0.14em] text-muted-foreground uppercase transition-colors hover:border-gold/40 hover:text-foreground"
    >
      {children}
    </button>
  );
}

/** Vertical flow diagram used by the positioning sections. */
export function FlowSteps({ steps }: { steps: string[] }) {
  return (
    <ol className="mt-6 space-y-2">
      {steps.map((step, i) => (
        <li key={step} className="flex flex-col items-center">
          <div className="panel w-full px-4 py-3 text-center text-sm text-foreground">{step}</div>
          {i < steps.length - 1 && <span className="py-1 text-xs text-gold">↓</span>}
        </li>
      ))}
    </ol>
  );
}

export function PriceLine({ from, to }: { from: number; to: number }) {
  return (
    <div className="flex items-baseline justify-center gap-3">
      <span className="text-base text-muted-foreground line-through">{formatPrice(from)}</span>
      <span className="font-display text-3xl text-gold">{formatPrice(to)}</span>
    </div>
  );
}

/**
 * AI Prompt Pack modal, shown only after Intelligence is accepted.
 * Complementary — Intelligence works without it.
 */
export function PromptPackModal({
  open,
  onAccept,
  onDecline,
}: {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
}) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Veriscope AI Prompt Pack"
      className="fixed inset-0 z-50 flex items-end justify-center bg-background/85 px-4 py-6 backdrop-blur-sm sm:items-center"
    >
      <div className="panel w-full max-w-md p-6 sm:p-7">
        <h2 className="font-display text-lg tracking-tight text-foreground">
          Quer completar o fluxo?
        </h2>
        <p className="mt-4 text-xs tracking-[0.18em] text-gold uppercase">{AI_PROMPT_PACK.name}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {AI_PROMPT_PACK.description}
        </p>

        <div className="hairline my-5" />
        <PriceLine from={AI_PROMPT_PACK.regularPrice} to={AI_PROMPT_PACK.offerPrice} />

        <div className="mt-6">
          <AcceptButton onClick={onAccept}>
            Adicionar AI Prompt Pack — {formatPrice(AI_PROMPT_PACK.offerPrice)}
          </AcceptButton>
          <DeclineButton onClick={onDecline}>Não, continuar sem o Prompt Pack</DeclineButton>
        </div>
      </div>
    </div>
  );
}
