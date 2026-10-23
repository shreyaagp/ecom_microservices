import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderKafkaHandler } from './messaging/kafka.handler';
import { OrderSagaOrchestrator } from './order-saga.orchestrator';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [AppService, OrderKafkaHandler, OrderSagaOrchestrator],
})
export class AppModule {}
