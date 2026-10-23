import { Injectable } from '@nestjs/common';

interface CircuitState {
  failures: number;
  openUntil?: number;
}

/**
 * Simple in-memory circuit breaker to protect downstream service calls.
 *
 * State transitions:
 * - **Closed** → records failures; opens after `threshold` consecutive failures.
 * - **Open** → rejects all calls until `resetTimeoutMs` elapses.
 * - **Half-Open** → allows one probe call; success closes, failure re-opens.
 */
@Injectable()
export class CircuitBreakerService {
  private readonly states = new Map<string, CircuitState>();
  private readonly threshold = 5;
  private readonly resetTimeoutMs = 30_000;

  /**
   * Execute an operation through the circuit breaker.
   *
   * @param serviceKey - Unique key identifying the downstream service.
   * @param operation  - The async operation to execute.
   * @returns The operation result on success.
   * @throws Error if the circuit is open or the operation fails.
   */
  async execute<T>(serviceKey: string, operation: () => Promise<T>): Promise<T> {
    const state = this.states.get(serviceKey) ?? { failures: 0 };

    if (state.openUntil && Date.now() < state.openUntil) {
      throw new Error(`Circuit open for ${serviceKey}`);
    }

    try {
      const result = await operation();
      this.states.set(serviceKey, { failures: 0 });
      return result;
    } catch (error) {
      const failures = state.failures + 1;
      this.states.set(serviceKey, {
        failures,
        openUntil: failures >= this.threshold ? Date.now() + this.resetTimeoutMs : undefined,
      });
      throw error;
    }
  }
}
