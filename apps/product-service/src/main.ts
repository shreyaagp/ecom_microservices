import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { HttpExceptionFilter, LoggingInterceptor, defaultValidationPipe } from '@app/common';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('product-service');

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(defaultValidationPipe);

  const port = configService.get<number>('PORT', 3002);
  await app.listen(port);

  logger.log('product-service listening on port ' + port);
}

void bootstrap();
