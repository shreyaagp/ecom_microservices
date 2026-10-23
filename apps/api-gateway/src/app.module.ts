import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import Redis from 'ioredis';

import { AuthModule } from './modules/auth/auth.module';
import { CartModule } from './modules/cart/cart.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ProductsModule } from './modules/products/products.module';
import { UsersModule } from './modules/users/users.module';
import { CircuitBreakerService } from './common/circuit-breaker.service';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { RedisThrottlerStorage } from './common/redis-throttler.storage';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redis = new Redis(configService.get<string>('REDIS_URL', 'redis://localhost:6379'));
        const storage = new RedisThrottlerStorage(redis);

        return {
          throttlers: [
            {
              limit: 100,
              ttl: 60,
            },
          ],
          storage,
        };
      },
    }),
    AuthModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    PaymentsModule,
    UsersModule,
  ],
  providers: [CircuitBreakerService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
