import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import { Header } from "@/components/veriscope/Header";
import { Section } from "@/components/veriscope/Section";
import { AcceptButton, DeclineButton } from "@/components/veriscope/FunnelUI";
import { TRADE_PILOT_ALERT_ENGINE, formatPrice } from "@/lib/veriscope";
import { OFFERS, ROUTES, acceptOffer, declineOffer, goTo, initFunnelState } from "@/lib/funnel";

const title = "Uma última condição — Trade Pilot + Alert Engine";
const description =
  "Condição alternativa para adicionar o Trade Pilot + Alert Engine antes da entrega do seu acesso Veriscope.";

export const Route = createFileRoute("/downsell/trade-pilot")({
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
  component: DownsellTradePilot,
});

function DownsellTradePilot() {
  useEffect(() => {
    initFunnelState();
  }, []);

  const accept = () => {
    acceptOffer(OFFERS.downsell2, [
      { id: "trade-pilot", name: "Trade Pilot", price: TRADE_PILOT_ALERT_ENGINE.downsellPrice },
      { id: "alert-engine", name: "Alert Engine", price: null },
    ]);
    goTo(ROUTES.delivery);
  };

  const decline = () => {
    declineOffer(OFFERS.downsell2);
    goTo(ROUTES.delivery);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header live />

      <main className="pb-24">
        <Section className="pt-10 pb-8 sm:pt-14">
          <h1 className="font-display text-xl tracking-tight text-balance uppercase sm:text-2xl">
            Talvez agora não seja o momento de adicionar o pacote completo.
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">Tudo bem.</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Antes de encerrarmos, existe uma última condição que podemos apresentar.
          </p>
        </Section>

        <Section>
          <div className="panel p-6 sm:p-7">
            <h2 className="font-display text-sm tracking-[0.2em] text-foreground uppercase">
              {TRADE_PILOT_ALERT_ENGINE.name}
            </h2>

            <div className="mt-5 space-y-4 text-sm">
              <div>
                <p className="eyebrow">O que resolve</p>
                <p className="mt-1 leading-relaxed text-muted-foreground">
                  O acompanhamento do que você definiu e o aviso quando as condições configuradas
                  ocorrem — sem precisar vigiar o gráfico o tempo todo.
                </p>
              </div>
              <div>
                <p className="eyebrow">O que você recebe</p>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  <li>Trade Pilot — organiza e acompanha a operação definida.</li>
                  <li>Alert Engine — avisa quando as condições configuradas ocorrem.</li>
                </ul>
              </div>
            </div>

            <div className="hairline my-6" />

            {TRADE_PILOT_ALERT_ENGINE.downsellPrice !== null ? (
              <p className="text-center font-display text-3xl text-gold">
                {formatPrice(TRADE_PILOT_ALERT_ENGINE.downsellPrice)}
              </p>
            ) : (
              <p className="text-center text-xs text-muted-foreground">
                Condição especial deste funil ainda a definir.
              </p>
            )}

            <div className="mt-7">
              <AcceptButton onClick={accept}>Adicionar Trade Pilot + Alert Engine</AcceptButton>
              <DeclineButton onClick={decline}>
                Não, obrigado — continuar para a entrega
              </DeclineButton>
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}
