import { Injectable, Logger } from '@nestjs/common';

import { EventEnvelope, KAFKA_TOPICS } from '@app/events';

/**
 * Kafka consumer handler for the order-service.
 *
 * Listens for: `payment.succeeded`, `payment.failed`,
 * `inventory.reserved`, `inventory.reservation_failed`.
 *
 * Uses an in-memory Set for idempotency (swap for Redis in production).
 */
@Injectable()
export class OrderKafkaHandler {
  private readonly logger = new Logger(OrderKafkaHandler.name);
  private readonly processedEventIds = new Set<string>();

  /** Process an incoming Kafka event with idempotency guard. */
  async onEvent(message: EventEnvelope<Record<string, unknown>>): Promise<void> {
    if (this.processedEventIds.has(message.eventId)) {
      return;
    }

    switch (message.eventType) {
      case KAFKA_TOPICS.PAYMENT_SUCCEEDED:
      case KAFKA_TOPICS.PAYMENT_FAILED:
      case KAFKA_TOPICS.INVENTORY_RESERVED:
      case KAFKA_TOPICS.INVENTORY_RESERVATION_FAILED:
        this.logger.log(`handled ${message.eventType}`);
        break;
      default:
        return;
    }

    this.processedEventIds.add(message.eventId);
  }
}
