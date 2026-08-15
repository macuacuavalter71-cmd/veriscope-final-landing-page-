/**
 * Return URL configured in every Paymento payment link.
 *
 * The site never assumes the payment succeeded: it polls `orders` for this
 * session_id until the webhook flips a row to "paid", then sends the customer
 * to the next funnel step.
 */
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Header } from "@/components/veriscope/Header";
import { Section } from "@/components/veriscope/Section";
import { goTo, nextStepForSession } from "@/lib/funnel";

export const Route = createFileRoute("/pagamento/retorno")({
  head: () => ({
    meta: [
      { title: "A confirmar o pagamento | Veriscope" },
      {
        name: "description",
        content: "A confirmar o teu pagamento junto da rede antes de libertar o acesso.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "A confirmar o pagamento" },
      { property: "og:description", content: "Confirmação de pagamento Veriscope." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PaymentReturn,
});

const POLL_MS = 4000;

function PaymentReturn() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let stopped = false;

    const check = async () => {
      const step = await nextStepForSession();
      if (stopped) return;
      if (step.kind === "go") goTo(step.path);
    };

    void check();
    const poll = window.setInterval(() => {
      setElapsed((v) => v + POLL_MS / 1000);
      void check();
    }, POLL_MS);

    return () => {
      stopped = true;
      window.clearInterval(poll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header live />
      <main className="pb-24">
        <Section className="pt-16 pb-8">
          <h1 className="font-display text-xl tracking-tight uppercase sm:text-2xl">
            A confirmar o teu pagamento
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Aguarda uns segundos — estamos a verificar a confirmação na rede. Esta página avança
            sozinha assim que o pagamento estiver confirmado.
          </p>
          {elapsed >= 60 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              A confirmação está a demorar mais do que o habitual. Mantém esta página aberta; se o
              problema persistir, contacta o suporte.
            </p>
          ) : null}
        </Section>
      </main>
    </div>
  );
}
