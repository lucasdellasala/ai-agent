import { z } from "zod";

export const MessageIntentSchema = z.object({
  types: z.array(
    z.enum(["ORDER_STATUS", "PRODUCT_OFFER", "DERIVATION", "OFF_TOPIC"])
  ),

  details: z.object({
    orderIds: z
      .array(z.string())
      .optional()
      .describe("IDs de pedidos relevantes"),

    products: z.array(z.string()).optional().describe("Productos solicitados"),

    reasons: z
      .array(z.string())
      .optional()
      .describe("Razones de derivación o temas fuera de contexto"),
  }),

  function_calls: z
    .array(
      z
        .object({
          name: z.string(),
          parameters: z.object({
            orderIds: z.array(z.string()).optional(),
            products: z.array(z.string()).optional(),
            reason: z.string().optional(),
          }),
        })
        .strict()
        .describe("Llamadas a funciones necesarias para completar la solicitud")
    )
    .optional(),
});
