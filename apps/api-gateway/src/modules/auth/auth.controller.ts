
import {
  Body,
  Controller,
  NotImplementedException,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Authenticate user and issue an access token' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  refresh(): never {
    throw new NotImplementedException('Refresh-token rotation is not implemented');
  }

  @Post('logout')
  logout(): never {
    throw new NotImplementedException('Logout invalidation is not implemented');
  }

  @Post('forgot-password')
  forgotPassword(@Body() _dto: ForgotPasswordDto): never {
    throw new NotImplementedException('Password reset is not implemented');
  }

  @Post('reset-password')
  resetPassword(@Body() _dto: ResetPasswordDto): never {
    throw new NotImplementedException('Password reset is not implemented');
  }
}
