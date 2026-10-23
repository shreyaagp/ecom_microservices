import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer, ProducerRecord, RecordMetadata } from 'kafkajs';
import { randomUUID } from 'crypto';

import { EventEnvelope } from './event-envelope';
import { KafkaTopic } from './topics';

/**
 * A reusable Kafka producer that wraps every message in an {@link EventEnvelope}.
 *
 * Services inject this and call `emit()` to publish domain events
 * with automatic envelope wrapping, idempotent event IDs and JSON serialisation.
 *
 * @example
 * ```ts
 * await kafkaProducer.emit(KAFKA_TOPICS.PRODUCT_CREATED, { id: '1', name: 'Tee' });
 * ```
 */
@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaProducerService.name);
  private readonly producer: Producer;

  constructor(private readonly kafka: Kafka) {
    this.producer = this.kafka.producer();
  }

  /** Connect to the Kafka cluster when the module initialises. */
  async onModuleInit(): Promise<void> {
    await this.producer.connect();
    this.logger.log('Kafka producer connected');
  }

  /** Gracefully disconnect when the module is destroyed. */
  async onModuleDestroy(): Promise<void> {
    await this.producer.disconnect();
    this.logger.log('Kafka producer disconnected');
  }

  /**
   * Publish a typed domain event wrapped in an {@link EventEnvelope}.
   *
   * @param topic  - The Kafka topic to publish to (from `KAFKA_TOPICS`).
   * @param payload - The domain-specific payload.
   * @param version - Schema version string (defaults to `"1.0"`).
   * @returns The Kafka record metadata array.
   */
  async emit<TPayload>(
    topic: KafkaTopic,
    payload: TPayload,
    version = '1.0',
  ): Promise<RecordMetadata[]> {
    const envelope: EventEnvelope<TPayload> = {
      eventId: randomUUID(),
      eventType: topic,
      timestamp: new Date().toISOString(),
      version,
      payload,
    };

    const record: ProducerRecord = {
      topic,
      messages: [
        {
          key: envelope.eventId,
          value: JSON.stringify(envelope),
        },
      ],
    };

    try {
      const metadata = await this.producer.send(record);

      this.logger.debug(`Published ${topic} eventId=${envelope.eventId}`);

      return metadata;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);

      this.logger.error(`Failed to publish ${topic} eventId=${envelope.eventId}: ${message}`);

      throw error;
    }
  }
}
