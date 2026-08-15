import { createFileRoute } from "@tanstack/react-router";

import { DeliveryPage } from "@/components/veriscope/DeliveryPage";

export const Route = createFileRoute("/a/2hf9wsk7rm")({
  head: () => ({
    meta: [
      { title: "Acesso — Veriscope Edge + Intelligence | Veriscope" },
      { name: "description", content: "Área de acesso privada aos materiais adquiridos." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Acesso — Veriscope Edge + Intelligence" },
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
      title="Veriscope Edge + Intelligence"
      requiredProducts={["edge", "intelligence"]}
      items={["edge", "intelligence"]}
    />
  );
}
