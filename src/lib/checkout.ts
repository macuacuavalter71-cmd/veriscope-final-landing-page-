/**
 * Cart / order summary model — same structure as before, now handing off to
 * Paymento instead of a placeholder gateway.
 * No card data is ever collected or stored here.
 */
import { CURRENCY, ORDER_BUMP, PRODUCTS, type ProductId } from "./veriscope";
import { OFFER_CATALOG, createPendingOrder } from "./orders";

export type OrderStatus = "draft" | "pending" | "paid" | "failed" | "cancelled";

export type OrderDraft = {
  orderId: string;
  email: string | null;
  productId: ProductId;
  productName: string;
  quantity: number;
  price: number;
  currency: typeof CURRENCY;
  status: OrderStatus;
  timestamp: string;
};

function orderId() {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().split("-")[0]
      : Math.random().toString(36).slice(2, 10);
  return `VS-${Date.now().toString(36).toUpperCase()}-${random!.toUpperCase()}`;
}

export function createOrderDraft(
  productId: ProductId,
  options: { email?: string | null; quantity?: number } = {},
): OrderDraft {
  const product = PRODUCTS[productId];
  const quantity = options.quantity ?? 1;

  return {
    orderId: orderId(),
    email: options.email ?? null,
    productId,
    productName: product.name,
    quantity,
    price: product.price * quantity,
    currency: CURRENCY,
    status: "draft",
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
 * Order bump — Veriscope Trade Checklist (optional, never required).
 * ------------------------------------------------------------------ */

export type OrderLine = { id: string; name: string; price: number; quantity: number };

/** Line items of an order: the main product plus the bump when selected. */
export function orderLines(order: OrderDraft, bumpSelected: boolean): OrderLine[] {
  const lines: OrderLine[] = [
    {
      id: order.productId,
      name: order.productName,
      price: order.price,
      quantity: order.quantity,
    },
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

/**
 * Single hand-off point: writes the pending order in Supabase (session_id +
 * product_id + amount) and sends the customer to the Paymento payment link.
 */
export async function goToPaymentGateway(order: OrderDraft, bumpSelected: boolean) {
  persistOrderDraft({
    ...order,
    status: "pending",
    // Bump selection is kept with the draft; Paymento has no separate link for it.
    ...(bumpSelected ? { bump: true } : {}),
  } as OrderDraft);

  await createPendingOrder(order.productId);

  const link = OFFER_CATALOG[order.productId].link;
  if (!link) {
    console.error(`[checkout] missing Paymento link for "${order.productId}"`);
    return;
  }
  window.location.href = link;
}
