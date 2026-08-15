/**
 * Delivery page shell.
 *
 * The page shows exactly the products of the purchase that led here — nothing
 * more. The Trader Checklist is added only when the customer bought one of the
 * "+ Trader Checklist" offers.
 */
import { useEffect, useState } from "react";

import { Header } from "./Header";
import { Section } from "./Section";
import { DELIVERY_CATALOG, DELIVERY_ORDER, type DeliveryProduct } from "@/lib/delivery-catalog";
import { getPineSource } from "@/lib/delivery.functions";
import { readPurchase } from "@/lib/offers";

function PineBlock({ productId }: { productId: "prime" | "intelligence" }) {
  const [source, setSource] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const load = () => {
    setError(false);
    getPineSource({ data: { productId } })
      .then((r) => setSource(r.source))
      .catch(() => setError(true));
  };

  return (
    <div className="mt-4">
      {source === null ? (
        <button
          type="button"
          onClick={load}
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-border px-5 py-3 text-xs font-medium tracking-[0.14em] uppercase transition-colors hover:border-gold/50"
        >
          Mostrar Pine Script
        </button>
      ) : (
        <pre className="max-h-80 overflow-auto rounded-md border border-border bg-muted/40 p-4 text-xs whitespace-pre-wrap">
          {source}
        </pre>
      )}
      {error ? (
        <p className="mt-2 text-xs text-destructive">Não foi possível carregar o Pine Script.</p>
      ) : null}
    </div>
  );
}

function ProductBlock({ product }: { product: DeliveryProduct }) {
  return (
    <article className="panel p-6 sm:p-7">
      <h2 className="font-display text-sm tracking-[0.2em] uppercase">{product.name}</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

      <div className="mt-5 flex flex-wrap gap-3">
        {product.files.map((f) => (
          <a
            key={f.url}
            href={f.url}
            download={f.filename}
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 py-3 text-xs font-medium tracking-[0.14em] text-primary-foreground uppercase transition-colors hover:bg-gold-light"
          >
            {f.label}
          </a>
        ))}
      </div>

      {product.pine && (product.id === "prime" || product.id === "intelligence") ? (
        <PineBlock productId={product.id} />
      ) : null}
    </article>
  );
}

export function DeliveryPage({
  title,
  items,
}: {
  title: string;
  /** Catalogue keys included in this exact purchase. */
  items: string[];
}) {
  const [checklist, setChecklist] = useState(false);

  // The Trader Checklist is only part of the delivery when the customer chose
  // one of the "+ Trader Checklist" offers on the cart page.
  useEffect(() => {
    setChecklist(readPurchase().checklist);
  }, []);

  const keys = checklist ? [...items, "checklist"] : items;
  const ordered = DELIVERY_ORDER.filter((id) => keys.includes(id)).map(
    (id) => DELIVERY_CATALOG[id]!,
  );

  return (
    <div className="min-h-screen bg-background">
      <Header live />
      <main className="pb-24">
        <Section className="pt-10 pb-8 sm:pt-14">
          <p className="eyebrow">Acesso liberado</p>
          <h1 className="mt-3 font-display text-xl tracking-tight uppercase sm:text-2xl">
            O seu sistema Veriscope está pronto.
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">{title}</p>
        </Section>

        <Section className="pb-8">
          <div className="grid gap-5">
            {ordered.map((p) => (
              <ProductBlock key={p.id} product={p} />
            ))}
          </div>
        </Section>

        <Section className="pb-8">
          <div className="panel p-6 sm:p-7">
            <h2 className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
              Resumo da compra
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {ordered.map((p) => (
                <li key={p.id} className="flex items-center gap-2 text-foreground">
                  <span className="h-1 w-1 rounded-full bg-gold/60" />
                  {p.name}
                </li>
              ))}
            </ul>
          </div>
        </Section>
      </main>
    </div>
  );
}
