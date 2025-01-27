import { ILanguageModelProvider } from "./provider.interface";
import { OpenAIProvider } from "./openai/openai.provider";
import { DeepSeekProvider } from "./deepseek/deepseek.provider";

const openAIProvider = new OpenAIProvider();
const deepseekProvider = new DeepSeekProvider();

const providers: Record<string, ILanguageModelProvider> = {
  openai: openAIProvider,
  deepseek: deepseekProvider,
};

export function selectProvider(provider: string): ILanguageModelProvider {
  const selectedProvider = providers[provider.toLowerCase()];
  if (!selectedProvider) {
    throw new Error(`Provider "${provider}" is not supported.`);
  }
  return selectedProvider;
}
