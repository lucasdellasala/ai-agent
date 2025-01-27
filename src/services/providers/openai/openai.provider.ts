import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import {
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionMessageParam,
} from "openai/resources";
import { tools } from "./tools";
import { MessageIntentSchema } from "./schemas";
import { sanitizeContent } from "../../../utils/sanitizeContent";
import { config } from "../../../config/dotenv";
import { ILanguageModelProvider } from "../provider.interface";
import { Context } from "../../../context/context";

config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export class OpenAIProvider implements ILanguageModelProvider {
  async getMessageIntent(userMessage: string): Promise<any> {
    const systemContent = `
      CLASIFICADOR DE INTENCIONES (RESPONDER SOLO EN JSON)
      OBJETIVOS:
      1. Identificar TODAS las intenciones presentes ORDER_STATUS, PRODUCT_OFFER, DERIVATION y/o OFF_TOPIC
      2. Extraer TODAS las entidades relevantes
      3. Generar múltiples function_calls si es necesario
      Responde con JSON. Usa herramientas cuando sea necesario.
    `;

    const messages: Array<ChatCompletionMessageParam> = [
      { role: "system", content: systemContent },
      { role: "user", content: userMessage },
    ];

    console.debug("🚀 Calling OpenAI - getMessageIntent");
    const response = await this.callOpenAI({
      model: "gpt-4o",
      messages,
      tools,
      response_format: zodResponseFormat(MessageIntentSchema, "intent"),
    });

    if (response.usage) {
      Context.updateUsage(response.usage);
    }

    return JSON.parse(response.choices[0].message.content);
  }

  async createFriendlyResponse(
    initialMessage: string,
    userName?: string
  ): Promise<any> {
    const systemContent = `Operador humano (WhatsApp) con estilo argentino. Usa voseo, lenguaje conciso y sin revelar que eres un bot.`;

    const context = Context.getFullContext();
    const orders = (
      context.orders?.map((o) => `#${o.orderId}: ${o.status}`) || []
    ).join(", ");
    const relevantContext = `
      Estado del pedido: ${orders ?? "N/A"}.
      Productos solicitados: ${
        (context.productOffer?.products || []).join(", ") || "Ninguno"
      }.
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

    console.debug("🚀 Calling OpenAI - createFriendlyResponse");
    const response = await this.callOpenAI({
      model: "gpt-4o",
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

  private async callOpenAI(
    params: ChatCompletionCreateParamsNonStreaming
  ): Promise<any> {
    try {
      console.log('🧨 params for openai.chat.completions.create', JSON.stringify(params, null, 2));
      const response = await openai.chat.completions.create(params);
      console.debug("💲 USAGE OpenAI", JSON.stringify(response.usage, null, 2));
      return response;
    } catch (error) {
      console.error(`❌ Error calling OpenAI: ${error}`);
      throw new Error("Fallo en la llamada a OpenAI.");
    }
  }
}
