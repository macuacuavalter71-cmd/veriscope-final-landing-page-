import { useReveal } from "@/hooks/use-reveal";

const ROLES = [
  {
    name: "Prime",
    where: "Dentro do gráfico",
    text: "Ajuda a organizar e interpretar o contexto do mercado.",
    highlight: false,
  },
  {
    name: "Edge",
    where: "Fora do gráfico",
    text: "Reúne ferramentas para organizar e apoiar o processo de trading.",
    highlight: false,
  },
  {
    name: "Prime + Edge",
    where: "Sistema combinado",
    text: "Contexto no gráfico + ferramentas de suporte num único ecossistema.",
    highlight: true,
  },
];

export function Differentiation() {
  const reveal = useReveal<HTMLDivElement>();

  return (
    <section className="px-5 pb-16 sm:px-6 sm:pb-24">
      <div ref={reveal.ref} className={`mx-auto w-full max-w-5xl ${reveal.className}`}>
        <p className="text-center text-sm text-muted-foreground sm:text-base">
          Cada produto resolve uma parte diferente do processo.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {ROLES.map((r) => (
            <div
              key={r.name}
              className={`panel p-5 ${r.highlight ? "border-gold/30" : ""}`}
            >
              <h3
                className={`font-display text-xs tracking-[0.2em] uppercase ${r.highlight ? "text-gold" : "text-foreground"}`}
              >
                {r.name}
              </h3>
              <p className="mt-2 font-mono text-[0.6875rem] tracking-[0.14em] text-muted-foreground uppercase">
                {r.where}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
