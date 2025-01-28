import OpenAI from "openai";
import {
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionMessageParam,
} from "openai/resources";
import { tools } from "../openai/tools";
import { MessageIntentSchema } from "../openai/schemas";
import { sanitizeContent } from "../../../utils/sanitizeContent";
import { config } from "../../../config/dotenv";
import { ILanguageModelProvider } from "../provider.interface";
import { Context } from "../../../context/context";

config();

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/v1",
});

export class DeepSeekProvider implements ILanguageModelProvider {
  async getMessageIntent(userMessage: string): Promise<any> {
    const systemContent = `
    CLASIFICADOR DE INTENCIONES (RESPONDER SOLO EN JSON)
    
    OBJETIVOS:
    1. Identificar TODAS las intenciones presentes
    2. Extraer TODAS las entidades relevantes
    3. Generar múltiples function_calls si es necesario
    
    EJEMPLO MULTI-INTENCIÓN:
    Input: "Quiero el estado de mi pedido 456 y hacer un reclamo"
    Output: ${JSON.stringify({
      types: ["ORDER_STATUS", "DERIVATION"],
      details: {
        orderIds: ["456"],
        reasons: ["Reclamo sobre pedido (puede ser sobre 456)"],
      },
      function_calls: [
        { name: "handle_order_status", parameters: { orderIds: ["456"] } },
        { name: "handle_derivation", parameters: { reason: "Reclamo" } },
      ],
    })}
    
    REGLAS:
    - Usar type como array cuando haya múltiples intenciones
    - Priorizar DERIVATION y OFF_TOPIC sobre otras intenciones
    - Listar TODOS los parámetros relevantes
    `;

    const messages: Array<ChatCompletionMessageParam> = [
      {
        role: "system",
        content: systemContent,
      },
      {
        role: "user",
        content: `MENSAJE DEL USUARIO: ${userMessage}`,
      },
    ];

    console.debug("🚀 Calling DeepSeek - getMessageIntent");
    const response = await this.callDeepSeek({
      model: "deepseek-chat",
      messages,
      tools,
      response_format: { type: "json_object" },
      max_tokens: 200,
      temperature: 0.3,
    });

    try {
      const rawData = response.choices[0].message.content;
      const parsedData = JSON.parse(rawData || "{}");

      return MessageIntentSchema.parse({
        ...parsedData,
        function_call: parsedData.function_call || undefined,
      });
    } catch (error) {
      console.error("❌ Error parsing DeepSeek response:", error);
      throw new Error("Formato de respuesta inválido");
    }
  }

  async createFriendlyResponse(
    initialMessage: string,
    userName?: string
  ): Promise<any> {
    const systemContent = `
      Operador humano (WhatsApp) con estilo argentino.
      Usa voseo, lenguaje conciso y sin revelar que sos un asistente virtual.
    `;

    const context = Context.getFullContext();
    const orders = (
      context.orders?.map((o) => `#${o.orderId}: ${o.status}`) || []
    ).join(", ");
    const products = (
      context.productOffer?.products.map(
        (p) => `${p.productName}, ${p.available ? "en stock" : "sin stock"}`
      ) || []
    ).join(", ");
    const relevantContext = `
      Estado del pedido: ${orders ?? "N/A"}.
      Productos solicitados: ${products || "Ninguno"}.
    `;

    const messages: Array<ChatCompletionMessageParam> = [
      { role: "system", content: systemContent },
      {
        role: "assistant",
        content: `Contexto relevante: ${relevantContext}; Usuario: ${
          userName ?? "N/A"
        }`,
      },
      { role: "user", content: initialMessage },
    ];

    const response = await this.callDeepSeek({
      model: "deepseek-chat",
      messages,
    });

    const completion = response.choices[0].message;

    if (response.usage) {
      Context.updateUsage(response.usage);
    }

    return {
      ...completion,
      content: sanitizeContent(completion.content),
    };
  }

  private async callDeepSeek(
    params: ChatCompletionCreateParamsNonStreaming
  ): Promise<any> {
    try {
      const response = await deepseek.chat.completions.create(params);
      return response;
    } catch (error) {
      console.error(`❌ Error calling DeepSeek: ${error}`);
      throw new Error("Fallo en la llamada a DeepSeek.");
    }
  }
}
