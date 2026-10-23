import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@app/common';

import { CreateOrderDto } from './dto/orders.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  /** Create an order from the current user's cart. */
  @Post()
  @ApiOperation({ summary: 'Create order from cart' })
  create(@Body() dto: CreateOrderDto): Record<string, unknown> {
    return { route: 'create-order', shippingAddressId: dto.shippingAddressId };
  }

  /** List orders for the authenticated user with cursor-based pagination. */
  @Get()
  @ApiOperation({ summary: 'List orders for current user' })
  list(@Query() query: Record<string, unknown>): Record<string, unknown> {
    return { route: 'list-orders', query };
  }

  /** Get a single order by its unique ID. */
  @Get(':id')
  @ApiOperation({ summary: 'Get order by id' })
  getById(@Param('id') id: string): Record<string, unknown> {
    return { route: 'get-order', id };
  }

  /** Cancel an order (only allowed while status is PENDING or CONFIRMED). */
  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel order' })
  cancel(@Param('id') id: string): Record<string, unknown> {
    return { route: 'cancel-order', id };
  }

  /** Get real-time tracking information for a shipped order. */
  @Get(':id/tracking')
  @ApiOperation({ summary: 'Get order tracking details' })
  tracking(@Param('id') id: string): Record<string, unknown> {
    return { route: 'order-tracking', id };
  }
}
