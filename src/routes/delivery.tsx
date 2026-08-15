import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Header } from "@/components/veriscope/Header";
import { Section } from "@/components/veriscope/Section";
import { DELIVERY_CATALOG, DELIVERY_ORDER, type DeliveryFile } from "@/lib/delivery-catalog";
import { getEntitlements } from "@/lib/orders.functions";
import { initFunnelState, readOrderToken } from "@/lib/funnel";

const title = "O seu acesso Veriscope";
const description =
  "Entrega final: todos os produtos Veriscope que fazem parte da sua compra, reunidos num só lugar.";

export const Route = createFileRoute("/delivery")({
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
  component: DeliveryPage,
});

type Entitlements = { items: string[]; pine: Record<string, string> };

function DeliveryPage() {
  const [state, setState] = useState<"loading" | "ready" | "empty">("loading");
  const [data, setData] = useState<Entitlements>({ items: [], pine: {} });

  useEffect(() => {
    initFunnelState();
    let cancelled = false;

    const load = async () => {
      const token = readOrderToken();
      if (!token) {
        if (!cancelled) setState("empty");
        return;
      }
      try {
        const result = await getEntitlements({ data: { token } });
        if (cancelled) return;
        setData(result);
        setState(result.items.length > 0 ? "ready" : "empty");
      } catch {
        if (!cancelled) setState("empty");
      }
    };

    // The funnel writes the order asynchronously; give it a beat to land.
    const timer = window.setTimeout(load, 250);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  const products = DELIVERY_ORDER.filter((id) => data.items.includes(id)).map(
    (id) => DELIVERY_CATALOG[id]!,
  );

  return (
    <div className="min-h-screen bg-background">
      <Header live />

      <main className="pb-24">
        <Section className="pt-10 pb-8 sm:pt-14">
          <p className="eyebrow">Entrega final</p>
          <h1 className="mt-3 font-display text-2xl tracking-tight text-balance uppercase sm:text-3xl">
            🎉 Parabéns pela sua compra!
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Seu pagamento foi confirmado e seu acesso está pronto. Obrigado por fazer parte do
            Veriscope.
          </p>
          <p className="mt-2 text-sm text-foreground">
            Tudo o que você comprou está disponível nesta página.
          </p>
        </Section>

        <Section className="pb-6">
          <div className="hairline mb-8" />
          <h2 className="font-display text-lg tracking-[0.2em] text-foreground uppercase">
            Seus produtos
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Acesse ou baixe os produtos incluídos na sua compra abaixo.
          </p>
        </Section>

        <Section>
          {state === "loading" && (
            <p className="text-sm text-muted-foreground">A carregar o seu acesso…</p>
          )}

          {state === "empty" && (
            <div className="panel p-6 sm:p-7">
              <p className="text-sm text-muted-foreground">
                Não encontrámos uma compra associada a esta sessão. Se já concluiu o pagamento,
                utilize o link de acesso enviado para o seu e-mail.
              </p>
            </div>
          )}

          {state === "ready" && (
            <div className="grid gap-5 lg:grid-cols-2">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} pine={data.pine[product.id]} />
              ))}
            </div>
          )}
        </Section>

        {state === "ready" && (
          <Section className="pt-14">
            <div className="hairline mb-8" />
            <h2 className="font-display text-lg tracking-[0.2em] text-foreground uppercase">
              Tudo pronto.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Seus produtos estão disponíveis acima. Você pode voltar a esta página sempre que
              precisar acessar seus arquivos.
            </p>
          </Section>
        )}
      </main>
    </div>
  );
}

function ProductCard({
  product,
  pine,
}: {
  product: (typeof DELIVERY_CATALOG)[string];
  pine?: string | undefined;
}) {
  return (
    <article className="panel flex flex-col p-6 sm:p-7">
      <h3 className="font-display text-base tracking-[0.14em] text-foreground uppercase">
        {product.name}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

      <p className="mt-5 text-[0.6875rem] tracking-[0.18em] text-gold uppercase">
        {[product.pine ? "Pine Script" : null, ...product.files.map((f) => f.format)]
          .filter(Boolean)
          .join(" · ")}
      </p>

      {product.pine && pine ? <PineBlock code={pine} /> : null}

      <div className="mt-5 flex flex-wrap gap-3">
        {product.files.map((file) => (
          <DownloadButton key={file.url} file={file} />
        ))}
      </div>
    </article>
  );
}

function PineBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mt-5">
      <pre className="max-h-56 overflow-auto rounded-md border border-border/60 bg-card/60 p-4 text-[0.6875rem] leading-relaxed whitespace-pre text-muted-foreground">
        <code>{code}</code>
      </pre>
      <p className="mt-2 text-xs text-muted-foreground">
        Copie o código e cole-o no Pine Editor da TradingView.
      </p>
      <button
        type="button"
        onClick={copy}
        className="mt-3 inline-flex items-center justify-center rounded-md border border-gold/40 bg-gold/10 px-4 py-2 text-xs tracking-[0.16em] text-gold uppercase transition-colors hover:bg-gold/20"
      >
        {copied ? "✓ Copiado" : "Copiar Pine Script"}
      </button>
    </div>
  );
}

function DownloadButton({ file }: { file: DeliveryFile }) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const download = async () => {
    setStatus("loading");
    try {
      const response = await fetch(file.url);
      if (!response.ok) throw new Error("download failed");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  };

  const label =
    status === "loading" ? "Baixando…" : status === "error" ? "Tentar novamente" : file.label;

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={download}
        disabled={status === "loading"}
        className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-xs tracking-[0.16em] text-foreground uppercase transition-colors hover:border-gold/40 hover:text-gold disabled:opacity-60"
      >
        {label}
      </button>
      {status === "error" && (
        <span className="text-[0.6875rem] text-muted-foreground">Não foi possível baixar.</span>
      )}
    </div>
  );
}
