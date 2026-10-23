
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Pool, PoolClient } from 'pg';
import {
  randomUUID,
  scrypt as scryptCallback,
  timingSafeEqual,
} from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(scryptCallback);

export interface UserRecord {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  is_email_verified: boolean;
  roles: string[];
}

@Injectable()
export class UserService {
  private readonly pool: Pool;

  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {
    const connectionString = this.config.get<string>('DATABASE_URL');

    if (!connectionString) {
      throw new Error('DATABASE_URL must be configured');
    }

    this.pool = new Pool({ connectionString });
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = randomUUID();
    const key = (await scrypt(password, salt, 64)) as Buffer;

    return `${salt}:${key.toString('hex')}`;
  }

  async verifyPassword(
    password: string,
    storedHash: string,
  ): Promise<boolean> {
    const [salt, storedKeyHex] = storedHash.split(':');

    if (!salt || !storedKeyHex || !/^[a-f0-9]{128}$/i.test(storedKeyHex)) {
      return false;
    }

    const storedKey = Buffer.from(storedKeyHex, 'hex');
    const suppliedKey = (await scrypt(password, salt, 64)) as Buffer;

    return timingSafeEqual(storedKey, suppliedKey);
  }

  private toPublicUser(user: UserRecord) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      isEmailVerified: user.is_email_verified,
    };
  }

  async createUser(input: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    const email = input.email.trim().toLowerCase();
    const passwordHash = await this.hashPassword(input.password);
    const client: PoolClient = await this.pool.connect();

    try {
      const result = await client.query<UserRecord>(
        `INSERT INTO users
          (id, email, password_hash, first_name, last_name)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, email, password_hash, first_name,
                   last_name, is_email_verified, roles`,
        [
          randomUUID(),
          email,
          passwordHash,
          input.firstName.trim(),
          input.lastName.trim(),
        ],
      );

      return this.toPublicUser(result.rows[0]);
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === '23505'
      ) {
        throw new ConflictException('Email is already registered');
      }

      throw new InternalServerErrorException('Could not create user');
    } finally {
      client.release();
    }
  }

  async getUser(userId: string) {
    const result = await this.pool.query<UserRecord>(
      `SELECT id, email, password_hash, first_name,
              last_name, is_email_verified, roles
       FROM users WHERE id = $1`,
      [userId],
    );

    if (!result.rows[0]) {
      throw new NotFoundException('User not found');
    }

    return this.toPublicUser(result.rows[0]);
  }

  async updateUser(
    userId: string,
    input: { firstName: string; lastName: string },
  ) {
    const result = await this.pool.query<UserRecord>(
      `UPDATE users
       SET first_name = $2, last_name = $3, updated_at = NOW()
       WHERE id = $1
       RETURNING id, email, password_hash, first_name,
                 last_name, is_email_verified, roles`,
      [userId, input.firstName.trim(), input.lastName.trim()],
    );

    if (!result.rows[0]) {
      throw new NotFoundException('User not found');
    }

    return this.toPublicUser(result.rows[0]);
  }

  async validateToken(token: string) {
    try {
      const payload = await this.jwt.verifyAsync<{
        sub: string;
        email: string;
        roles?: string[];
      }>(token);

      if (!payload.sub || !payload.email) {
        throw new UnauthorizedException('Invalid token payload');
      }

      return {
        sub: payload.sub,
        email: payload.email,
        roles: payload.roles ?? ['customer'],
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async authenticateUser(emailInput: string, password: string) {
    const email = emailInput.trim().toLowerCase();

    const result = await this.pool.query<UserRecord>(
      `SELECT id, email, password_hash, first_name,
              last_name, is_email_verified, roles
       FROM users WHERE email = $1`,
      [email],
    );

    const user = result.rows[0];

    if (!user || !(await this.verifyPassword(password, user.password_hash))) {
        return {
            authenticated: false,
            userId: '',
            email: '',
            roles: [],
        };
    }

    return {
      authenticated: true,
      userId: user.id,
      email: user.email,
      roles: user.roles,
    };
  }

}
