
import {
  ConflictException,
  Inject,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
}

interface AuthenticateUserResponse {
  authenticated: boolean;
  userId: string;
  email: string;
  roles: string[];
}

interface UserGrpcService {
  createUser(input: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Observable<UserResponse>;

  authenticateUser(input: {
    email: string;
    password: string;
  }): Observable<AuthenticateUserResponse>;
}

@Injectable()
export class AuthService {
  private userService!: UserGrpcService;

  constructor(
    @Inject('USER_SERVICE') private readonly client: ClientGrpc,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  onModuleInit(): void {
    this.userService =
      this.client.getService<UserGrpcService>('UserService');
  }

  async register(input: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    try {
      const user = await firstValueFrom(
        this.userService.createUser(input),
      );

      return {
        user,
        accessToken: await this.issueAccessToken(user.id, user.email, ['customer']),
      };
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 6
      ) {
        throw new ConflictException('Email is already registered');
      }

      if (
        error instanceof ConflictException ||
        error instanceof ServiceUnavailableException
      ) {
        throw error;
      }

      throw new ServiceUnavailableException(
        'User service could not complete registration',
      );
    }
  }

  async login(input: { email: string; password: string }) {
    try {
      const result = await firstValueFrom(
        this.userService.authenticateUser(input),
      );

      if (!result.authenticated || !result.userId || !result.email) {
        throw new UnauthorizedException('Invalid email or password');
      }

      return {
        accessToken: await this.issueAccessToken(
          result.userId,
          result.email,
          result.roles?.length ? result.roles : ['customer'],
        ),
      };
    } catch (error: unknown) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 16
      ) {
        throw new UnauthorizedException('Invalid email or password');
      }

      throw new ServiceUnavailableException(
        'User service could not complete login',
      );
    }
  }

  private async issueAccessToken(
    userId: string,
    email: string,
    roles: string[],
  ): Promise<string> {
    return this.jwt.signAsync({
      sub: userId,
      email,
      roles,
    });
  }
}
