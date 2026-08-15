import { createFileRoute } from "@tanstack/react-router";

import { Header } from "@/components/veriscope/Header";
import { Section } from "@/components/veriscope/Section";
import { AcceptButton } from "@/components/veriscope/FunnelUI";
import { ROUTES, goTo } from "@/lib/funnel";

const title = "Pagamento — Veriscope";
const description =
  "Etapa de pagamento processada pelo gateway externo. Após a confirmação, o funil pós-compra continua.";

export const Route = createFileRoute("/payment")({
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
  component: PaymentBridge,
});

/**
 * Placeholder for the external payment gateway hand-off.
 * Replace PAYMENT_GATEWAY_URL in src/lib/checkout.ts with the live gateway;
 * its success return URL must point to the post-purchase funnel entry below.
 */
function PaymentBridge() {
  return (
    <div className="min-h-screen bg-background">
      <Header live />
      <main className="pb-24">
        <Section className="pt-14">
          <p className="eyebrow">Gateway externo</p>
          <h1 className="mt-3 font-display text-xl tracking-tight text-balance">
            O pagamento é processado fora desta página.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Quando o gateway definitivo estiver ligado, o retorno de pagamento confirmado deve
            apontar para o início do funil pós-compra.
          </p>
          <div className="mt-8">
            <AcceptButton onClick={() => goTo(ROUTES.upsell1)}>
              Simular pagamento confirmado
            </AcceptButton>
          </div>
        </Section>
      </main>
    </div>
  );
}
