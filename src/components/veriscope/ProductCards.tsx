import {
  BUNDLE_SAVING,
  EDGE_CATEGORIES,
  PRODUCTS,
  SEPARATE_TOTAL,
  formatPrice,
  type ProductId,
} from "@/lib/veriscope";
import { buy } from "@/lib/orders";
import { useReveal } from "@/hooks/use-reveal";

/** Writes the pending order (session_id + product) and hands off to Paymento. */
export function startCheckout(productId: ProductId) {
  void buy(productId as "edge" | "prime" | "bundle");
}


function BuyButton({
  productId,
  children,
  variant = "solid",
}: {
  productId: ProductId;
  children: React.ReactNode;
  variant?: "solid" | "outline";
}) {
  const base =
    "inline-flex w-full items-center justify-center rounded-md px-5 py-3 text-xs font-medium tracking-[0.14em] uppercase transition-colors min-h-11";
  const styles =
    variant === "solid"
      ? "bg-primary text-primary-foreground hover:bg-gold-light"
      : "border border-border text-foreground hover:border-gold/50 hover:text-gold";

  return (
    <button type="button" onClick={() => startCheckout(productId)} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}

function LinkButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-border px-5 py-3 text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase transition-colors hover:border-gold/40 hover:text-foreground"
    >
      {children}
    </a>
  );
}

function EdgeCard() {
  const p = PRODUCTS.edge;
  return (
    <article className="panel flex flex-col p-6 sm:p-7">
      <h3 className="font-display text-sm tracking-[0.2em] text-foreground uppercase">{p.name}</h3>
      <p className="mt-3 text-base font-medium text-pretty">{p.tagline}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.description}</p>

      <span className="mt-5 inline-flex w-fit items-center rounded-full border border-border px-2.5 py-1 font-mono text-[0.625rem] tracking-[0.18em] text-muted-foreground uppercase">
        19 abas
      </span>

      <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
        {EDGE_CATEGORIES.map((c) => (
          <li key={c} className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-gold/60" />
            {c}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-baseline gap-2">
        <span className="font-mono text-3xl">{formatPrice(p.price)}</span>
        <span className="text-xs text-muted-foreground">USD · pagamento único</span>
      </div>

      <div className="mt-6 flex flex-col gap-2.5">
        <LinkButton href="/edge">Conhecer o Edge</LinkButton>
        <BuyButton productId="edge" variant="outline">
          Obter o Edge — {formatPrice(p.price)}
        </BuyButton>
      </div>
    </article>
  );
}

function BundleCard() {
  const p = PRODUCTS.bundle;
  return (
    <article className="panel relative flex flex-col border-gold/35 bg-surface-raised p-6 sm:p-8">
      <span className="absolute -top-3 left-6 inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-background px-3 py-1 text-[0.625rem] tracking-[0.18em] text-gold uppercase">
        ★ Mais escolhido
      </span>

      <h3 className="font-display text-sm tracking-[0.2em] text-gold uppercase">{p.name}</h3>
      <p className="mt-3 text-lg font-medium text-pretty">{p.tagline}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.description}</p>

      <div className="mt-5 flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.18em] text-muted-foreground uppercase">
        <span className="rounded border border-border px-2 py-1 text-foreground">Prime</span>
        <span className="text-gold">+</span>
        <span className="rounded border border-border px-2 py-1 text-foreground">Edge</span>
      </div>

      <div className="mt-6 flex items-baseline gap-2">
        <span className="font-mono text-4xl text-gold">{formatPrice(p.price)}</span>
        <span className="text-xs text-muted-foreground">USD · pagamento único</span>
      </div>

      <dl className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Separados</dt>
          <dd className="font-mono text-muted-foreground line-through">
            {formatPrice(SEPARATE_TOTAL)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Juntos</dt>
          <dd className="font-mono text-foreground">{formatPrice(p.price)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-success">Poupe</dt>
          <dd className="font-mono text-success">{formatPrice(BUNDLE_SAVING)}</dd>
        </div>
      </dl>

      <div className="mt-6">
        <BuyButton productId="bundle">Obter Prime + Edge</BuyButton>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Acesso após confirmação do pagamento.
        </p>
      </div>
    </article>
  );
}

function PrimeCard() {
  const p = PRODUCTS.prime;
  return (
    <article className="panel flex flex-col p-6 sm:p-7">
      <h3 className="font-display text-sm tracking-[0.2em] text-foreground uppercase">{p.name}</h3>
      <p className="mt-3 text-base font-medium text-pretty">{p.tagline}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.description}</p>

      <ul className="mt-5 space-y-1.5 text-sm text-muted-foreground">
        {[
          "Estrutura de mercado (BOS / CHoCH) em múltiplos períodos",
          "Liquidez, sweeps, EQH / EQL",
          "Order Blocks com qualidade e estado",
          "Fair Value Gaps e BPR com ciclo de vida",
          "Zonas premium / desconto",
          "Dashboard e alertas consolidados",
        ].map((f) => (
          <li key={f} className="flex gap-2">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold/60" />
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-baseline gap-2">
        <span className="font-mono text-3xl">{formatPrice(p.price)}</span>
        <span className="text-xs text-muted-foreground">USD · pagamento único</span>
      </div>

      <div className="mt-6 flex flex-col gap-2.5">
        <LinkButton href="/prime">Conhecer o Prime</LinkButton>
        <BuyButton productId="prime" variant="outline">
          Obter Prime — {formatPrice(p.price)}
        </BuyButton>
      </div>
    </article>
  );
}

export function ProductCards() {
  const reveal = useReveal<HTMLDivElement>();

  return (
    <section id="produtos" className="scroll-mt-24 px-5 py-16 sm:px-6 sm:py-24">
      <div ref={reveal.ref} className={`mx-auto w-full max-w-5xl ${reveal.className}`}>
        <h2 className="text-center font-display text-xs tracking-[0.24em] text-muted-foreground uppercase sm:text-sm">
          Três formas de entrar no Veriscope
        </h2>
        <div className="hairline mx-auto mt-6 max-w-sm" />

        <div className="mt-10 grid gap-5 lg:grid-cols-3 lg:items-start lg:gap-6">
          <div className="lg:order-1">
            <EdgeCard />
          </div>
          <div className="lg:order-2 lg:-mt-3">
            <BundleCard />
          </div>
          <div className="lg:order-3">
            <PrimeCard />
          </div>
        </div>
      </div>
    </section>
  );
}
