import { createFileRoute } from "@tanstack/react-router";

import { DeliveryPage } from "@/components/veriscope/DeliveryPage";

export const Route = createFileRoute("/a/3wjb6mze5p")({
  head: () => ({
    meta: [
      { title: "Acesso — Veriscope Prime + Intelligence | Veriscope" },
      { name: "description", content: "Área de acesso privada aos materiais adquiridos." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Acesso — Veriscope Prime + Intelligence" },
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
      title="Veriscope Prime + Intelligence"
      requiredProducts={["prime", "intelligence"]}
      items={["prime", "intelligence"]}
    />
  );
}
