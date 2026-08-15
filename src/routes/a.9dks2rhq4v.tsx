import { createFileRoute } from "@tanstack/react-router";

import { DeliveryPage } from "@/components/veriscope/DeliveryPage";

export const Route = createFileRoute("/a/9dks2rhq4v")({
  head: () => ({
    meta: [
      { title: "Acesso — Veriscope Prime + Intelligence + AI Prompt Pack | Veriscope" },
      { name: "description", content: "Área de acesso privada aos materiais adquiridos." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Acesso — Veriscope Prime + Intelligence + AI Prompt Pack" },
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
      title="Veriscope Prime + Intelligence + AI Prompt Pack"
      items={["prime", "intelligence", "prompt-pack"]}
    />
  );
}
