import { createFileRoute } from "@tanstack/react-router";

import { Header } from "@/components/veriscope/Header";
import { Hero } from "@/components/veriscope/Hero";
import { useLaunchWindow } from "@/components/veriscope/Countdown";
import { ProductCards } from "@/components/veriscope/ProductCards";
import { Differentiation } from "@/components/veriscope/Differentiation";
import { Benefits } from "@/components/veriscope/Benefits";
import { WhyBundle } from "@/components/veriscope/WhyBundle";
import { Lightbox } from "@/components/veriscope/Lightbox";
import { CommunityTeaser } from "@/components/veriscope/CommunityTeaser";


const title = "Veriscope Launch — Prime, Edge e Prime + Edge";
const description =
  "O Veriscope está oficialmente em lançamento. Escolha entre Edge ($67), Prime ($197) ou Prime + Edge ($247) — contexto no gráfico e ferramentas de suporte no mesmo ecossistema.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LaunchPage,
});

function LaunchPage() {
  const remaining = useLaunchWindow();
  const live = !(remaining?.over ?? false);

  return (
    <div className="min-h-screen bg-background">
      <Header live={live} />
      <main>
        <Hero remaining={remaining} />
        <ProductCards />
        <Differentiation />
        <Benefits />
        <WhyBundle />
        <CommunityTeaser />

      </main>
      <Lightbox />
    </div>
  );
}
