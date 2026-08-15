/**
 * Orders + Paymento hand-off.
 *
 * Buying anything is always the same two steps:
 *   1. insert a `pending` row in `orders` (session_id + product_id + amount)
 *   2. redirect the browser to the matching Paymento payment link
 *
 * The site never marks anything as paid: the Paymento webhook / Edge Function
 * flips `status` to "paid" and the site only ever reads that value back.
 */
import { supabase, type OrderProductId } from "./supabase";
import { getSessionId } from "./session";

export type OfferKey =
  | "edge"
  | "prime"
  | "bundle"
  | "intelligence_upsell"
  | "intelligence_downsell"
  | "intelligence_aiprompt_upsell"
  | "intelligence_aiprompt_downsell";

export type Offer = {
  productId: OrderProductId;
  amount: number;
  /** Paymento payment link. Empty string = link not supplied yet. */
  link: string;
};

/** Single place where prices and Paymento links live. */
export const OFFER_CATALOG: Record<OfferKey, Offer> = {
  edge: {
    productId: "edge",
    amount: 67,
    link: "https://app.paymento.io/payment-link/0014dd1403244f3dbbba811bc5eec59f",
  },
  prime: {
    productId: "prime",
    amount: 197,
    link: "https://app.paymento.io/payment-link/b3e5812c2fd041f9952cd9753e3ed61a",
  },
  bundle: {
    productId: "bundle",
    amount: 247,
    // TODO: Paymento payment link for the Prime + Edge Bundle was not supplied.
    link: "",
  },
  intelligence_upsell: {
    productId: "intelligence",
    amount: 97,
    link: "https://app.paymento.io/payment-link/ddfcda17d72c4d51a732cee332f835db",
  },
  intelligence_downsell: {
    productId: "intelligence",
    amount: 67,
    link: "https://app.paymento.io/payment-link/c9f234a0a53343fca749bed77d26ca4d",
  },
  intelligence_aiprompt_upsell: {
    productId: "intelligence_aiprompt",
    amount: 116,
    link: "https://app.paymento.io/payment-link/44d34132162a44318e7b7294f4b2e025",
  },
  intelligence_aiprompt_downsell: {
    productId: "intelligence_aiprompt",
    amount: 86,
    link: "https://app.paymento.io/payment-link/28bc02ed5bea486998f6e980cf4ef5fe",
  },
};

export const CURRENCY = "USD" as const;

/** Inserts the pending order for this session. Returns false when it failed. */
export async function createPendingOrder(offerKey: OfferKey): Promise<boolean> {
  const offer = OFFER_CATALOG[offerKey];
  const { error } = await supabase.from("orders").insert({
    session_id: getSessionId(),
    product_id: offer.productId,
    amount: offer.amount,
    currency: CURRENCY,
    status: "pending",
  });
  if (error) {
    console.error("[orders] insert failed", error.message);
    return false;
  }
  return true;
}

/**
 * Creates the order and sends the customer to the Paymento payment link.
 * The order row is written first so the webhook always finds it.
 */
export async function buy(offerKey: OfferKey) {
  const offer = OFFER_CATALOG[offerKey];
  await createPendingOrder(offerKey);
  if (!offer.link) {
    console.error(`[orders] missing Paymento link for offer "${offerKey}"`);
    return;
  }
  window.location.href = offer.link;
}

/** All product_id values already confirmed as paid for this session. */
export async function fetchPaidProducts(sessionId: string): Promise<Set<OrderProductId>> {
  const { data, error } = await supabase
    .from("orders")
    .select("product_id")
    .eq("session_id", sessionId)
    .eq("status", "paid");

  if (error) {
    console.error("[orders] read failed", error.message);
    return new Set();
  }
  return new Set((data ?? []).map((row: { product_id: string }) => row.product_id as OrderProductId));
}
