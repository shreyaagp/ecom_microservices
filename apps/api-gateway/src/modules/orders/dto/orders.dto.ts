import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/** DTO for creating an order from the current cart. */
export class CreateOrderDto {
  @ApiProperty({ example: 'addr-uuid-1', description: 'Shipping address ID' })
  @IsString()
  @IsNotEmpty()
  shippingAddressId!: string;

  @ApiPropertyOptional({ example: 'Leave at the door' })
  @IsString()
  @IsOptional()
  notes?: string;
}
