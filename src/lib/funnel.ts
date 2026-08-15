/**
 * Post-payment funnel.
 *
 * The next step is never decided by the browser alone: it is derived from the
 * rows in `orders` that are already `paid` for this session_id. Local storage
 * only remembers which offers were already answered (accepted/refused), so the
 * customer is not asked the same thing twice.
 *
 *  Edge / Prime / Bundle paid
 *      → /upsell/intelligence  (accept → Paymento → back here)
 *          ↘ refuse → /downsell/intelligence
 *      Intelligence paid → /upsell/prompt-pack (combined order + link)
 *      → delivery page for the exact combination bought
 */
import { getSessionId } from "./session";
import { fetchPaidProducts } from "./orders";
import type { OrderProductId } from "./supabase";

/** Single return URL configured in every Paymento payment link. */
export const RETURN_PATH = "/pagamento/retorno";

export const FUNNEL_ROUTES = {
  intelligenceUpsell: "/upsell/intelligence",
  intelligenceDownsell: "/downsell/intelligence",
  promptPack: "/upsell/prompt-pack",
} as const;

/** Obscure, non-guessable delivery routes — one per paid combination. */
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

const ANSWERS_KEY = "veriscope_funnel_answers";

export const OFFERS = {
  intelligenceUpsell: "intelligence-upsell",
  intelligenceDownsell: "intelligence-downsell",
  promptPack: "prompt-pack",
} as const;

export function readAnswers(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ANSWERS_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function markAnswered(offerId: string) {
  if (typeof window === "undefined") return;
  const answers = readAnswers();
  if (!answers.includes(offerId)) answers.push(offerId);
  try {
    window.localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
  } catch {
    /* storage unavailable */
  }
}

export function hasAnswered(offerId: string) {
  return readAnswers().includes(offerId);
}

const PATH_KEY = "veriscope_intelligence_path";
export type IntelligencePath = "upsell" | "downsell";

/** Remembers whether Intelligence was bought at upsell or downsell price, so the
 *  AI Prompt Pack page can use the matching combined Paymento link. */
export function setIntelligencePath(path: IntelligencePath) {
  try {
    window.localStorage.setItem(PATH_KEY, path);
  } catch {
    /* storage unavailable */
  }
}

export function getIntelligencePath(): IntelligencePath {
  if (typeof window === "undefined") return "upsell";
  return window.localStorage.getItem(PATH_KEY) === "downsell" ? "downsell" : "upsell";
}


/** Which of the three main products was paid (bundle wins over the others). */
export function baseProduct(paid: Set<OrderProductId>): "edge" | "prime" | "bundle" | null {
  if (paid.has("bundle")) return "bundle";
  if (paid.has("prime")) return "prime";
  if (paid.has("edge")) return "edge";
  return null;
}

export type NextStep = { kind: "waiting" } | { kind: "go"; path: string };

/** Decides where the customer goes next, from the paid rows in the database. */
export function resolveNextStep(paid: Set<OrderProductId>): NextStep {
  const base = baseProduct(paid);
  if (!base) return { kind: "waiting" };

  const deliver = (extra?: OrderProductId) =>
    ({
      kind: "go" as const,
      path: DELIVERY_ROUTES[extra ? `${base}+${extra}` : base]!,
    });

  if (paid.has("intelligence_aiprompt")) return deliver("intelligence_aiprompt");

  if (paid.has("intelligence")) {
    if (hasAnswered(OFFERS.promptPack)) return deliver("intelligence");
    return { kind: "go", path: FUNNEL_ROUTES.promptPack };
  }

  if (!hasAnswered(OFFERS.intelligenceUpsell)) {
    return { kind: "go", path: FUNNEL_ROUTES.intelligenceUpsell };
  }
  if (!hasAnswered(OFFERS.intelligenceDownsell)) {
    return { kind: "go", path: FUNNEL_ROUTES.intelligenceDownsell };
  }
  return deliver();
}

/** Reads the database and resolves the next funnel step for this session. */
export async function nextStepForSession(): Promise<NextStep> {
  const paid = await fetchPaidProducts(getSessionId());
  return resolveNextStep(paid);
}

export function goTo(path: string) {
  window.location.href = path;
}
