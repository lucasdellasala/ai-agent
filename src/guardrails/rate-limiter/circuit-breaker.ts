import { env } from '../../config/env';

type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

/**
 * Circuit breaker for LLM provider calls.
 * CLOSED (normal) → OPEN (after threshold failures) → HALF_OPEN (after timeout) → CLOSED (on success)
 */
export class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failures = 0;
  private lastFailureTime = 0;
  private readonly threshold: number;
  private readonly timeoutMs: number;

  constructor(threshold = env.CIRCUIT_BREAKER_THRESHOLD, timeoutMs = env.CIRCUIT_BREAKER_TIMEOUT_MS) {
    this.threshold = threshold;
    this.timeoutMs = timeoutMs;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime >= this.timeoutMs) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN — LLM provider temporarily unavailable');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  getState(): CircuitState {
    return this.state;
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
    }
  }
}

export const circuitBreaker = new CircuitBreaker();
