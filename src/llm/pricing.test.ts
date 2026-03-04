import { describe, it, expect } from 'vitest';
import { calculateCost } from './pricing';

describe('calculateCost', () => {
  it('calculates gpt-4o cost', () => {
    // 1000 prompt tokens at $2.50/M + 500 completion tokens at $10.00/M
    const cost = calculateCost('gpt-4o', 1000, 500);
    expect(cost).toBeCloseTo(0.0025 + 0.005, 6);
  });

  it('calculates gpt-4o-mini cost', () => {
    const cost = calculateCost('gpt-4o-mini', 1000, 500);
    expect(cost).toBeCloseTo(0.00015 + 0.0003, 6);
  });

  it('calculates deepseek-chat cost', () => {
    const cost = calculateCost('deepseek-chat', 1000, 500);
    expect(cost).toBeCloseTo(0.00014 + 0.00014, 6);
  });

  it('returns 0 for unknown model', () => {
    expect(calculateCost('unknown-model', 1000, 500)).toBe(0);
  });

  it('returns 0 for zero tokens', () => {
    expect(calculateCost('gpt-4o', 0, 0)).toBe(0);
  });
});
