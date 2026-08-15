/**
 * VERISCOPE — single, authoritative map of offers → Paymento Payment Links.
 *
 * Nothing here talks to a database. Buying is always: pick the offer, send the
 * browser to that offer's exact Payment Link. Paymento returns the customer to
 * the Return URL configured for that link (see RETURN_ROUTES below), and the
 * site simply shows the next page of the funnel.
 */

export type OfferKey =
  | "edge"
  | "prime"
  | "bundle"
  | "edge_checklist"
  | "prime_checklist"
  | "bundle_checklist"
  | "intelligence_upsell"
  | "intelligence_downsell"
  | "intelligence_aiprompt_upsell"
  | "intelligence_aiprompt_downsell";

export type Offer = {
  name: string;
  /** Price in USD, or null when the offer has no standalone price. */
  price: number | null;
  /** Full Paymento Payment Link — copied verbatim, never rebuilt. */
  link: string;
};

export const PAYMENT_LINKS: Record<OfferKey, Offer> = {
  edge: {
    name: "Veriscope Edge",
    price: 67,
    link: "https://app.paymento.io/payment-link/0014dd1403244f3dbbba811bc5eec59f",
  },
  prime: {
    name: "Veriscope Prime",
    price: 197,
    link: "https://app.paymento.io/payment-link/b3e5812c2fd041f9952cd9753e3ed61a",
  },
  bundle: {
    name: "Veriscope Prime + Edge Bundle",
    price: 247,
    link: "https://app.paymento.io/payment-link/6d065f1293784846b7a442cb8cf43da2",
  },
  edge_checklist: {
    name: "Veriscope Edge + Trader Checklist",
    price: null,
    link: "https://app.paymento.io/payment-link/ee6ba934578f44239054561247641937",
  },
  prime_checklist: {
    name: "Veriscope Prime + Trader Checklist",
    price: null,
    link: "https://app.paymento.io/payment-link/3f6544c14bc74f3c8f58f3c50f656f46",
  },
  bundle_checklist: {
    name: "Veriscope Prime + Edge Bundle + Trader Checklist",
    price: null,
    link: "https://app.paymento.io/payment-link/f862497764fa4dbbb06662ca551fcc54",
  },
  intelligence_upsell: {
    name: "Veriscope Intelligence",
    price: 97,
    link: "https://app.paymento.io/payment-link/a26171a7129f41df893f62c655b0bcc3",
  },
  intelligence_downsell: {
    name: "Veriscope Intelligence",
    price: 67,
    link: "https://app.paymento.io/payment-link/c9f234a0a53343fca749bed77d26ca4d",
  },
  intelligence_aiprompt_upsell: {
    name: "Veriscope Intelligence + AI Prompt Pack",
    price: 116,
    link: "https://app.paymento.io/payment-link/44d34132162a44318e7b7294f4b2e025",
  },
  intelligence_aiprompt_downsell: {
    name: "Veriscope Intelligence + AI Prompt Pack",
    price: 86,
    link: "https://app.paymento.io/payment-link/28bc02ed5bea486998f6e980cf4ef5fe",
  },
};

/** Sends the browser to the exact Payment Link of one offer. */
export function goToPaymentLink(offer: OfferKey) {
  window.location.href = PAYMENT_LINKS[offer].link;
}

/* ------------------------------------------------------------------ *
 * Purchase context (navigation only — never a payment check).
 *
 * It only remembers WHICH offer page the customer came through, so the
 * funnel can show the matching next page and the matching delivery page.
 * It never authorises anything: delivery pages are reached by redirect.
 * ------------------------------------------------------------------ */

export type BaseProduct = "edge" | "prime" | "bundle";

export type PurchaseContext = {
  base: BaseProduct;
  checklist: boolean;
  intelligence: boolean;
  promptPack: boolean;
  /** Which Intelligence track the customer is on (upsell or downsell price). */
  track: "upsell" | "downsell";
};

const KEY = "veriscope_purchase";

const EMPTY: PurchaseContext = {
  base: "prime",
  checklist: false,
  intelligence: false,
  promptPack: false,
  track: "upsell",
};

export function readPurchase(): PurchaseContext {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...EMPTY, ...(JSON.parse(raw) as Partial<PurchaseContext>) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

export function updatePurchase(patch: Partial<PurchaseContext>): PurchaseContext {
  const next = { ...readPurchase(), ...patch };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable — the funnel still works through redirects */
  }
  return next;
}

/* ------------------------------------------------------------------ *
 * Funnel routes.
 * ------------------------------------------------------------------ */

export const FUNNEL_ROUTES = {
  intelligenceUpsell: "/upsell/intelligence",
  intelligenceDownsell: "/downsell/intelligence",
} as const;

/** Obscure, non-guessable delivery routes — one per purchased combination. */
export const DELIVERY_ROUTES: Record<string, string> = {
  edge: "/a/4kq7ptv2ha",
  prime: "/a/8mzr3xc9wd",
  bundle: "/a/5tn6bjy4qe",
  "edge+intelligence": "/a/2hf9wsk7rm",
  "edge+intelligence_aiprompt": "/a/7cxq4dtn8b",
  "prime+intelligence": "/a/3wjb6mze5p",
  "prime+intelligence_aiprompt": "/a/9dks2rhq4v",
  "bundle+intelligence": "/a/6vpe8ncx3t",
  "bundle+intelligence_aiprompt": "/a/1zgm5qbf7k",
};

/** Delivery page for the combination the customer has been through. */
export function deliveryPath(p: PurchaseContext = readPurchase()): string {
  const extra = p.promptPack ? "intelligence_aiprompt" : p.intelligence ? "intelligence" : null;
  return DELIVERY_ROUTES[extra ? `${p.base}+${extra}` : p.base]!;
}

export function goTo(path: string) {
  window.location.href = path;
}
