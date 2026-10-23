
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(() => {
    service = new AppService();
  });

  it('returns service health payload', () => {
    const result = service.getHealth();

    expect(result).toMatchObject({
      service: 'search-service',
      status: 'ok',
    });
  });

  it('returns a valid ISO-8601 timestamp', () => {
    const result = service.getHealth();

    expect(result.timestamp).toBe(new Date(result.timestamp).toISOString());
    expect(Number.isNaN(Date.parse(result.timestamp))).toBe(false);
  });
});
