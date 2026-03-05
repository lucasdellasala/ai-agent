import { describe, it, expect } from 'vitest';
import { CircuitBreaker } from './circuit-breaker';

describe('CircuitBreaker', () => {
  it('starts in CLOSED state', () => {
    const cb = new CircuitBreaker(3, 100);
    expect(cb.getState()).toBe('CLOSED');
  });

  it('allows calls in CLOSED state', async () => {
    const cb = new CircuitBreaker(3, 100);
    const result = await cb.execute(() => Promise.resolve('ok'));
    expect(result).toBe('ok');
  });

  it('opens after threshold failures', async () => {
    const cb = new CircuitBreaker(2, 100);
    const fail = () => Promise.reject(new Error('fail'));

    await expect(cb.execute(fail)).rejects.toThrow('fail');
    await expect(cb.execute(fail)).rejects.toThrow('fail');

    expect(cb.getState()).toBe('OPEN');
    await expect(cb.execute(() => Promise.resolve('ok'))).rejects.toThrow('Circuit breaker is OPEN');
  });

  it('transitions to HALF_OPEN after timeout', async () => {
    const cb = new CircuitBreaker(1, 10); // 10ms timeout
    await expect(cb.execute(() => Promise.reject(new Error('fail')))).rejects.toThrow();
    expect(cb.getState()).toBe('OPEN');

    await new Promise((r) => setTimeout(r, 15));

    // Should attempt the call (HALF_OPEN)
    const result = await cb.execute(() => Promise.resolve('recovered'));
    expect(result).toBe('recovered');
    expect(cb.getState()).toBe('CLOSED');
  });

  it('re-opens on failure in HALF_OPEN state', async () => {
    const cb = new CircuitBreaker(1, 10);
    await expect(cb.execute(() => Promise.reject(new Error('fail')))).rejects.toThrow();

    await new Promise((r) => setTimeout(r, 15));

    await expect(cb.execute(() => Promise.reject(new Error('still failing')))).rejects.toThrow('still failing');
    expect(cb.getState()).toBe('OPEN');
  });
});
