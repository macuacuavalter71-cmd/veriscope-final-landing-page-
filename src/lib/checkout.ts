/**
 * Cart / order summary model.
 *
 * The cart only decides WHICH offer the customer is buying (product, with or
 * without the Trader Checklist) and sends the browser to that offer's exact
 * Paymento Payment Link. No database, no order records, no payment checks.
 */
import { CURRENCY, ORDER_BUMP, PRODUCTS, type ProductId } from "./veriscope";
import { PAYMENT_LINKS, goToPaymentLink, updatePurchase, type OfferKey } from "./offers";

export type OrderDraft = {
  orderId: string;
  productId: ProductId;
  productName: string;
  quantity: number;
  price: number;
  currency: typeof CURRENCY;
  timestamp: string;
};

function orderId() {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().split("-")[0]
      : Math.random().toString(36).slice(2, 10);
  return `VS-${Date.now().toString(36).toUpperCase()}-${random!.toUpperCase()}`;
}

export function createOrderDraft(productId: ProductId): OrderDraft {
  const product = PRODUCTS[productId];
  return {
    orderId: orderId(),
    productId,
    productName: product.name,
    quantity: 1,
    price: product.price,
    currency: CURRENCY,
    timestamp: new Date().toISOString(),
  };
}

const ORDER_STORAGE_KEY = "veriscope.order.draft";

/** Persists the draft so the order summary / checkout step can pick it up. */
export function persistOrderDraft(order: OrderDraft) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
  } catch {
    /* storage unavailable — the order is still passed through the URL */
  }
}

export function readOrderDraft(): OrderDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(ORDER_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as OrderDraft) : null;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ *
 * Order bump — Veriscope Trader Checklist (optional, never required).
 * ------------------------------------------------------------------ */

export type OrderLine = { id: string; name: string; price: number; quantity: number };

/** Line items of an order: the main product plus the bump when selected. */
export function orderLines(order: OrderDraft, bumpSelected: boolean): OrderLine[] {
  const lines: OrderLine[] = [
    { id: order.productId, name: order.productName, price: order.price, quantity: order.quantity },
  ];
  if (bumpSelected) {
    lines.push({
      id: ORDER_BUMP.id,
      name: ORDER_BUMP.name,
      price: ORDER_BUMP.price,
      quantity: 1,
    });
  }
  return lines;
}

export function orderTotal(order: OrderDraft, bumpSelected: boolean) {
  return orderLines(order, bumpSelected).reduce((sum, l) => sum + l.price * l.quantity, 0);
}

/** Exact offer for the product ± Trader Checklist combination. */
export function offerFor(productId: ProductId, bumpSelected: boolean): OfferKey {
  const map: Record<ProductId, { plain: OfferKey; withChecklist: OfferKey }> = {
    edge: { plain: "edge", withChecklist: "edge_checklist" },
    prime: { plain: "prime", withChecklist: "prime_checklist" },
    bundle: { plain: "bundle", withChecklist: "bundle_checklist" },
  };
  const entry = map[productId];
  return bumpSelected ? entry.withChecklist : entry.plain;
}

/** Single hand-off point: straight to the Payment Link of the chosen offer. */
export function goToPaymentGateway(order: OrderDraft, bumpSelected: boolean) {
  persistOrderDraft(order);
  updatePurchase({ base: order.productId, checklist: bumpSelected });
  const offer = offerFor(order.productId, bumpSelected);
  if (!PAYMENT_LINKS[offer].link) {
    console.error(`[checkout] missing Paymento link for "${offer}"`);
    return;
  }
  goToPaymentLink(offer);
}
