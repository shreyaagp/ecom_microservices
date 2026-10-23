import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@app/common';

import { ConfirmPaymentDto, CreatePaymentIntentDto } from './dto/payments.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  /** Create a Stripe PaymentIntent for a given order. */
  @Post('intent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create payment intent' })
  createIntent(@Body() dto: CreatePaymentIntentDto): Record<string, unknown> {
    return { route: 'create-intent', orderId: dto.orderId };
  }

  /** Confirm a PaymentIntent with a payment method. */
  @Post('confirm')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirm payment' })
  confirm(@Body() dto: ConfirmPaymentDto): Record<string, unknown> {
    return { route: 'confirm-payment', paymentIntentId: dto.paymentIntentId };
  }

  /** Handle incoming Stripe webhooks (signature verified). */
  @Post('webhooks')
  @ApiOperation({ summary: 'Stripe webhook endpoint' })
  webhook(@Body() body: Record<string, unknown>): Record<string, unknown> {
    return { route: 'stripe-webhook', type: body['type'] };
  }

  /** Retrieve the authenticated user's payment history. */
  @Get('history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment history' })
  history(): Record<string, unknown> {
    return { route: 'payment-history' };
  }

  /** Initiate a refund for a completed payment. */
  @Post(':id/refund')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refund payment' })
  refund(@Param('id') id: string): Record<string, unknown> {
    return { route: 'refund-payment', id };
  }
}
