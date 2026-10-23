import { KafkaTopic } from './topics';

/**
 * Standard envelope wrapping every Kafka message.
 * Ensures consistent schema across all domain events.
 */
export interface EventEnvelope<TPayload> {
  /** UUID v4 — unique per event, used for idempotency. */
  eventId: string;
  /** The Kafka topic / event type (from KAFKA_TOPICS). */
  eventType: KafkaTopic;
  /** ISO-8601 timestamp of when the event was produced. */
  timestamp: string;
  /** Schema version string (e.g. "1.0"). */
  version: string;
  /** The domain-specific payload. */
  payload: TPayload;
}

/**
 * Contract for an idempotency store used by Kafka consumers
 * to guarantee exactly-once processing.
 */
export interface IdempotencyStore {
  /** Check whether an event has already been processed. */
  hasProcessed(eventId: string): Promise<boolean>;
  /** Mark an event as processed. */
  markProcessed(eventId: string): Promise<void>;
}
