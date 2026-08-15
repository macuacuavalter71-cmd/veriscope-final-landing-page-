import { useReveal } from "@/hooks/use-reveal";

const ROWS = [
  { label: "Ambiente", prime: "TradingView", edge: "Workspace" },
  { label: "Foco", prime: "Contexto de mercado", edge: "Ferramentas de suporte" },
  { label: "Função", prime: "Análise visual", edge: "Organização" },
  {
    label: "Uso",
    prime: "Durante a leitura do gráfico",
    edge: "Antes, durante e depois do processo",
  },
];

export function WhyBundle() {
  const reveal = useReveal<HTMLDivElement>();

  return (
    <section className="px-5 py-16 sm:px-6 sm:py-24">
      <div ref={reveal.ref} className={`mx-auto w-full max-w-3xl ${reveal.className}`}>
        <p className="eyebrow">Por que Prime + Edge?</p>
        <h2 className="mt-4 font-display text-2xl leading-tight font-medium tracking-tight text-balance sm:text-3xl">
          Porque eles não fazem a mesma coisa.
        </h2>

        <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          <p>O Prime foi criado para trabalhar com o contexto do mercado no gráfico.</p>
          <p>
            O Edge foi criado para organizar as ferramentas que apoiam o processo fora dele.
          </p>
          <p>
            Não são duas versões do mesmo produto. São duas partes diferentes do mesmo fluxo.
          </p>
        </div>

        {/* Desktop: table */}
        <div className="panel mt-10 hidden overflow-hidden sm:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-5 py-3 font-mono text-[0.625rem] tracking-[0.18em] text-muted-foreground uppercase" />
                <th className="px-5 py-3 font-mono text-[0.625rem] tracking-[0.18em] text-gold uppercase">
                  Prime
                </th>
                <th className="px-5 py-3 font-mono text-[0.625rem] tracking-[0.18em] text-gold uppercase">
                  Edge
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label} className="border-b border-border/60">
                  <th className="px-5 py-3.5 text-left font-mono text-[0.625rem] tracking-[0.18em] text-muted-foreground uppercase">
                    {row.label}
                  </th>
                  <td className="px-5 py-3.5 text-foreground">{row.prime}</td>
                  <td className="px-5 py-3.5 text-foreground">{row.edge}</td>
                </tr>
              ))}
              <tr>
                <th className="px-5 py-3.5 text-left font-mono text-[0.625rem] tracking-[0.18em] text-muted-foreground uppercase">
                  Juntos
                </th>
                <td colSpan={2} className="px-5 py-3.5 text-gold">
                  Ecossistema Veriscope
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile: stacked cards */}
        <div className="mt-8 grid gap-4 sm:hidden">
          {(["prime", "edge"] as const).map((key) => (
            <div key={key} className="panel p-5">
              <h3 className="font-mono text-[0.625rem] tracking-[0.18em] text-gold uppercase">
                {key === "prime" ? "Prime" : "Edge"}
              </h3>
              <dl className="mt-3 space-y-2 text-sm">
                {ROWS.map((row) => (
                  <div key={row.label} className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">{row.label}</dt>
                    <dd className="text-right text-foreground">{row[key]}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
          <div className="panel border-gold/30 p-5">
            <h3 className="font-mono text-[0.625rem] tracking-[0.18em] text-gold uppercase">
              Juntos
            </h3>
            <p className="mt-2 text-sm text-foreground">Ecossistema Veriscope</p>
          </div>
        </div>
      </div>
    </section>
  );
}
