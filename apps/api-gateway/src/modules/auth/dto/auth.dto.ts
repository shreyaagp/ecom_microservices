import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

/** Request body for user registration. */
export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'StrongP@ss1' })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName!: string;
}

/** Request body for user login. */
export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'StrongP@ss1' })
  @IsString()
  password!: string;
}

/** Request body for token refresh. */
export class RefreshTokenDto {
  @ApiProperty({ description: 'The refresh token' })
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}

/** Request body for forgot-password flow. */
export class ForgotPasswordDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;
}

/** Request body for password reset. */
export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token!: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  newPassword!: string;
}

/** Request body for logout. */
export class LogoutDto {
  @ApiPropertyOptional({ description: 'Optional refresh token to invalidate' })
  @IsString()
  refreshToken?: string;
}
