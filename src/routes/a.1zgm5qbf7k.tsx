import { createFileRoute } from "@tanstack/react-router";

import { DeliveryPage } from "@/components/veriscope/DeliveryPage";

export const Route = createFileRoute("/a/1zgm5qbf7k")({
  head: () => ({
    meta: [
      { title: "Acesso — Prime + Edge Bundle + Intelligence + AI Prompt Pack | Veriscope" },
      { name: "description", content: "Área de acesso privada aos materiais adquiridos." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Acesso — Prime + Edge Bundle + Intelligence + AI Prompt Pack" },
      { property: "og:description", content: "Área de acesso privada Veriscope." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <DeliveryPage
      title="Prime + Edge Bundle + Intelligence + AI Prompt Pack"
      items={["prime", "edge", "intelligence", "prompt-pack"]}
    />
  );
}
