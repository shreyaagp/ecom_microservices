import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/** DTO for creating a payment intent. */
export class CreatePaymentIntentDto {
  @ApiProperty({ example: 'order-uuid-123' })
  @IsString()
  @IsNotEmpty()
  orderId!: string;

  @ApiPropertyOptional({ example: 'usd', default: 'usd' })
  @IsString()
  @IsOptional()
  currency?: string;
}

/** DTO for confirming a payment. */
export class ConfirmPaymentDto {
  @ApiProperty({ example: 'pi_3abc123' })
  @IsString()
  @IsNotEmpty()
  paymentIntentId!: string;

  @ApiProperty({ example: 'pm_card_visa' })
  @IsString()
  @IsNotEmpty()
  paymentMethodId!: string;
}
