import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import {
  HttpExceptionFilter,
  LoggingInterceptor,
  ResponseEnvelopeInterceptor,
  defaultValidationPipe,
} from '@app/common';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('api-gateway');

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor(), new ResponseEnvelopeInterceptor());
  app.useGlobalPipes(defaultValidationPipe);
  app.setGlobalPrefix('api/v1');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('E-Commerce API Gateway')
    .setDescription('HTTP entrypoint for NestJS e-commerce microservices')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument);

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  logger.log(`api-gateway listening on port ${port}`);
}

void bootstrap();
