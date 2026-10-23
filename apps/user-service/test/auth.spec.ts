
import { UserGrpcController } from '../src/user.grpc.controller';
import { UserService } from '../src/user.service';

describe('UserGrpcController', () => {
  let controller: UserGrpcController;
  let userService: {
    createUser: jest.Mock;
    getUser: jest.Mock;
    validateToken: jest.Mock;
    updateUser: jest.Mock;
  };

  beforeEach(() => {
    userService = {
      createUser: jest.fn(),
      getUser: jest.fn(),
      validateToken: jest.fn(),
      updateUser: jest.fn(),
    };

    controller = new UserGrpcController(
      userService as unknown as UserService,
    );
  });

  describe('CreateUser', () => {
    it('delegates registration to UserService', async () => {
      const input = {
        email: 'test@example.com',
        password: 'StrongP@ss1',
        firstName: 'John',
        lastName: 'Doe',
      };
      const expected = {
        id: 'user-123',
        email: input.email,
        firstName: 'John',
        lastName: 'Doe',
        isEmailVerified: false,
      };

      userService.createUser.mockResolvedValue(expected);

      await expect(controller.createUser(input)).resolves.toEqual(expected);
      expect(userService.createUser).toHaveBeenCalledWith(input);
    });
  });

  describe('GetUser', () => {
    it('delegates lookup to UserService', async () => {
      const expected = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        isEmailVerified: false,
      };

      userService.getUser.mockResolvedValue(expected);

      await expect(
        controller.getUser({ userId: 'user-123' }),
      ).resolves.toEqual(expected);

      expect(userService.getUser).toHaveBeenCalledWith('user-123');
    });
  });

  describe('ValidateToken', () => {
    it('delegates token validation to UserService', async () => {
      const expected = {
        sub: 'user-123',
        email: 'test@example.com',
        roles: ['customer'],
      };

      userService.validateToken.mockResolvedValue(expected);

      await expect(
        controller.validateToken({ token: 'example-token' }),
      ).resolves.toEqual(expected);

      expect(userService.validateToken).toHaveBeenCalledWith(
        'example-token',
      );
    });
  });

  describe('UpdateUser', () => {
    it('delegates profile updates to UserService', async () => {
      const expected = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        isEmailVerified: false,
      };

      userService.updateUser.mockResolvedValue(expected);

      await expect(
        controller.updateUser({
          userId: 'user-123',
          firstName: 'Jane',
          lastName: 'Smith',
        }),
      ).resolves.toEqual(expected);

      expect(userService.updateUser).toHaveBeenCalledWith('user-123', {
        firstName: 'Jane',
        lastName: 'Smith',
      });
    });
  });
});
