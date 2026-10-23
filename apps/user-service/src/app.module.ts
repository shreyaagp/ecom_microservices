
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserGrpcController } from './user.grpc.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>('JWT_SECRET');

        if (!secret || secret === 'change-me-in-production') {
          throw new Error('Configure a secure JWT_SECRET before starting');
        }

        return {
          secret,
          signOptions: {
            expiresIn: Number(config.get('JWT_EXPIRATION', '3600')),
          },
        };
      },
    }),
  ],
  controllers: [AppController, UserGrpcController],
  providers: [AppService, UserService],
})
export class AppModule {}
