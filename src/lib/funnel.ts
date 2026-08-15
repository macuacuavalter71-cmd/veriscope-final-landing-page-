/**
 * Post-purchase funnel state.
 *
 * The main payment already happened before this flow starts. Nothing here
 * blocks delivery: every offer can be refused and the customer keeps
 * everything already purchased.
 *
 * PAYMENT → UPSELL 1 (Intelligence $97) → [Prompt Pack] → UPSELL 2 → DELIVERY
 *                    ↘ refuse → DOWNSELL (Intelligence $67) → [Prompt Pack] ↗
 */
import { PRODUCTS, type ProductId } from "./veriscope";
import { readOrderDraft } from "./checkout";
import { syncOrder } from "./orders.functions";


export type FunnelItemId =
  | ProductId
  | "checklist"
  | "intelligence"
  | "prompt-pack"
  | "trade-pilot"
  | "alert-engine";

export type FunnelItem = { id: FunnelItemId; name: string; price: number | null };

export type FunnelState = {
  /** Items already paid for — main order plus accepted post-purchase offers. */
  items: FunnelItem[];
  /** Offers the customer already answered; never shown a second time. */
  answered: string[];
};

const KEY = "veriscope.funnel.state";

function emptyState(): FunnelState {
  return { items: [], answered: [] };
}

/** Seeds the funnel with the main order (product + optional checklist). */
export function initFunnelState(): FunnelState {
  const existing = readFunnelState();
  if (existing.items.length > 0) return existing;

  const order = readOrderDraft() as (ReturnType<typeof readOrderDraft> & { bump?: boolean }) | null;
  const state = emptyState();

  const productId: ProductId = order?.productId ?? "prime";
  const product = PRODUCTS[productId];

  if (productId === "bundle") {
    state.items.push({ id: "prime", name: PRODUCTS.prime.name, price: null });
    state.items.push({ id: "edge", name: PRODUCTS.edge.name, price: null });
  } else {
    state.items.push({ id: productId, name: product.name, price: product.price });
  }

  if (order?.bump) {
    state.items.push({ id: "checklist", name: "Veriscope Trade Checklist", price: 17 });
  }

  writeFunnelState(state);
  return state;
}

export function readFunnelState(): FunnelState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? { ...emptyState(), ...(JSON.parse(raw) as FunnelState) } : emptyState();
  } catch {
    return emptyState();
  }
}

const TOKEN_KEY = "veriscope.order.token";

/** Opaque token that lets the delivery page ask the server what was bought. */
export function readOrderToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(TOKEN_KEY) ?? window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function writeOrderToken(token: string) {
  try {
    window.sessionStorage.setItem(TOKEN_KEY, token);
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* storage unavailable */
  }
}

/** Mirrors the funnel items into the database — the delivery page reads them from there. */
function persistOrder(state: FunnelState) {
  if (typeof window === "undefined" || state.items.length === 0) return;
  void syncOrder({ data: { token: readOrderToken(), items: state.items } })
    .then((result) => writeOrderToken(result.token))
    .catch(() => {
      /* the funnel keeps working; delivery retries on the next step */
    });
}

export function writeFunnelState(state: FunnelState) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable — the funnel still routes correctly in-session */
  }
  persistOrder(state);
}


/**
 * Records an accepted post-purchase offer. The charge itself is handled by the
 * configured post-purchase payment infrastructure — there is no second checkout.
 */
export function acceptOffer(offerId: string, items: FunnelItem[]) {
  const state = readFunnelState();
  const existing = new Set(state.items.map((i) => i.id));
  state.items.push(...items.filter((i) => !existing.has(i.id)));
  if (!state.answered.includes(offerId)) state.answered.push(offerId);
  writeFunnelState(state);
  return state;
}

export function declineOffer(offerId: string) {
  const state = readFunnelState();
  if (!state.answered.includes(offerId)) state.answered.push(offerId);
  writeFunnelState(state);
  return state;
}

export function hasAnswered(offerId: string) {
  return readFunnelState().answered.includes(offerId);
}

export function hasItem(id: FunnelItemId) {
  return readFunnelState().items.some((i) => i.id === id);
}

export function goTo(path: string) {
  window.location.href = path;
}

/** Offer identifiers used across the funnel routes. */
export const OFFERS = {
  upsell1: "upsell-1-intelligence-97",
  downsell1: "downsell-1-intelligence-67",
  promptPack: "ai-prompt-pack-19",
  upsell2: "upsell-2-trade-pilot-alert-engine",
  downsell2: "downsell-2-trade-pilot-alert-engine",
} as const;

export const ROUTES = {
  upsell1: "/upsell/intelligence",
  downsell1: "/downsell/intelligence",
  upsell2: "/upsell/trade-pilot",
  downsell2: "/downsell/trade-pilot",
  delivery: "/delivery",
} as const;
