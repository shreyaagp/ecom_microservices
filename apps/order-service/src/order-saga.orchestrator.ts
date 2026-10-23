import { Injectable, Logger } from '@nestjs/common';

import { KAFKA_TOPICS, EventEnvelope } from '@app/events';

/**
 * Orchestrates the order fulfillment saga.
 *
 * The saga coordinates compensating actions across services:
 *
 * 1. **Order Created** → request inventory reservation
 * 2. **Inventory Reserved** → confirm order, initiate payment
 * 3. **Payment Succeeded** → move order to PROCESSING
 * 4. **Payment Failed** → cancel order, release inventory
 * 5. **Inventory Reservation Failed** → cancel order, notify user
 *
 * Each step emits a Kafka event that the next service picks up,
 * forming a choreography-based saga with this orchestrator
 * tracking overall state.
 */
@Injectable()
export class OrderSagaOrchestrator {
  private readonly logger = new Logger(OrderSagaOrchestrator.name);

  /**
   * Handle incoming saga events and determine the next compensating action.
   *
   * @param event - The incoming event envelope from Kafka.
   * @returns An object describing the next action to take, or `null` if no action is needed.
   */
  handleSagaEvent(
    event: EventEnvelope<Record<string, unknown>>,
  ): { action: string; orderId: string } | null {
    const orderId = (event.payload['orderId'] as string) ?? 'unknown';

    switch (event.eventType) {
      case KAFKA_TOPICS.INVENTORY_RESERVED:
        this.logger.log(`Saga: inventory reserved for order ${orderId} → initiate payment`);
        return { action: 'INITIATE_PAYMENT', orderId };

      case KAFKA_TOPICS.INVENTORY_RESERVATION_FAILED:
        this.logger.warn(`Saga: inventory reservation failed for order ${orderId} → cancel order`);
        return { action: 'CANCEL_ORDER', orderId };

      case KAFKA_TOPICS.PAYMENT_SUCCEEDED:
        this.logger.log(`Saga: payment succeeded for order ${orderId} → move to PROCESSING`);
        return { action: 'CONFIRM_PROCESSING', orderId };

      case KAFKA_TOPICS.PAYMENT_FAILED:
        this.logger.warn(
          `Saga: payment failed for order ${orderId} → cancel order, release inventory`,
        );
        return { action: 'CANCEL_AND_RELEASE', orderId };

      default:
        return null;
    }
  }
}
