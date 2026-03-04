import { metrics } from '@opentelemetry/api';

const meter = metrics.getMeter('ai-agent');

export const llmTokensTotal = meter.createCounter('llm.tokens.total', {
  description: 'Total tokens consumed across all LLM calls',
});

export const llmCostUsd = meter.createCounter('llm.cost.usd', {
  description: 'Total cost in USD across all LLM calls',
});

export const llmLatencyMs = meter.createHistogram('llm.latency.ms', {
  description: 'LLM call latency in milliseconds',
  unit: 'ms',
});

export const llmErrorsTotal = meter.createCounter('llm.errors.total', {
  description: 'Total LLM call errors',
});

export const llmRequestsTotal = meter.createCounter('llm.requests.total', {
  description: 'Total LLM requests by model and operation',
});
