/**
 * Delivery page shell.
 *
 * Nothing is shown because the visitor reached the URL: on mount the page asks
 * the database for `orders` rows with this session_id, the required product_ids
 * and status = "paid". Only that answer unlocks the content.
 */
import { useEffect, useState } from "react";

import { Header } from "./Header";
import { Section } from "./Section";
import { DELIVERY_CATALOG, DELIVERY_ORDER, type DeliveryProduct } from "@/lib/delivery-catalog";
import { fetchPaidProducts } from "@/lib/orders";
import { getSessionId } from "@/lib/session";
import { getPineSource } from "@/lib/delivery.functions";
import type { OrderProductId } from "@/lib/supabase";

type State = "checking" | "granted" | "denied";

function PineBlock({ productId }: { productId: "prime" | "intelligence" }) {
  const [source, setSource] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const load = () => {
    setError(false);
    getPineSource({ data: { sessionId: getSessionId(), productId } })
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
        <p className="mt-2 text-xs text-destructive">Não foi possível validar a compra.</p>
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
  requiredProducts,
  items,
}: {
  title: string;
  /** product_id values that must all be "paid" for this session. */
  requiredProducts: OrderProductId[];
  /** Catalogue keys unlocked by this combination. */
  items: string[];
}) {
  const [state, setState] = useState<State>("checking");

  useEffect(() => {
    let cancelled = false;
    void fetchPaidProducts(getSessionId()).then((paid) => {
      if (cancelled) return;
      setState(requiredProducts.every((p) => paid.has(p)) ? "granted" : "denied");
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ordered = DELIVERY_ORDER.filter((id) => items.includes(id)).map(
    (id) => DELIVERY_CATALOG[id]!,
  );

  return (
    <div className="min-h-screen bg-background">
      <Header live />
      <main className="pb-24">
        <Section className="pt-10 pb-8 sm:pt-14">
          <h1 className="font-display text-xl tracking-tight uppercase sm:text-2xl">{title}</h1>

          {state === "checking" ? (
            <p className="mt-4 text-sm text-muted-foreground">A validar a sua compra…</p>
          ) : null}

          {state === "denied" ? (
            <div className="panel mt-6 p-6">
              <p className="text-sm text-destructive">
                Não encontrámos um pagamento confirmado para este acesso.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Se acabou de pagar, aguarde alguns segundos e atualize a página. Caso o problema
                persista, contacte o suporte.
              </p>
            </div>
          ) : null}
        </Section>

        {state === "granted" ? (
          <Section className="pb-8">
            <div className="grid gap-5">
              {ordered.map((p) => (
                <ProductBlock key={p.id} product={p} />
              ))}
            </div>
          </Section>
        ) : null}
      </main>
    </div>
  );
}
