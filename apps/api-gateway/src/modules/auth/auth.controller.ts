import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  ForgotPasswordDto,
  LoginDto,
  LogoutDto,
  RefreshTokenDto,
  RegisterDto,
  ResetPasswordDto,
} from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  /** Register a new user account and return tokens. */
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  register(@Body() dto: RegisterDto): Record<string, unknown> {
    return { route: 'register', email: dto.email };
  }

  /** Authenticate with email/password and receive access + refresh tokens. */
  @Post('login')
  @ApiOperation({ summary: 'Authenticate user and issue tokens' })
  login(@Body() dto: LoginDto): Record<string, unknown> {
    return { route: 'login', email: dto.email };
  }

  /** Rotate refresh token and return a new access token. */
  @Post('refresh')
  @ApiOperation({ summary: 'Rotate refresh token' })
  refresh(@Body() dto: RefreshTokenDto): Record<string, unknown> {
    return { route: 'refresh', dto };
  }

  /** Invalidate the current session / refresh token. */
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  logout(@Body() dto: LogoutDto): Record<string, unknown> {
    return { route: 'logout', dto };
  }

  /** Send a password-reset email to the specified address. */
  @Post('forgot-password')
  @ApiOperation({ summary: 'Start forgot password flow' })
  forgotPassword(@Body() dto: ForgotPasswordDto): Record<string, unknown> {
    return { route: 'forgot-password', email: dto.email };
  }

  /** Complete the password-reset flow with a valid token. */
  @Post('reset-password')
  @ApiOperation({ summary: 'Complete password reset flow' })
  resetPassword(@Body() dto: ResetPasswordDto): Record<string, unknown> {
    return { route: 'reset-password', dto };
  }
}
