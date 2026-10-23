import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): { service: string; status: string; timestamp: string } {
    return {
      service: 'user-service',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
