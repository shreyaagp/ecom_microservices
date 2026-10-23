import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@app/common';

import { AddCartItemDto, UpdateCartItemDto } from './dto/cart.dto';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  /** Get the current user's shopping cart with items and totals. */
  @Get()
  @ApiOperation({ summary: 'Get current user cart' })
  getCart(): Record<string, unknown> {
    return { route: 'get-cart' };
  }

  /** Add a product variant to the cart. */
  @Post('items')
  @ApiOperation({ summary: 'Add cart item' })
  addItem(@Body() dto: AddCartItemDto): Record<string, unknown> {
    return { route: 'add-cart-item', productId: dto.productId, quantity: dto.quantity };
  }

  /** Update the quantity of an existing cart item. */
  @Patch('items/:productId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  updateItem(
    @Param('productId') productId: string,
    @Body() dto: UpdateCartItemDto,
  ): Record<string, unknown> {
    return { route: 'update-cart-item', productId, quantity: dto.quantity };
  }

  /** Remove a product from the cart. */
  @Delete('items/:productId')
  @ApiOperation({ summary: 'Remove cart item' })
  removeItem(@Param('productId') productId: string): Record<string, unknown> {
    return { route: 'remove-cart-item', productId };
  }

  /** Clear all items from the cart. */
  @Delete()
  @ApiOperation({ summary: 'Clear cart' })
  clear(): Record<string, unknown> {
    return { route: 'clear-cart' };
  }
}
