/**
 * VERISCOPE — single source of truth for the launch page.
 * Change the launch window and the product catalogue here only.
 */

/** Launch window end (ISO 8601, UTC). Countdown and post-launch state read this. */
export const LAUNCH_END_DATE = "2026-09-15T21:00:00.000Z";

export type ProductId = "edge" | "prime" | "bundle";

export type Product = {
  id: ProductId;
  name: string;
  price: number;
  currency: "USD";
  tagline: string;
  description: string;
};

export const CURRENCY = "USD" as const;

export const PRODUCTS: Record<ProductId, Product> = {
  edge: {
    id: "edge",
    name: "Veriscope Edge",
    price: 67,
    currency: CURRENCY,
    tagline: "19 ferramentas. Um único espaço de trabalho.",
    description:
      "Reúna num só lugar as ferramentas de suporte que normalmente ficam espalhadas entre documentos, calculadoras, checklists e recursos diferentes.",
  },
  bundle: {
    id: "bundle",
    name: "Veriscope Prime + Edge",
    price: 247,
    currency: CURRENCY,
    tagline: "O gráfico e o processo. Juntos.",
    description:
      "O Prime trabalha dentro do gráfico. O Edge organiza o que acontece à volta dele. Juntos, formam o núcleo do ecossistema Veriscope.",
  },
  prime: {
    id: "prime",
    name: "Veriscope Prime",
    price: 197,
    currency: CURRENCY,
    tagline: "Mais contexto. Menos reconstrução.",
    description:
      "Estrutura, liquidez, zonas e contexto de múltiplos períodos reunidos diretamente no gráfico.",
  },
};

/** Card order is fixed: Edge → Prime + Edge → Prime. */
export const PRODUCT_ORDER: ProductId[] = ["edge", "bundle", "prime"];

/** Separate vs bundle — derived, never hardcoded elsewhere. */
export const SEPARATE_TOTAL = PRODUCTS.prime.price + PRODUCTS.edge.price;
export const BUNDLE_SAVING = SEPARATE_TOTAL - PRODUCTS.bundle.price;

/** Tabs confirmed in the Veriscope Edge Elite workbook (19). */
export const EDGE_TABS = [
  "Cover",
  "How To Use",
  "Settings",
  "Dashboard",
  "Trading Journal",
  "Risk Manager",
  "Drawdown Tracker",
  "Profit Dashboard",
  "R-Multiple Tracker",
  "Trade Statistics",
  "Economic Calendar",
  "Financial Control",
  "Lot Size Calculator",
  "Tax Calculator",
  "Compounding Calculator",
  "Expectancy Calculator",
  "Heatmaps",
  "Equity Curve",
  "Lists",
] as const;

/** Categories shown on the Edge card — all confirmed by the workbook tabs. */
export const EDGE_CATEGORIES = [
  "Risk",
  "Position sizing",
  "Trading journal",
  "Drawdown",
  "Performance",
  "Planning",
] as const;

export function formatPrice(value: number) {
  return `$${value}`;
}

/** Optional order bump offered on the cart / order summary page. */
export const ORDER_BUMP = {
  id: "checklist",
  eyebrow: "COMPLETE YOUR TRADING WORKFLOW",
  name: "Veriscope Trade Checklist",
  format: "Excel editável + PDF",
  price: 17,
  currency: CURRENCY,
  description:
    "Um checklist prático para organizar sua análise antes de uma operação. Use a versão Excel para registrar e acompanhar cada verificação ou a versão PDF para uma utilização rápida e direta.",
  cta: "＋ Adicionar o Veriscope Trade Checklist por $17",
} as const;

/* ------------------------------------------------------------------ *
 * Post-purchase funnel catalogue.
 * Prices that are not finalised stay `null` — never invented in code.
 * ------------------------------------------------------------------ */

export const INTELLIGENCE = {
  id: "intelligence",
  name: "Veriscope Intelligence",
  regularPrice: 197,
  upsellPrice: 97,
  downsellPrice: 67,
  currency: CURRENCY,
} as const;

export const AI_PROMPT_PACK = {
  id: "prompt-pack",
  name: "Veriscope AI Prompt Pack",
  regularPrice: 37,
  offerPrice: 19,
  currency: CURRENCY,
  description:
    "Um conjunto separado de prompts criado para complementar o uso do Veriscope Intelligence.",
} as const;

/**
 * Upsell 2 pricing is defined by the funnel pricing policy.
 * Leave as null until it is finalised — the UI hides the amount instead of
 * showing an invented number.
 */
export const TRADE_PILOT_ALERT_ENGINE = {
  id: "trade-pilot-alert-engine",
  name: "Trade Pilot + Alert Engine",
  regularPrice: null as number | null,
  offerPrice: null as number | null,
  downsellPrice: null as number | null,
  currency: CURRENCY,
} as const;

/**
 * Real product screenshots. Empty until the verified image pack is supplied —
 * the carousel never renders invented or mocked screenshots.
 */
export type Screenshot = { src: string; alt: string; caption: string };

export const INTELLIGENCE_SCREENSHOTS: Screenshot[] = [];
export const TRADE_PILOT_SCREENSHOTS: Screenshot[] = [];
export const ALERT_ENGINE_SCREENSHOTS: Screenshot[] = [];
