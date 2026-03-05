import { trace, SpanStatusCode, Span } from '@opentelemetry/api';
import { LLMCallMetadata } from '../llm/provider.interface';
import { llmTokensTotal, llmCostUsd, llmLatencyMs, llmRequestsTotal, llmErrorsTotal } from './metrics';
import { logger, hashPrompt } from './logger';

const tracer = trace.getTracer('ai-agent');

interface LLMSpanOptions {
  operation: string;
  model: string;
  promptContent?: string;
}

/** Wraps an async LLM call with OpenTelemetry tracing and metrics */
export async function withLLMSpan<T extends { metadata: LLMCallMetadata }>(
  options: LLMSpanOptions,
  fn: () => Promise<T>,
): Promise<T> {
  return tracer.startActiveSpan(`llm.${options.operation}`, async (span: Span) => {
    span.setAttribute('llm.model', options.model);
    span.setAttribute('llm.operation', options.operation);
    if (options.promptContent) {
      span.setAttribute('llm.prompt_hash', hashPrompt(options.promptContent));
    }

    llmRequestsTotal.add(1, { model: options.model, operation: options.operation });

    try {
      const result = await fn();
      const { metadata } = result;

      span.setAttribute('llm.tokens.prompt', metadata.promptTokens);
      span.setAttribute('llm.tokens.completion', metadata.completionTokens);
      span.setAttribute('llm.tokens.total', metadata.totalTokens);
      span.setAttribute('llm.cost_usd', metadata.costUsd);
      span.setAttribute('llm.latency_ms', metadata.latencyMs);
      span.setAttribute('llm.finish_reason', metadata.finishReason);

      llmTokensTotal.add(metadata.totalTokens, { model: options.model });
      llmCostUsd.add(metadata.costUsd, { model: options.model });
      llmLatencyMs.record(metadata.latencyMs, { model: options.model });

      logger.info({
        operation: options.operation,
        model: metadata.model,
        promptHash: options.promptContent ? hashPrompt(options.promptContent) : undefined,
        tokens: { prompt: metadata.promptTokens, completion: metadata.completionTokens, total: metadata.totalTokens },
        costUsd: metadata.costUsd,
        latencyMs: metadata.latencyMs,
        finishReason: metadata.finishReason,
      }, 'LLM call completed');

      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: String(error) });
      llmErrorsTotal.add(1, { model: options.model, operation: options.operation });
      logger.error({ error, operation: options.operation, model: options.model }, 'LLM call failed');
      throw error;
    } finally {
      span.end();
    }
  });
}
