import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { ChatCompletionCreateParamsNonStreaming, ChatCompletionMessageParam } from 'openai/resources';
import { MessageIntentSchema } from './schemas';
import { calculateCost } from './pricing';
import { env } from '../config/env';
import { ILanguageModelProvider, IntentClassificationResult, FriendlyResponseResult, LLMCallMetadata } from './provider.interface';
import { Context } from '../agent/context/context';
import { tools } from '../agent/tools';
import { withLLMSpan } from '../observability/tracing';

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export class OpenAIProvider implements ILanguageModelProvider {
  private readonly model = 'gpt-4o';

  async getMessageIntent(userMessage: string): Promise<IntentClassificationResult> {
    return withLLMSpan(
      { operation: 'getMessageIntent', model: this.model, promptContent: userMessage },
      async () => {
        const systemContent = `
          CLASIFICADOR DE INTENCIONES (RESPONDER SOLO EN JSON)
          OBJETIVOS:
          1. Identificar TODAS las intenciones presentes ORDER_STATUS, PRODUCT_OFFER, DERIVATION y/o OFF_TOPIC
          2. Extraer TODAS las entidades relevantes
          3. Generar multiples function_calls si es necesario
          Responde con JSON. Usa herramientas cuando sea necesario.
        `;

        const messages: ChatCompletionMessageParam[] = [
          { role: 'system', content: systemContent },
          { role: 'user', content: userMessage },
        ];

        const start = Date.now();
        const response = await this.callOpenAI({
          model: this.model,
          messages,
          tools,
          response_format: zodResponseFormat(MessageIntentSchema, 'intent'),
        });
        const latencyMs = Date.now() - start;

        const usage = response.usage;
        const promptTokens = usage?.prompt_tokens ?? 0;
        const completionTokens = usage?.completion_tokens ?? 0;

        const metadata: LLMCallMetadata = {
          model: this.model,
          promptTokens,
          completionTokens,
          totalTokens: promptTokens + completionTokens,
          latencyMs,
          costUsd: calculateCost(this.model, promptTokens, completionTokens),
          finishReason: response.choices[0]?.finish_reason ?? 'unknown',
        };

        Context.updateUsage({
          prompt_tokens: promptTokens,
          completion_tokens: completionTokens,
          total_tokens: promptTokens + completionTokens,
        });

        const parsed = JSON.parse(response.choices[0].message.content ?? '{}');
        return { ...parsed, metadata };
      },
    );
  }

  async createFriendlyResponse(initialMessage: string, userName?: string): Promise<FriendlyResponseResult> {
    return withLLMSpan(
      { operation: 'createFriendlyResponse', model: this.model, promptContent: initialMessage },
      async () => {
        const systemContent = 'Operador humano (WhatsApp) con estilo argentino. Usa voseo, lenguaje conciso y sin revelar que eres un bot.';

        const context = Context.getFullContext();
        const orders = (context.orders?.map((o) => `#${o.orderId}: ${o.status}`) ?? []).join(', ');
        const products = (context.productOffer?.products.map((p) => `${p.productName}, ${p.available ? 'en stock' : 'sin stock'}`) ?? []).join(', ');
        const relevantContext = `Estado del pedido: ${orders || 'N/A'}. Productos solicitados: ${products || 'Ninguno'}.`;

        const messages: ChatCompletionMessageParam[] = [
          { role: 'system', content: systemContent },
          { role: 'assistant', content: `Contexto relevante: ${relevantContext}; Usuario: ${userName ?? 'N/A'}` },
          { role: 'user', content: initialMessage },
        ];

        const start = Date.now();
        const response = await this.callOpenAI({ model: this.model, messages });
        const latencyMs = Date.now() - start;

        const usage = response.usage;
        const promptTokens = usage?.prompt_tokens ?? 0;
        const completionTokens = usage?.completion_tokens ?? 0;

        Context.updateUsage({
          prompt_tokens: promptTokens,
          completion_tokens: completionTokens,
          total_tokens: promptTokens + completionTokens,
        });

        const metadata: LLMCallMetadata = {
          model: this.model,
          promptTokens,
          completionTokens,
          totalTokens: promptTokens + completionTokens,
          latencyMs,
          costUsd: calculateCost(this.model, promptTokens, completionTokens),
          finishReason: response.choices[0]?.finish_reason ?? 'unknown',
        };

        return { content: response.choices[0].message.content ?? '', metadata };
      },
    );
  }

  private async callOpenAI(params: ChatCompletionCreateParamsNonStreaming) {
    try {
      return await openai.chat.completions.create(params);
    } catch (error) {
      throw new Error(`OpenAI call failed: ${error}`);
    }
  }
}
