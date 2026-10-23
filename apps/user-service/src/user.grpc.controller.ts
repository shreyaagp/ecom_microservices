
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { UserService } from './user.service';

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
interface AuthenticateUserRequest {
  email: string;
  password: string;
}

@Controller()
export class UserGrpcController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'CreateUser')
  createUser(request: CreateUserRequest) {
    return this.userService.createUser(request);
  }

  @GrpcMethod('UserService', 'GetUser')
  getUser(request: GetUserRequest) {
    return this.userService.getUser(request.userId);
  }

  @GrpcMethod('UserService', 'ValidateToken')
  validateToken(request: ValidateTokenRequest) {
    return this.userService.validateToken(request.token);
  }

  @GrpcMethod('UserService', 'UpdateUser')
  updateUser(request: UpdateUserRequest) {
    return this.userService.updateUser(request.userId, {
      firstName: request.firstName,
      lastName: request.lastName,
    });
  }
  @GrpcMethod('UserService', 'AuthenticateUser')
  authenticateUser(request: AuthenticateUserRequest) {
    return this.userService.authenticateUser(request.email, request.password);
}

}
