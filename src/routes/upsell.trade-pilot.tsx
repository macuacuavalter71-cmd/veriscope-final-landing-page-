import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import { Header } from "@/components/veriscope/Header";
import { Section } from "@/components/veriscope/Section";
import { Carousel } from "@/components/veriscope/Carousel";
import { AcceptButton, DeclineButton, FlowSteps } from "@/components/veriscope/FunnelUI";
import {
  ALERT_ENGINE_SCREENSHOTS,
  TRADE_PILOT_ALERT_ENGINE,
  TRADE_PILOT_SCREENSHOTS,
  formatPrice,
} from "@/lib/veriscope";
import { OFFERS, ROUTES, acceptOffer, declineOffer, goTo, initFunnelState } from "@/lib/funnel";

const title = "Trade Pilot + Alert Engine — a etapa depois da avaliação";
const description =
  "Acompanhar o que você definiu e ser avisado quando as condições configuradas ocorrerem. Complemento ao seu processo, não substituição.";

export const Route = createFileRoute("/upsell/trade-pilot")({
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
  component: UpsellTradePilot,
});

function UpsellTradePilot() {
  useEffect(() => {
    initFunnelState();
  }, []);

  const accept = () => {
    acceptOffer(OFFERS.upsell2, [
      { id: "trade-pilot", name: "Trade Pilot", price: TRADE_PILOT_ALERT_ENGINE.offerPrice },
      { id: "alert-engine", name: "Alert Engine", price: null },
    ]);
    goTo(ROUTES.delivery);
  };

  const decline = () => {
    declineOffer(OFFERS.upsell2);
    goTo(ROUTES.downsell2);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header live />

      <main className="pb-24">
        <Section className="pt-10 pb-8 sm:pt-14">
          <h1 className="font-display text-xl tracking-tight text-balance uppercase sm:text-2xl">
            Agora que você tem a avaliação, existe outra parte do processo.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Você já viu como o Veriscope pode ajudar a organizar e avaliar o contexto do mercado.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Mas existe uma etapa que acontece depois: acompanhar o que você definiu e saber quando
            voltar sua atenção para o mercado.
          </p>
        </Section>

        <Section className="py-8">
          <p className="eyebrow">Uma pergunta</p>
          <ul className="mt-4 space-y-4">
            {[
              "Depois de definir exatamente o que você está procurando, você permanece olhando para o gráfico esperando que essas condições apareçam?",
              "Quanto tempo você passa acompanhando movimentos que, no final, não apresentam aquilo que estava procurando?",
              "E quando você não está olhando para o gráfico?",
            ].map((q) => (
              <li key={q} className="panel p-5 text-sm leading-relaxed text-foreground">
                {q}
              </li>
            ))}
          </ul>
        </Section>

        <Section className="py-8">
          <h2 className="font-display text-lg tracking-tight text-balance uppercase">
            Definir o que você procura é uma coisa. Saber quando voltar sua atenção para isso é
            outra.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Você pode ter o seu contexto, fazer a sua avaliação, definir o que procura e ter um
            processo. Ainda assim continua o trabalho de acompanhar o mercado e identificar quando
            as condições relevantes acontecem.
          </p>
        </Section>

        <Section className="py-8">
          <h2 className="font-display text-lg tracking-tight text-balance uppercase">
            Conheça o Trade Pilot + Alert Engine
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Duas ferramentas para complementar a etapa que vem depois da avaliação.
          </p>

          <article className="panel mt-6 p-6 sm:p-7">
            <h3 className="font-display text-sm tracking-[0.2em] text-foreground uppercase">
              Trade Pilot
            </h3>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="eyebrow">O que é</dt>
                <dd className="mt-1 leading-relaxed text-muted-foreground">
                  Uma ferramenta para organizar e acompanhar a operação que você definiu, de acordo
                  com o processo real do produto.
                </dd>
              </div>
              <div>
                <dt className="eyebrow">O que faz</dt>
                <dd className="mt-1 leading-relaxed text-muted-foreground">
                  Mantém registada a configuração daquilo que você procura e acompanha o
                  desenvolvimento dessa operação ao longo do processo.
                </dd>
              </div>
              <div>
                <dt className="eyebrow">Por que existe</dt>
                <dd className="mt-1 leading-relaxed text-muted-foreground">
                  Porque depois de decidir o que procurar, o acompanhamento costuma ficar disperso
                  e manual.
                </dd>
              </div>
            </dl>
            <div className="mt-6">
              <Carousel slides={TRADE_PILOT_SCREENSHOTS} label="Trade Pilot" />
            </div>
          </article>

          <article className="panel mt-5 p-6 sm:p-7">
            <h3 className="font-display text-sm tracking-[0.2em] text-foreground uppercase">
              Alert Engine
            </h3>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="eyebrow">O que é</dt>
                <dd className="mt-1 leading-relaxed text-muted-foreground">
                  Um sistema de alertas para as condições que você configurou.
                </dd>
              </div>
              <div>
                <dt className="eyebrow">O que faz</dt>
                <dd className="mt-1 leading-relaxed text-muted-foreground">
                  Avisa quando as condições configuradas ocorrem no mercado.
                </dd>
              </div>
              <div>
                <dt className="eyebrow">Por que existe</dt>
                <dd className="mt-1 leading-relaxed text-muted-foreground">
                  Porque acompanhar constantemente o gráfico à espera de determinadas condições
                  consome tempo e atenção.
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-sm text-foreground">
              O Alert Engine não executa operações por você.
            </p>
            <div className="mt-6">
              <Carousel slides={ALERT_ENGINE_SCREENSHOTS} label="Alert Engine" />
            </div>
          </article>
        </Section>

        <Section className="py-8">
          <FlowSteps
            steps={[
              "Você define o que procura",
              "Trade Pilot",
              "Acompanha o processo",
              "Alert Engine",
              "Avisa quando a condição relevante ocorre",
              "Você analisa",
              "Você decide",
            ]}
          />
        </Section>

        <Section className="py-8">
          <h2 className="font-display text-lg tracking-tight text-balance uppercase">
            O Veriscope não precisa ficar decidindo por você.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            O objetivo é reduzir o trabalho repetitivo ao redor do seu processo. Você continua
            definindo o que procura. Você continua avaliando o mercado. Você continua tomando a
            decisão.
          </p>
        </Section>

        <Section className="py-8">
          <div className="panel p-6 sm:p-7">
            <h2 className="font-display text-lg tracking-tight text-balance uppercase">
              Complete a última camada do seu fluxo
            </h2>
            <p className="mt-4 text-center font-display text-base text-foreground">
              {TRADE_PILOT_ALERT_ENGINE.name}
            </p>

            {TRADE_PILOT_ALERT_ENGINE.offerPrice !== null ? (
              <div className="mt-4 flex items-baseline justify-center gap-3">
                {TRADE_PILOT_ALERT_ENGINE.regularPrice !== null && (
                  <span className="text-base text-muted-foreground line-through">
                    {formatPrice(TRADE_PILOT_ALERT_ENGINE.regularPrice)}
                  </span>
                )}
                <span className="font-display text-3xl text-gold">
                  {formatPrice(TRADE_PILOT_ALERT_ENGINE.offerPrice)}
                </span>
              </div>
            ) : (
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Condição de preço deste funil ainda a definir.
              </p>
            )}

            <div className="mt-7">
              <AcceptButton onClick={accept}>Adicionar Trade Pilot + Alert Engine</AcceptButton>
              <DeclineButton onClick={decline}>Não — continuar para a entrega</DeclineButton>
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}
