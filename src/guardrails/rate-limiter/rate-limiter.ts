import { env } from '../../config/env';

interface TokenBucket {
  tokens: number;
  windowStart: number;
}

/**
 * In-memory per-session token budget limiter.
 * Tracks token usage within a sliding window.
 */
export class TokenBudgetLimiter {
  private readonly budgets = new Map<string, TokenBucket>();
  private readonly maxTokens: number;
  private readonly windowMs: number;

  constructor(maxTokens = env.SESSION_TOKEN_BUDGET, windowMs = env.TOKEN_BUDGET_WINDOW_MS) {
    this.maxTokens = maxTokens;
    this.windowMs = windowMs;
  }

  /** Check if a session can consume the requested tokens */
  check(sessionId: string, requestedTokens: number): { allowed: boolean; remaining: number } {
    const bucket = this.getOrCreateBucket(sessionId);
    const remaining = this.maxTokens - bucket.tokens;

    return {
      allowed: remaining >= requestedTokens,
      remaining,
    };
  }

  /** Record token usage for a session */
  consume(sessionId: string, tokens: number): void {
    const bucket = this.getOrCreateBucket(sessionId);
    bucket.tokens += tokens;
  }

  private getOrCreateBucket(sessionId: string): TokenBucket {
    const now = Date.now();
    const existing = this.budgets.get(sessionId);

    // Reset if window expired
    if (existing && now - existing.windowStart >= this.windowMs) {
      this.budgets.delete(sessionId);
    }

    if (!this.budgets.has(sessionId)) {
      this.budgets.set(sessionId, { tokens: 0, windowStart: now });
    }

    return this.budgets.get(sessionId)!;
  }
}

export const tokenBudgetLimiter = new TokenBudgetLimiter();
