import { ILanguageModelProvider } from './provider.interface';
import { OpenAIProvider } from './openai.provider';
import { DeepSeekProvider } from './deepseek.provider';

const providers: Record<string, () => ILanguageModelProvider> = {
  openai: () => new OpenAIProvider(),
  deepseek: () => new DeepSeekProvider(),
};

// Cache instances
const instances = new Map<string, ILanguageModelProvider>();

export function selectProvider(provider: string): ILanguageModelProvider {
  const key = provider.toLowerCase();
  const factory = providers[key];

  if (!factory) {
    throw new Error(`Provider "${provider}" is not supported. Available: ${Object.keys(providers).join(', ')}`);
  }

  if (!instances.has(key)) {
    instances.set(key, factory());
  }

  return instances.get(key)!;
}
