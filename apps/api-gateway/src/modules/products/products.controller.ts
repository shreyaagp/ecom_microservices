import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@app/common';

import { CreateProductDto, CreateReviewDto, UpdateProductDto } from './dto/products.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  /** List products with pagination and optional category/tag filtering. */
  @Get()
  @ApiOperation({ summary: 'List products with pagination and filtering' })
  list(@Query() query: Record<string, unknown>): Record<string, unknown> {
    return { route: 'list-products', query };
  }

  /** Create a new product (admin-only). */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create product (admin)' })
  create(@Body() dto: CreateProductDto): Record<string, unknown> {
    return { route: 'create-product', name: dto.name };
  }

  /** Full-text search for products via Elasticsearch. */
  @Get('search')
  @ApiOperation({ summary: 'Search products in Elasticsearch' })
  search(@Query() query: Record<string, unknown>): Record<string, unknown> {
    return { route: 'search-products', query };
  }

  /** Fetch a single product by its unique ID. */
  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  getById(@Param('id') id: string): Record<string, unknown> {
    return { route: 'get-product', id };
  }

  /** Partially update an existing product (admin-only). */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product (admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateProductDto): Record<string, unknown> {
    return { route: 'update-product', id, name: dto.name };
  }

  /** Soft-delete a product (admin-only). */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product (admin)' })
  remove(@Param('id') id: string): Record<string, unknown> {
    return { route: 'delete-product', id };
  }

  /** List all reviews for a specific product. */
  @Get(':id/reviews')
  @ApiOperation({ summary: 'List product reviews' })
  listReviews(@Param('id') id: string): Record<string, unknown> {
    return { route: 'list-reviews', id };
  }

  /** Submit a review for a product (authenticated users). */
  @Post(':id/reviews')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create product review' })
  createReview(@Param('id') id: string, @Body() dto: CreateReviewDto): Record<string, unknown> {
    return { route: 'create-review', id, rating: dto.rating };
  }
}
