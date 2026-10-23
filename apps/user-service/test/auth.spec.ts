import { UserGrpcController } from '../src/user.grpc.controller';

describe('UserGrpcController', () => {
  let controller: UserGrpcController;

  beforeEach(() => {
    controller = new UserGrpcController();
  });

  describe('CreateUser', () => {
    it('should return a user response with the provided email', () => {
      const result = controller.createUser({
        email: 'test@example.com',
        password: 'StrongP@ss1',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(result.email).toBe('test@example.com');
      expect(result.firstName).toBe('John');
      expect(result.lastName).toBe('Doe');
      expect(result.isEmailVerified).toBe(false);
      expect(result.id).toBeDefined();
    });
  });

  describe('GetUser', () => {
    it('should return a user by userId', () => {
      const result = controller.getUser({ userId: 'user-123' });

      expect(result.id).toBe('user-123');
      expect(result.email).toBeDefined();
    });
  });

  describe('ValidateToken', () => {
    it('should return a token payload with roles', () => {
      const result = controller.validateToken({ token: 'some-jwt-token' });

      expect(result.sub).toBeDefined();
      expect(result.email).toBeDefined();
      expect(result.roles).toEqual(expect.arrayContaining(['customer']));
    });
  });

  describe('UpdateUser', () => {
    it('should return updated user fields', () => {
      const result = controller.updateUser({
        userId: 'user-123',
        firstName: 'Jane',
        lastName: 'Smith',
      });

      expect(result.id).toBe('user-123');
      expect(result.firstName).toBe('Jane');
      expect(result.lastName).toBe('Smith');
    });
  });
});
