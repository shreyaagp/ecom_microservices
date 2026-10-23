import { Injectable, Logger } from '@nestjs/common';

import { EventEnvelope, KAFKA_TOPICS } from '@app/events';

/**
 * Kafka consumer handler for the notification-service.
 *
 * Listens for: `order.created`, `order.shipped`, `payment.failed`, `user.registered`.
 */
@Injectable()
export class NotificationKafkaHandler {
  private readonly logger = new Logger(NotificationKafkaHandler.name);
  private readonly processedEventIds = new Set<string>();

  /** Process an incoming Kafka event with idempotency guard. */
  async onEvent(message: EventEnvelope<Record<string, unknown>>): Promise<void> {
    if (this.processedEventIds.has(message.eventId)) {
      return;
    }

    switch (message.eventType) {
      case KAFKA_TOPICS.ORDER_CREATED:
      case KAFKA_TOPICS.ORDER_SHIPPED:
      case KAFKA_TOPICS.PAYMENT_FAILED:
      case KAFKA_TOPICS.USER_REGISTERED:
        this.logger.log(`handled ${message.eventType}`);
        break;
      default:
        return;
    }

    this.processedEventIds.add(message.eventId);
  }
}
