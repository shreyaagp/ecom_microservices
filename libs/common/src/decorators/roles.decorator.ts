import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Decorator that assigns required roles to a route handler.
 * Use with a corresponding `RolesGuard` to enforce role-based access control.
 *
 * @example
 * ```ts
 * @Roles('admin')
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @Delete(':id')
 * remove(@Param('id') id: string) { ... }
 * ```
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
