import { ILanguageModelProvider } from './provider.interface';
import { OpenAIProvider } from './openai.provider';
import { DeepSeekProvider } from './deepseek.provider';
import { env, getAvailableProviders } from '../config/env';

const providerFactories: Record<string, () => ILanguageModelProvider> = {
  ...(env.OPENAI_API_KEY ? { openai: () => new OpenAIProvider() } : {}),
  ...(env.DEEPSEEK_API_KEY ? { deepseek: () => new DeepSeekProvider() } : {}),
};

// Cache instances
const instances = new Map<string, ILanguageModelProvider>();

export function selectProvider(provider: string): ILanguageModelProvider {
  const key = provider.toLowerCase();
  const factory = providerFactories[key];

  if (!factory) {
    const available = getAvailableProviders();
    throw new Error(`Provider "${provider}" is not available. Configured providers: ${available.join(', ')}`);
  }

  if (!instances.has(key)) {
    instances.set(key, factory());
  }

  return instances.get(key)!;
}
