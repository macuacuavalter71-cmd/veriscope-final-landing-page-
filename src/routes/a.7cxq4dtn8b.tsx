import { createFileRoute } from "@tanstack/react-router";

import { DeliveryPage } from "@/components/veriscope/DeliveryPage";

export const Route = createFileRoute("/a/7cxq4dtn8b")({
  head: () => ({
    meta: [
      { title: "Acesso — Veriscope Edge + Intelligence + AI Prompt Pack | Veriscope" },
      { name: "description", content: "Área de acesso privada aos materiais adquiridos." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Acesso — Veriscope Edge + Intelligence + AI Prompt Pack" },
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
      title="Veriscope Edge + Intelligence + AI Prompt Pack"
      items={["edge", "intelligence", "prompt-pack"]}
    />
  );
}
