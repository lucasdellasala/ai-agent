import { describe, it, expect } from 'vitest';
import { sanitizeInput } from './sanitization';

describe('sanitizeInput', () => {
  it('preserves normal text', () => {
    expect(sanitizeInput('Hola, quiero mi pedido')).toBe('Hola, quiero mi pedido');
  });

  it('strips control characters', () => {
    expect(sanitizeInput('Hello\x00World\x07!')).toBe('HelloWorld!');
  });

  it('preserves newlines and tabs', () => {
    expect(sanitizeInput('Line 1\nLine 2\tTabbed')).toBe('Line 1\nLine 2\tTabbed');
  });

  it('removes zero-width spaces', () => {
    expect(sanitizeInput('Hello\u200BWorld')).toBe('HelloWorld');
  });

  it('removes BOM', () => {
    expect(sanitizeInput('\uFEFFHello')).toBe('Hello');
  });

  it('trims whitespace', () => {
    expect(sanitizeInput('  Hello  ')).toBe('Hello');
  });

  it('normalizes unicode', () => {
    // é composed vs decomposed
    const composed = '\u00e9'; // é
    const decomposed = '\u0065\u0301'; // e + combining accent
    expect(sanitizeInput(decomposed)).toBe(composed);
  });
});
