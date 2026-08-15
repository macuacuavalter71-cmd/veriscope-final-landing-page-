import { useReveal } from "@/hooks/use-reveal";

const ITEMS = [
  {
    n: "01",
    title: "Veja mais contexto de uma só vez",
    text: "Estrutura, liquidez, zonas e contexto temporal reunidos sem precisar reconstruir tudo manualmente.",
  },
  {
    n: "02",
    title: "Passe menos tempo procurando",
    text: "Menos ferramentas espalhadas. Menos troca entre documentos. Mais continuidade no processo.",
  },
  {
    n: "03",
    title: "Analise antes de reagir",
    text: "Tenha o contexto disponível antes de transformar cada movimento do preço numa decisão.",
  },
  {
    n: "04",
    title: "Organize o processo",
    text: "O Edge concentra ferramentas de suporte num único espaço de trabalho.",
  },
  {
    n: "05",
    title: "Menos reconstrução. Mais continuidade.",
    text: "O objetivo não é simplesmente adicionar informação. É tornar mais fácil trabalhar com a informação que já importa.",
  },
];

export function Benefits() {
  const reveal = useReveal<HTMLDivElement>();

  return (
    <section className="border-t border-border/60 bg-surface/40 px-5 py-16 sm:px-6 sm:py-24">
      <div ref={reveal.ref} className={`mx-auto w-full max-w-5xl ${reveal.className}`}>
        <h2 className="font-display text-2xl leading-tight font-medium tracking-tight text-balance sm:text-3xl">
          O que muda quando as peças estão juntas?
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((item) => (
            <div key={item.n} className="panel p-5 sm:p-6">
              <span className="font-mono text-xs text-gold">{item.n}</span>
              <h3 className="mt-3 text-base font-medium text-pretty">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
