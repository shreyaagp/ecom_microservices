import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

/**
 * Guard that verifies the presence of a `Bearer` token in the
 * `Authorization` header.  In production, this would validate the JWT
 * against the user-service via gRPC.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  /** Returns `true` if a Bearer token is present in the request headers. */
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      headers?: { authorization?: string };
    }>();
    const header = request.headers?.authorization;
    return Boolean(header && header.startsWith('Bearer '));
  }
}
