import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Parameter decorator that extracts the authenticated user from the request.
 *
 * @example
 * ```ts
 * @Get('me')
 * getProfile(@CurrentUser() user: TokenPayload) { ... }
 *
 * @Get('me')
 * getEmail(@CurrentUser('email') email: string) { ... }
 * ```
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user?: Record<string, unknown> }>();
    const user = request.user;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);
