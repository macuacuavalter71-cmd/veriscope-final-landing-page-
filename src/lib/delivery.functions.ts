/**
 * Pine Script delivery.
 *
 * The source code stays out of the client bundle and is fetched on demand from
 * the delivery page. No payment verification happens here: the flow is driven
 * entirely by the Paymento redirects.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  productId: z.enum(["prime", "intelligence"]),
});

export const getPineSource = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const { PINE_SOURCES } = await import("./delivery.server");
    return { source: PINE_SOURCES[data.productId] ?? "" };
  });
