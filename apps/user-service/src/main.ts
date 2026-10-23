import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { HttpExceptionFilter, LoggingInterceptor, defaultValidationPipe } from '@app/common';

import { AppModule } from './app.module';
import { userGrpcOptions } from './grpc.options';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('user-service');

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(defaultValidationPipe);

  const grpcUrl = configService.get<string>('USER_GRPC_URL', '0.0.0.0:50051');
  app.connectMicroservice(userGrpcOptions(grpcUrl));
  await app.startAllMicroservices();

  const port = configService.get<number>('PORT', 3001);
  await app.listen(port);

  logger.log('user-service listening on port ' + port);
}

void bootstrap();
