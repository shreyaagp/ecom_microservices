import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/** A single product variant used during product creation / update. */
export class ProductVariantDto {
  @ApiProperty({ example: 'SKU-BLK-M' })
  @IsString()
  @IsNotEmpty()
  sku!: string;

  @ApiProperty({ example: 'Black / Medium' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 29.99 })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiPropertyOptional({ example: { color: 'black', size: 'M' } })
  @IsOptional()
  attributes?: Record<string, string>;
}

/** DTO for creating a new product. */
export class CreateProductDto {
  @ApiProperty({ example: 'Classic T-Shirt' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'A comfortable everyday t-shirt.' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ example: 'clothing' })
  @IsString()
  @IsNotEmpty()
  category!: string;

  @ApiPropertyOptional({ example: ['t-shirt', 'apparel'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ type: [ProductVariantDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  variants!: ProductVariantDto[];
}

/** DTO for updating an existing product (all fields optional). */
export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'Classic T-Shirt V2' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'Updated description.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'clothing' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ example: ['t-shirt'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ type: [ProductVariantDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  @IsOptional()
  variants?: ProductVariantDto[];
}

/** DTO for creating a product review. */
export class CreateReviewDto {
  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  rating!: number;

  @ApiPropertyOptional({ example: 'Great product!' })
  @IsString()
  @IsOptional()
  comment?: string;
}
