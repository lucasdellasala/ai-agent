import { describe, it, expect } from 'vitest';
import { selectProvider } from './provider.selector';

describe('selectProvider', () => {
  it('returns OpenAI provider', () => {
    const provider = selectProvider('openai');
    expect(provider).toBeDefined();
    expect(provider.getMessageIntent).toBeTypeOf('function');
    expect(provider.createFriendlyResponse).toBeTypeOf('function');
  });

  it('returns DeepSeek provider', () => {
    const provider = selectProvider('deepseek');
    expect(provider).toBeDefined();
  });

  it('is case-insensitive', () => {
    const provider = selectProvider('OpenAI');
    expect(provider).toBeDefined();
  });

  it('throws for unknown provider', () => {
    expect(() => selectProvider('anthropic')).toThrow('not supported');
  });
});
