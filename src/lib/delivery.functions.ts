/**
 * Pine Script delivery.
 *
 * The source code never ships in the client bundle. The server re-checks in the
 * database that the session really paid for the product before returning it.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  sessionId: z.string().min(8),
  productId: z.enum(["prime", "intelligence"]),
});

/** Maps the catalogue item to the order product_ids that unlock it. */
const UNLOCKED_BY: Record<string, string[]> = {
  prime: ["prime", "bundle"],
  intelligence: ["intelligence", "intelligence_aiprompt"],
};

export const getPineSource = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const { createSupabase } = await import("./supabase");
    const { PINE_SOURCES } = await import("./delivery.server");

    const supabase = createSupabase();
    const { data: rows, error } = await supabase
      .from("orders")
      .select("product_id")
      .eq("session_id", data.sessionId)
      .eq("status", "paid");

    if (error) throw new Error("Não foi possível validar a compra.");

    const paid = new Set((rows ?? []).map((r: { product_id: string }) => r.product_id));
    const allowed = (UNLOCKED_BY[data.productId] ?? []).some((id) => paid.has(id));
    if (!allowed) throw new Error("Compra não confirmada.");

    return { source: PINE_SOURCES[data.productId] ?? "" };
  });
