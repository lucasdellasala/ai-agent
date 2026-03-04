import OpenAI from 'openai';
import { ChatCompletionCreateParamsNonStreaming, ChatCompletionMessageParam } from 'openai/resources';
import { MessageIntentSchema } from './schemas';
import { calculateCost } from './pricing';
import { env } from '../config/env';
import { ILanguageModelProvider, IntentClassificationResult, FriendlyResponseResult, LLMCallMetadata } from './provider.interface';
import { Context } from '../agent/context/context';
import { tools } from '../agent/tools';

const deepseek = new OpenAI({
  apiKey: env.DEEPSEEK_API_KEY ?? '',
  baseURL: 'https://api.deepseek.com/v1',
});

export class DeepSeekProvider implements ILanguageModelProvider {
  private readonly model = 'deepseek-chat';

  async getMessageIntent(userMessage: string): Promise<IntentClassificationResult> {
    const systemContent = `
    CLASIFICADOR DE INTENCIONES (RESPONDER SOLO EN JSON)
    OBJETIVOS:
    1. Identificar TODAS las intenciones presentes
    2. Extraer TODAS las entidades relevantes
    3. Generar multiples function_calls si es necesario
    REGLAS:
    - Usar type como array cuando haya multiples intenciones
    - Priorizar DERIVATION y OFF_TOPIC sobre otras intenciones
    - Listar TODOS los parametros relevantes
    `;

    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: systemContent },
      { role: 'user', content: `MENSAJE DEL USUARIO: ${userMessage}` },
    ];

    const start = Date.now();
    const response = await this.callDeepSeek({
      model: this.model,
      messages,
      tools,
      response_format: { type: 'json_object' },
      max_tokens: 200,
      temperature: 0.3,
    });
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

    const rawData = response.choices[0].message.content;
    const parsedData = JSON.parse(rawData ?? '{}');
    const validated = MessageIntentSchema.parse(parsedData);

    return { ...validated, metadata };
  }

  async createFriendlyResponse(initialMessage: string, userName?: string): Promise<FriendlyResponseResult> {
    const systemContent = 'Operador humano (WhatsApp) con estilo argentino. Usa voseo, lenguaje conciso y sin revelar que sos un asistente virtual.';

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
    const response = await this.callDeepSeek({ model: this.model, messages });
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

    return {
      content: response.choices[0].message.content ?? '',
      metadata,
    };
  }

  private async callDeepSeek(params: ChatCompletionCreateParamsNonStreaming) {
    try {
      return await deepseek.chat.completions.create(params);
    } catch (error) {
      throw new Error(`DeepSeek call failed: ${error}`);
    }
  }
}
