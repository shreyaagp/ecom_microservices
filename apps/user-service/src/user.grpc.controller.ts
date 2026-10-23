import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface GetUserRequest {
  userId: string;
}

interface ValidateTokenRequest {
  token: string;
}

interface UpdateUserRequest {
  userId: string;
  firstName: string;
  lastName: string;
}

interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
}

interface TokenPayload {
  sub: string;
  email: string;
  roles: string[];
}

/**
 * gRPC server implementation for the UserService.
 *
 * Provides: `CreateUser`, `GetUser`, `ValidateToken`, `UpdateUser`.
 * Methods return stub data — replace with repository calls in production.
 */
@Controller()
export class UserGrpcController {
  /** Create a new user account and return the user record. */
  @GrpcMethod('UserService', 'CreateUser')
  createUser(request: CreateUserRequest): UserResponse {
    return {
      id: 'stub-user-id',
      email: request.email,
      firstName: request.firstName,
      lastName: request.lastName,
      isEmailVerified: false,
    };
  }

  /** Look up a user by ID. */
  @GrpcMethod('UserService', 'GetUser')
  getUser(request: GetUserRequest): UserResponse {
    return {
      id: request.userId,
      email: 'user@example.com',
      firstName: 'Demo',
      lastName: 'User',
      isEmailVerified: true,
    };
  }

  /** Validate a JWT and return the decoded payload. */
  @GrpcMethod('UserService', 'ValidateToken')
  validateToken(_request: ValidateTokenRequest): TokenPayload {
    return {
      sub: 'stub-user-id',
      email: 'user@example.com',
      roles: ['customer'],
    };
  }

  /** Update a user's profile fields. */
  @GrpcMethod('UserService', 'UpdateUser')
  updateUser(request: UpdateUserRequest): UserResponse {
    return {
      id: request.userId,
      email: 'user@example.com',
      firstName: request.firstName,
      lastName: request.lastName,
      isEmailVerified: true,
    };
  }
}
