import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Header } from "@/components/veriscope/Header";
import { Section } from "@/components/veriscope/Section";
import { Carousel } from "@/components/veriscope/Carousel";
import {
  AcceptButton,
  DeclineButton,
  PriceLine,
  PromptPackModal,
} from "@/components/veriscope/FunnelUI";
import { INTELLIGENCE, INTELLIGENCE_SCREENSHOTS, formatPrice } from "@/lib/veriscope";
import { deliveryPath, goTo, goToPaymentLink, updatePurchase } from "@/lib/offers";


const title = "Uma última possibilidade — Veriscope Intelligence";
const description =
  "Uma condição mais acessível para adicionar o Veriscope Intelligence antes da entrega do seu acesso.";

export const Route = createFileRoute("/downsell/intelligence")({
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
  component: DownsellIntelligence,
});

function DownsellIntelligence() {
  const [busy, setBusy] = useState(false);
  const [promptPack, setPromptPack] = useState(false);

  // Accepting opens the AI Prompt Pack modal; the hand-off happens on confirm.
  const accept = () => {
    if (busy) return;
    setPromptPack(true);
  };

  const confirm = (withPromptPack: boolean) => {
    if (busy) return;
    setBusy(true);
    updatePurchase({ track: "downsell" });
    goToPaymentLink(withPromptPack ? "intelligence_aiprompt_downsell" : "intelligence_downsell");
  };

  // Refusing here closes the Intelligence offer for good: straight to delivery.
  const decline = () => {
    goTo(deliveryPath());
  };



  return (
    <div className="min-h-screen bg-background">
      <Header live />

      <main className="pb-24">
        <Section className="pt-10 pb-8 sm:pt-14">
          <h1 className="font-display text-xl tracking-tight text-balance uppercase sm:text-2xl">
            Talvez agora não seja o momento de adicionar o Intelligence por{" "}
            {formatPrice(INTELLIGENCE.upsellPrice)}.
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">Tudo bem.</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Antes de liberar seu acesso, queremos deixar uma última possibilidade disponível.
          </p>
        </Section>

        <Section className="pb-8">
          <div className="panel p-6 sm:p-7">
            <h2 className="font-display text-sm tracking-[0.2em] text-foreground uppercase">
              {INTELLIGENCE.name}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Você já viu o que o Intelligence pode adicionar ao seu processo: uma avaliação
              estruturada das informações que você já tem no gráfico, antes da sua decisão.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Se a única razão para recusar anteriormente foi o preço, esta é uma condição mais
              acessível para adicioná-lo agora.
            </p>

            <div className="hairline my-6" />
            <PriceLine from={INTELLIGENCE.upsellPrice} to={INTELLIGENCE.downsellPrice} />

            <div className="mt-7">
              <AcceptButton onClick={accept}>
                Adicionar Intelligence por {formatPrice(INTELLIGENCE.downsellPrice)}
              </AcceptButton>
              <DeclineButton onClick={decline}>Não — continuar para a entrega</DeclineButton>
            </div>
          </div>
        </Section>

        <Section className="pb-8">
          <Carousel
            slides={INTELLIGENCE_SCREENSHOTS.slice(0, 2)}
            label="Veriscope Intelligence"
          />
        </Section>
      </main>

      <PromptPackModal open={promptPack} busy={busy} onConfirm={confirm} />
    </div>
  );
}
