import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Header } from "@/components/veriscope/Header";
import { Section } from "@/components/veriscope/Section";
import { useLaunchWindow } from "@/components/veriscope/Countdown";
import { ORDER_BUMP, PRODUCTS, formatPrice, type ProductId } from "@/lib/veriscope";
import {
  createOrderDraft,
  goToPaymentGateway,
  orderLines,
  orderTotal,
  persistOrderDraft,
  readOrderDraft,
  type OrderDraft,
} from "@/lib/checkout";

const title = "Resumo do pedido — Veriscope";
const description =
  "Reveja o seu pedido Veriscope, adicione o Trade Checklist (Excel editável + PDF) por $17 e continue para o pagamento.";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function isProductId(value: string | null): value is ProductId {
  return value === "edge" || value === "prime" || value === "bundle";
}

function CartPage() {
  const remaining = useLaunchWindow();
  const live = !(remaining?.over ?? false);

  const [order, setOrder] = useState<OrderDraft | null>(null);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("product");
    const stored = readOrderDraft();
    // Prime is the default of the order flow; the cart always carries a product.
    const productId: ProductId = isProductId(param)
      ? param
      : ((stored?.productId as ProductId | undefined) ?? "prime");

    const next =
      stored && stored.productId === productId ? stored : createOrderDraft(productId);
    persistOrderDraft(next);
    setOrder(next);
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header live={live} />
        <Section className="py-16">
          <p className="text-sm text-muted-foreground">A preparar o seu pedido…</p>
        </Section>
      </div>
    );
  }

  const product = PRODUCTS[order.productId];
  const lines = orderLines(order, bump);
  const total = orderTotal(order, bump);

  return (
    <div className="min-h-screen bg-background">
      <Header live={live} />

      <main className="pb-24">
        <Section className="pt-10 pb-6 sm:pt-14">
          <p className="eyebrow">Resumo do pedido</p>
          <h1 className="mt-3 font-display text-2xl tracking-tight text-balance sm:text-3xl">
            Confirme o que está a comprar
          </h1>
        </Section>

        {/* 1. Main product */}
        <Section className="pb-6">
          <article className="panel p-6 sm:p-7">
            <h2 className="font-display text-sm tracking-[0.2em] text-foreground uppercase">
              {product.name}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
            <div className="hairline my-5" />
            <div className="flex items-baseline justify-between">
              <span className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
                Plano selecionado
              </span>
              <span className="font-display text-xl text-foreground">
                {formatPrice(order.price)}
              </span>
            </div>
          </article>
        </Section>

        {/* 2. Order bump */}
        <Section className="pb-6">
          <div
            className={`panel p-6 transition-colors sm:p-7 ${
              bump ? "border-gold/50" : ""
            }`}
          >
            <p className="eyebrow">{ORDER_BUMP.eyebrow}</p>
            <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-base text-foreground">{ORDER_BUMP.name}</h2>
              <span className="font-display text-lg text-gold">
                {formatPrice(ORDER_BUMP.price)}
              </span>
            </div>
            <p className="mt-1 text-xs tracking-[0.12em] text-muted-foreground uppercase">
              {ORDER_BUMP.format}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {ORDER_BUMP.description}
            </p>

            <label className="mt-5 flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-border px-4 py-3 transition-colors hover:border-gold/40">
              <input
                type="checkbox"
                checked={bump}
                onChange={(e) => setBump(e.target.checked)}
                className="size-4 accent-[var(--gold,#c9a227)]"
                aria-label={ORDER_BUMP.cta}
              />
              <span className="text-sm text-foreground">{ORDER_BUMP.cta}</span>
            </label>
          </div>
        </Section>

        {/* 3. Order summary */}
        <Section className="pb-6">
          <div className="panel p-6 sm:p-7">
            <h2 className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
              Resumo do pedido
            </h2>
            <ul className="mt-4 space-y-3">
              {lines.map((line) => (
                <li key={line.id} className="flex items-baseline justify-between text-sm">
                  <span className="text-foreground">{line.name}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {formatPrice(line.price * line.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="hairline my-5" />
            <div className="flex items-baseline justify-between">
              <span className="text-xs tracking-[0.14em] text-foreground uppercase">Total</span>
              <span className="font-display text-2xl text-gold tabular-nums">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </Section>

        {/* 4. CTA */}
        <Section>
          <button
            type="button"
            onClick={() => void goToPaymentGateway(order, bump)}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-xs font-medium tracking-[0.14em] text-primary-foreground uppercase transition-colors hover:bg-gold-light"
          >
            Continuar para pagamento
          </button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Pagamento processado num ambiente externo e seguro.
          </p>
        </Section>
      </main>
    </div>
  );
}
