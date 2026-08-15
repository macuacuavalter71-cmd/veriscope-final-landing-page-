import { Countdown } from "./Countdown";

export function Hero({ remaining }: { remaining: Parameters<typeof Countdown>[0]["remaining"] }) {
  return (
    <section className="px-5 pt-16 pb-14 sm:px-6 sm:pt-24 sm:pb-20">
      <div className="mx-auto w-full max-w-3xl text-center">
        <p className="eyebrow">Veriscope Launch</p>

        <h1 className="mt-5 font-display text-3xl leading-[1.12] font-medium tracking-tight text-balance sm:text-5xl">
          Chegou o momento que estávamos preparando.
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground text-pretty sm:text-base">
          Depois de duas ferramentas criadas para responder a perguntas diferentes sobre o seu
          processo de trading, o Veriscope está oficialmente em lançamento.
        </p>

        <div className="mt-10 sm:mt-12">
          <Countdown remaining={remaining} />
        </div>
      </div>
    </section>
  );
}
