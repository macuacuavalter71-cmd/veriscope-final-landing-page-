/**
 * Checkout order model — prepared for an external payment gateway.
 * No card data is ever collected or stored here.
 */
import { CURRENCY, ORDER_BUMP, PRODUCTS, type ProductId } from "./veriscope";

/** External payment gateway hand-off. Replace with the live gateway URL. */
export const PAYMENT_GATEWAY_URL = "/payment";

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
 * Hands the configured order to the external payment gateway.
 * There is no second, internal checkout: this is the single hand-off point.
 */
export function goToPaymentGateway(order: OrderDraft, bumpSelected: boolean) {
  const payload: OrderDraft & { bump: boolean; total: number } = {
    ...order,
    bump: bumpSelected,
    total: orderTotal(order, bumpSelected),
    status: "pending",
  };
  persistOrderDraft(payload);

  const params = new URLSearchParams({
    order: payload.orderId,
    product: payload.productId,
    bump: bumpSelected ? "1" : "0",
    total: String(payload.total),
    currency: payload.currency,
  });
  window.location.href = `${PAYMENT_GATEWAY_URL}?${params.toString()}`;
}
