import { describe, it, expect } from 'vitest';
import { validateInput } from './input-validator';
import { getDefaultProvider } from '../../config/env';

describe('validateInput', () => {
  it('accepts valid input', () => {
    const result = validateInput({ message: 'Hello', userId: 'U-001' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.message).toBe('Hello');
      expect(result.data.userId).toBe('U-001');
      expect(result.data.provider).toBe(getDefaultProvider());
    }
  });

  it('rejects empty message', () => {
    const result = validateInput({ message: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('empty');
    }
  });

  it('rejects missing message', () => {
    const result = validateInput({});
    expect(result.success).toBe(false);
  });

  it('rejects message exceeding max length', () => {
    const result = validateInput({ message: 'a'.repeat(3000) });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('maximum length');
    }
  });

  it('defaults userId to anonymous', () => {
    const result = validateInput({ message: 'Hello' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.userId).toBe('anonymous');
    }
  });

  it('accepts deepseek provider', () => {
    const result = validateInput({ message: 'Hello', provider: 'deepseek' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.provider).toBe('deepseek');
    }
  });

  it('rejects invalid provider', () => {
    const result = validateInput({ message: 'Hello', provider: 'invalid' });
    expect(result.success).toBe(false);
  });
});
