/**
 * AI Prompt Pack offer, shown after Intelligence is confirmed as paid.
 *
 * Accepting does NOT create a second order: it creates one order with
 * product_id "intelligence_aiprompt" and uses the combined Paymento link that
 * matches the path the customer came from (upsell $116 / downsell $86).
 */
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Header } from "@/components/veriscope/Header";
import { Section } from "@/components/veriscope/Section";
import { AcceptButton, DeclineButton, PriceLine } from "@/components/veriscope/FunnelUI";
import { AI_PROMPT_PACK, formatPrice } from "@/lib/veriscope";
import { OFFER_CATALOG, buy } from "@/lib/orders";
import {
  OFFERS,
  RETURN_PATH,
  getIntelligencePath,
  goTo,
  markAnswered,
  nextStepForSession,
} from "@/lib/funnel";

export const Route = createFileRoute("/upsell/prompt-pack")({
  head: () => ({
    meta: [
      { title: "Veriscope AI Prompt Pack | Veriscope" },
      {
        name: "description",
        content:
          "Adicione o AI Prompt Pack ao Veriscope Intelligence numa condição exclusiva pós-compra.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Veriscope AI Prompt Pack" },
      {
        property: "og:description",
        content: "Prompts criados para complementar o Veriscope Intelligence.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PromptPackUpsell,
});

function PromptPackUpsell() {
  const [busy, setBusy] = useState(false);

  const path = typeof window === "undefined" ? "upsell" : getIntelligencePath();
  const offerKey =
    path === "downsell" ? "intelligence_aiprompt_downsell" : "intelligence_aiprompt_upsell";
  const combinedPrice = OFFER_CATALOG[offerKey].amount;
  const intelligencePrice = OFFER_CATALOG[
    path === "downsell" ? "intelligence_downsell" : "intelligence_upsell"
  ].amount;

  const accept = () => {
    if (busy) return;
    setBusy(true);
    markAnswered(OFFERS.promptPack);
    void buy(offerKey);
  };

  const decline = () => {
    markAnswered(OFFERS.promptPack);
    void nextStepForSession().then((step) =>
      goTo(step.kind === "go" ? step.path : RETURN_PATH),
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header live />
      <main className="pb-24">
        <Section className="pt-10 pb-8 sm:pt-14">
          <h1 className="font-display text-xl tracking-tight text-balance uppercase sm:text-2xl">
            Uma última adição ao seu Intelligence
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {AI_PROMPT_PACK.description}
          </p>
        </Section>

        <Section className="pb-8">
          <div className="panel p-6 sm:p-7">
            <h2 className="font-display text-sm tracking-[0.2em] uppercase">
              {AI_PROMPT_PACK.name}
            </h2>
            <div className="hairline my-6" />
            <PriceLine from={intelligencePrice} to={combinedPrice} />
            <p className="mt-3 text-center text-xs text-muted-foreground">
              O valor de {formatPrice(combinedPrice)} substitui o do Intelligence — é um único
              pagamento com o Prompt Pack incluído.
            </p>

            <div className="mt-7">
              <AcceptButton onClick={accept}>
                {busy
                  ? "A abrir o pagamento…"
                  : `Adicionar AI Prompt Pack — ${formatPrice(combinedPrice)}`}
              </AcceptButton>
              <DeclineButton onClick={decline}>Não — continuar para o acesso</DeclineButton>
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}
