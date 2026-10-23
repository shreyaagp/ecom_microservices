import { AppService } from './app.service';

describe('AppService', () => {
  it('returns service health payload', () => {
    const service = new AppService();
    const result = service.getHealth();

    expect(result.status).toBe('ok');
    expect(result.service).toBe('inventory-service');
  });
});
