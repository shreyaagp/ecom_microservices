import { Injectable, Logger } from '@nestjs/common';

import { EventEnvelope, KAFKA_TOPICS } from '@app/events';

/**
 * Kafka consumer handler for the payment-service.
 *
 * Listens for: `order.confirmed`.
 */
@Injectable()
export class PaymentKafkaHandler {
  private readonly logger = new Logger(PaymentKafkaHandler.name);
  private readonly processedEventIds = new Set<string>();

  /** Process an incoming Kafka event with idempotency guard. */
  async onEvent(message: EventEnvelope<Record<string, unknown>>): Promise<void> {
    if (this.processedEventIds.has(message.eventId)) {
      return;
    }

    if (message.eventType === KAFKA_TOPICS.ORDER_CONFIRMED) {
      this.logger.log(`handled ${message.eventType}`);
      this.processedEventIds.add(message.eventId);
    }
  }
}
