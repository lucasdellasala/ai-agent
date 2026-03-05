export interface LLMCallMetadata {
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
  costUsd: number;
  finishReason: string;
}

export interface IntentClassificationResult {
  types: string[];
  details: {
    orderIds?: string[];
    products?: string[];
    reasons?: string[];
  };
  function_calls?: Array<{
    name: string;
    parameters: Record<string, unknown>;
  }>;
  metadata: LLMCallMetadata;
}

export interface FriendlyResponseResult {
  content: string;
  metadata: LLMCallMetadata;
}

export interface ILanguageModelProvider {
  getMessageIntent(userMessage: string): Promise<IntentClassificationResult>;
  createFriendlyResponse(initialMessage: string, userName?: string): Promise<FriendlyResponseResult>;
}
