import { Injectable, Logger } from '@nestjs/common';

import { KAFKA_TOPICS, KafkaTopic } from '@app/events';

/**
 * Produces product domain events to Kafka.
 *
 * In production this would inject the {@link KafkaProducerService} from `@app/events`.
 * For now it logs the events that *would* be emitted, demonstrating the intended
 * integration pattern.
 */
@Injectable()
export class ProductEventsService {
  private readonly logger = new Logger(ProductEventsService.name);

  /** Emit a product.created event after a new product is persisted. */
  async productCreated(productId: string, payload: Record<string, unknown>): Promise<void> {
    this.logEvent(KAFKA_TOPICS.PRODUCT_CREATED, productId, payload);
  }

  /** Emit a product.updated event after a product is modified. */
  async productUpdated(productId: string, payload: Record<string, unknown>): Promise<void> {
    this.logEvent(KAFKA_TOPICS.PRODUCT_UPDATED, productId, payload);
  }

  /** Emit a product.deleted event after a product is soft-deleted. */
  async productDeleted(productId: string): Promise<void> {
    this.logEvent(KAFKA_TOPICS.PRODUCT_DELETED, productId, {});
  }

  private logEvent(topic: KafkaTopic, productId: string, payload: Record<string, unknown>): void {
    this.logger.log(`[stub] Would emit ${topic} for product ${productId}`);
    this.logger.debug(`Payload: ${JSON.stringify(payload)}`);
  }
}
