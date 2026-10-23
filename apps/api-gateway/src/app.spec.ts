import { CircuitBreakerService } from './common/circuit-breaker.service';

describe('CircuitBreakerService', () => {
  let service: CircuitBreakerService;

  beforeEach(() => {
    service = new CircuitBreakerService();
  });

  it('executes operation successfully', async () => {
    const result = await service.execute('test', async () => 'ok');
    expect(result).toBe('ok');
  });

  it('opens circuit after threshold failures', async () => {
    const failing = () =>
      service.execute('svc', async () => {
        throw new Error('down');
      });

    for (let i = 0; i < 5; i++) {
      await expect(failing()).rejects.toThrow('down');
    }

    await expect(failing()).rejects.toThrow('Circuit open for svc');
  });
});
