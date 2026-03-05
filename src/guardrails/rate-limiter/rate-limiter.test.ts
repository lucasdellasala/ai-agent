import { describe, it, expect } from 'vitest';
import { TokenBudgetLimiter } from './rate-limiter';

describe('TokenBudgetLimiter', () => {
  it('allows requests within budget', () => {
    const limiter = new TokenBudgetLimiter(1000, 60000);
    const result = limiter.check('user-1', 500);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(1000);
  });

  it('tracks consumption', () => {
    const limiter = new TokenBudgetLimiter(1000, 60000);
    limiter.consume('user-1', 600);
    const result = limiter.check('user-1', 500);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(400);
  });

  it('allows requests for different sessions', () => {
    const limiter = new TokenBudgetLimiter(1000, 60000);
    limiter.consume('user-1', 900);
    const result = limiter.check('user-2', 500);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(1000);
  });

  it('resets budget after window expires', () => {
    const limiter = new TokenBudgetLimiter(1000, 1); // 1ms window
    limiter.consume('user-1', 900);

    // Wait for window to expire
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const result = limiter.check('user-1', 500);
        expect(result.allowed).toBe(true);
        expect(result.remaining).toBe(1000);
        resolve();
      }, 5);
    });
  });
});
