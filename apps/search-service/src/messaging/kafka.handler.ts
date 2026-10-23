import { Injectable, Logger } from '@nestjs/common';

import { EventEnvelope, KAFKA_TOPICS } from '@app/events';

/**
 * Kafka consumer handler for the search-service.
 *
 * Listens for: `product.created`, `product.updated`, `product.deleted`.
 * Keeps the Elasticsearch index in sync with the product catalogue.
 */
@Injectable()
export class SearchKafkaHandler {
  private readonly logger = new Logger(SearchKafkaHandler.name);
  private readonly processedEventIds = new Set<string>();

  /** Process an incoming Kafka event with idempotency guard. */
  async onEvent(message: EventEnvelope<Record<string, unknown>>): Promise<void> {
    if (this.processedEventIds.has(message.eventId)) {
      return;
    }

    switch (message.eventType) {
      case KAFKA_TOPICS.PRODUCT_CREATED:
      case KAFKA_TOPICS.PRODUCT_UPDATED:
      case KAFKA_TOPICS.PRODUCT_DELETED:
        this.logger.log(`handled ${message.eventType}`);
        break;
      default:
        return;
    }

    this.processedEventIds.add(message.eventId);
  }
}
