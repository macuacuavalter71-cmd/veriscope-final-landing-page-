/**
 * Order persistence for the post-purchase funnel.
 *
 * The delivery page never trusts the browser: it sends only an opaque order
 * token and the server answers with the items stored for that order.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const itemSchema = z.object({
  id: z.string().min(1).max(64),
  name: z.string().min(1).max(120),
  price: z.number().nullable(),
});

const syncSchema = z.object({
  token: z.string().min(10).max(128).nullable(),
  items: z.array(itemSchema).max(20),
});

export const syncOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => syncSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    if (data.token) {
      const { data: updated } = await supabaseAdmin
        .from("orders")
        .update({ items: data.items })
        .eq("token", data.token)
        .select("token")
        .maybeSingle();
      if (updated) return { token: updated.token };
    }

    const { data: created, error } = await supabaseAdmin
      .from("orders")
      .insert({ items: data.items })
      .select("token")
      .single();

    if (error) throw new Error("Não foi possível registar o pedido.");
    return { token: created.token };
  });

export const getEntitlements = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ token: z.string().min(10).max(128) }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { PINE_SOURCES } = await import("./delivery.server");

    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("items")
      .eq("token", data.token)
      .maybeSingle();

    if (!order) return { items: [] as string[], pine: {} as Record<string, string> };

    const items = (order.items as { id: string }[] | null) ?? [];
    const ids = items.map((i) => i.id);

    const pine: Record<string, string> = {};
    for (const id of ids) {
      const source = PINE_SOURCES[id];
      if (source) pine[id] = source;
    }

    return { items: ids, pine };
  });
