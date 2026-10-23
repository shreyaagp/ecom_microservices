
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface JwtPayload {
  sub: string;
  email: string;
  roles?: string[];
}

interface AuthenticatedRequest {
  headers: {
    authorization?: string;
  };
  user?: JwtPayload;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): 
  Promise<boolean> {
    console.log('[JWT GUARD] canActivate executed');
    const request =
      context.switchToHttp().getRequest<AuthenticatedRequest>();

    const header = request.headers.authorization;

    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Bearer token is required');
    }

    const token = header.slice('Bearer '.length).trim();

    if (!token) {
      throw new UnauthorizedException('Bearer token is required');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

      if (
        typeof payload.sub !== 'string' ||
        !payload.sub ||
        typeof payload.email !== 'string' ||
        !payload.email
      ) {
        throw new UnauthorizedException('Invalid token payload');
      }

      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
