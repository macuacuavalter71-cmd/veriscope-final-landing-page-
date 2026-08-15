/**
 * Return URLs.
 *
 * Each Paymento Payment Link is configured with its own Return URL under /r/…
 * The step in the URL says which offer was just paid, so the site knows which
 * page of the funnel to show next. No payment verification happens here — the
 * navigation is entirely determined by the redirect.
 *
 *   /r/edge                            → upsell Intelligence
 *   /r/prime                           → upsell Intelligence
 *   /r/bundle                          → upsell Intelligence
 *   /r/edge-checklist                  → upsell Intelligence
 *   /r/prime-checklist                 → upsell Intelligence
 *   /r/bundle-checklist                → upsell Intelligence
 *   /r/intelligence                    → delivery
 *   /r/intelligence-downsell           → delivery
 *   /r/intelligence-aiprompt           → delivery
 *   /r/intelligence-aiprompt-downsell  → delivery
 */
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import { Header } from "@/components/veriscope/Header";
import { Section } from "@/components/veriscope/Section";
import {
  FUNNEL_ROUTES,
  deliveryPath,
  goTo,
  updatePurchase,
  type BaseProduct,
  type PurchaseContext,
} from "@/lib/offers";

export const Route = createFileRoute("/r/$step")({
  head: () => ({
    meta: [
      { title: "A continuar o seu pedido | Veriscope" },
      { name: "description", content: "A encaminhar para a próxima etapa do seu pedido Veriscope." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "A continuar o seu pedido" },
      { property: "og:description", content: "Próxima etapa do pedido Veriscope." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ReturnStep,
});

type StepConfig = { patch: Partial<PurchaseContext>; next: "upsell" | "delivery" };

function base(id: BaseProduct, checklist: boolean): StepConfig {
  return { patch: { base: id, checklist }, next: "upsell" };
}

const STEPS: Record<string, StepConfig> = {
  edge: base("edge", false),
  prime: base("prime", false),
  bundle: base("bundle", false),
  "edge-checklist": base("edge", true),
  "prime-checklist": base("prime", true),
  "bundle-checklist": base("bundle", true),
  intelligence: { patch: { intelligence: true, track: "upsell" }, next: "delivery" },
  "intelligence-downsell": { patch: { intelligence: true, track: "downsell" }, next: "delivery" },
  "intelligence-aiprompt": {
    patch: { intelligence: true, promptPack: true, track: "upsell" },
    next: "delivery",
  },
  "intelligence-aiprompt-downsell": {
    patch: { intelligence: true, promptPack: true, track: "downsell" },
    next: "delivery",
  },
};

function ReturnStep() {
  const { step } = Route.useParams();

  useEffect(() => {
    const config = STEPS[step];
    if (!config) {
      goTo("/");
      return;
    }
    const purchase = updatePurchase(config.patch);
    goTo(config.next === "upsell" ? FUNNEL_ROUTES.intelligenceUpsell : deliveryPath(purchase));
  }, [step]);

  return (
    <div className="min-h-screen bg-background">
      <Header live />
      <main className="pb-24">
        <Section className="pt-16 pb-8">
          <h1 className="font-display text-xl tracking-tight uppercase sm:text-2xl">
            Obrigado pela sua compra
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            A encaminhar para a próxima etapa…
          </p>
        </Section>
      </main>
    </div>
  );
}
