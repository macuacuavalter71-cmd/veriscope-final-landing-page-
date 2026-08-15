import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Header } from "@/components/veriscope/Header";
import { Section } from "@/components/veriscope/Section";
import { Carousel } from "@/components/veriscope/Carousel";
import {
  AcceptButton,
  DeclineButton,
  FlowSteps,
  PriceLine,
} from "@/components/veriscope/FunnelUI";
import {
  INTELLIGENCE,
  INTELLIGENCE_SCREENSHOTS,
  PRODUCTS,
  formatPrice,
} from "@/lib/veriscope";
import { buy } from "@/lib/orders";
import { fetchPaidProducts } from "@/lib/orders";
import { getSessionId } from "@/lib/session";
import { FUNNEL_ROUTES, OFFERS, baseProduct, goTo, markAnswered } from "@/lib/funnel";


const title = "Antes de liberar o seu acesso — Veriscope Intelligence";
const description =
  "Pagamento confirmado. Antes da entrega, uma camada adicional do Veriscope para a etapa de avaliação da informação.";

export const Route = createFileRoute("/upsell/intelligence")({
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
  component: UpsellIntelligence,
});

const QUESTIONS = [
  "Quando você já tem estrutura, liquidez e informações de diferentes timeframes na sua frente, como você avalia tudo isso em conjunto?",
  "Quando várias informações aparecem ao mesmo tempo, você já possui um processo estruturado para determinar o que realmente merece atenção?",
  "Ou essa avaliação ainda depende principalmente da sua própria interpretação e comparação das informações?",
];

function UpsellIntelligence() {
  const [purchasedName, setPurchasedName] = useState(PRODUCTS.prime.name);
  const [busy, setBusy] = useState(false);

  // The name shown is the product the database confirms as paid.
  useEffect(() => {
    let cancelled = false;
    void fetchPaidProducts(getSessionId()).then((paid) => {
      const base = baseProduct(paid);
      if (!cancelled && base) setPurchasedName(PRODUCTS[base].name);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const accept = () => {
    if (busy) return;
    setBusy(true);
    markAnswered(OFFERS.intelligenceUpsell);
    setIntelligencePath("upsell");
    void buy("intelligence_upsell");
  };


  const decline = () => {
    markAnswered(OFFERS.intelligenceUpsell);
    goTo(FUNNEL_ROUTES.intelligenceDownsell);
  };


  return (
    <div className="min-h-screen bg-background">
      <Header live />

      <main className="pb-24">
        {/* Interruption + reassurance */}
        <Section className="pt-10 pb-8 sm:pt-14">
          <p className="eyebrow">Pare — o seu pedido ainda não foi concluído</p>
          <div className="panel mt-4 p-6 sm:p-7">
            <p className="text-base text-foreground">
              Seu pagamento foi confirmado com sucesso.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Os produtos que você acabou de comprar estão garantidos e reservados para você.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Antes de liberar seu acesso, queremos mostrar uma última camada do Veriscope que pode
              fazer sentido para o seu processo.
            </p>
          </div>
        </Section>

        {/* Context */}
        <Section className="py-8">
          <h1 className="font-display text-xl tracking-tight text-balance uppercase sm:text-2xl">
            Você acabou de adquirir o {purchasedName}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            O Prime trabalha dentro do gráfico: estrutura, liquidez, zonas e contexto de múltiplos
            períodos reunidos onde você já analisa. Essa parte está resolvida.
          </p>
        </Section>

        {/* Questions */}
        <Section className="py-8">
          <h2 className="font-display text-lg tracking-tight text-balance uppercase">
            Mas deixe-me fazer algumas perguntas.
          </h2>
          <ul className="mt-5 space-y-4">
            {QUESTIONS.map((q) => (
              <li key={q} className="panel p-5 text-sm leading-relaxed text-foreground">
                {q}
              </li>
            ))}
          </ul>
        </Section>

        {/* Problem recognition */}
        <Section className="py-8">
          <h2 className="font-display text-lg tracking-tight text-balance uppercase">
            Existe um ponto em que mais informação deixa de ajudar.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            O trader pode ter estrutura, liquidez, zonas, múltiplos timeframes e várias outras
            informações. Mas possuir mais informações não significa automaticamente conseguir
            avaliá-las melhor.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="panel p-5 text-center">
              <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
                Ver a informação
              </p>
            </div>
            <div className="panel p-5 text-center">
              <p className="text-xs tracking-[0.18em] text-gold uppercase">Avaliar a informação</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            O Prime continua sendo exatamente aquilo para o qual foi criado. O que está acima é uma
            etapa diferente do processo.
          </p>
        </Section>

        {/* Solution */}
        <Section className="py-8">
          <h2 className="font-display text-lg tracking-tight text-balance uppercase">
            E a equipe da Veriscope pensou nisso também.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Foi por isso que criamos uma camada adicional para essa parte do processo.
          </p>
          <div className="panel mt-6 p-6 sm:p-7">
            <h3 className="font-display text-sm tracking-[0.2em] text-foreground uppercase">
              {INTELLIGENCE.name}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Uma camada de avaliação que organiza as informações já disponíveis no seu gráfico e
              devolve uma leitura estruturada desse conjunto, para que a comparação não dependa
              apenas da sua interpretação manual. O Intelligence não prevê o mercado, não executa
              operações e não substitui o trader.
            </p>
          </div>
        </Section>

        {/* Single visual block */}
        <Section className="py-8">
          <h2 className="font-display text-lg tracking-tight text-balance uppercase">
            Veja o Veriscope Intelligence em ação
          </h2>
          <div className="mt-6">
            <Carousel slides={INTELLIGENCE_SCREENSHOTS} label="Veriscope Intelligence" />
          </div>
        </Section>

        {/* Positioning */}
        <Section className="py-8">
          <h2 className="font-display text-lg tracking-tight text-balance uppercase">
            Uma camada entre a informação e a sua decisão
          </h2>
          <FlowSteps
            steps={[
              "Informação",
              "Avaliação estruturada",
              "Contexto para a decisão",
              "Você toma a decisão",
            ]}
          />
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            O Intelligence não toma a decisão por você. A decisão final continua sendo sua.
          </p>
        </Section>

        {/* Offer */}
        <Section className="py-8">
          <div className="panel p-6 sm:p-7">
            <h2 className="font-display text-lg tracking-tight text-balance uppercase">
              Adicione o Veriscope Intelligence ao seu sistema
            </h2>
            <div className="mt-6">
              <PriceLine from={INTELLIGENCE.regularPrice} to={INTELLIGENCE.upsellPrice} />
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              {formatPrice(INTELLIGENCE.upsellPrice)} é uma condição específica deste fluxo
              pós-compra.
            </p>

            <div className="mt-7">
              <AcceptButton onClick={accept}>
                {busy
                  ? "A abrir o pagamento…"
                  : `Adicionar Veriscope Intelligence — ${formatPrice(INTELLIGENCE.upsellPrice)}`}
              </AcceptButton>
              <DeclineButton onClick={decline}>Não — continuar sem Intelligence</DeclineButton>
            </div>
          </div>
        </Section>
      </main>

    </div>
  );
}
