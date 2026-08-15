import { createFileRoute } from "@tanstack/react-router";

import { DeliveryPage } from "@/components/veriscope/DeliveryPage";

export const Route = createFileRoute("/a/6vpe8ncx3t")({
  head: () => ({
    meta: [
      { title: "Acesso — Prime + Edge Bundle + Intelligence | Veriscope" },
      { name: "description", content: "Área de acesso privada aos materiais adquiridos." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Acesso — Prime + Edge Bundle + Intelligence" },
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
      title="Prime + Edge Bundle + Intelligence"
      items={["prime", "edge", "intelligence"]}
    />
  );
}
