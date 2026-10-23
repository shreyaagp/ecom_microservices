import { Injectable, Logger } from '@nestjs/common';

import { EventEnvelope, KAFKA_TOPICS } from '@app/events';

/**
 * Kafka consumer handler for the inventory-service.
 *
 * Listens for: `order.created`, `order.cancelled`, `order.delivered`.
 */
@Injectable()
export class InventoryKafkaHandler {
  private readonly logger = new Logger(InventoryKafkaHandler.name);
  private readonly processedEventIds = new Set<string>();

  /** Process an incoming Kafka event with idempotency guard. */
  async onEvent(message: EventEnvelope<Record<string, unknown>>): Promise<void> {
    if (this.processedEventIds.has(message.eventId)) {
      return;
    }

    switch (message.eventType) {
      case KAFKA_TOPICS.ORDER_CREATED:
      case KAFKA_TOPICS.ORDER_CANCELLED:
      case KAFKA_TOPICS.ORDER_DELIVERED:
        this.logger.log(`handled ${message.eventType}`);
        break;
      default:
        return;
    }

    this.processedEventIds.add(message.eventId);
  }
}
