import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

/** DTO for adding an item to the cart. */
export class AddCartItemDto {
  @ApiProperty({ example: 'product-uuid-123' })
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @ApiProperty({ example: 'SKU-BLK-M' })
  @IsString()
  @IsNotEmpty()
  sku!: string;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity!: number;
}

/** DTO for updating a cart item's quantity. */
export class UpdateCartItemDto {
  @ApiProperty({ example: 3, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity!: number;
}
