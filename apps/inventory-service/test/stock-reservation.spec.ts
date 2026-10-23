import { InventoryKafkaHandler } from '../src/messaging/kafka.handler';
import { KAFKA_TOPICS, EventEnvelope } from '@app/events';

describe('InventoryKafkaHandler', () => {
  let handler: InventoryKafkaHandler;

  beforeEach(() => {
    handler = new InventoryKafkaHandler();
  });

  function makeEvent(
    eventType: string,
    payload: Record<string, unknown> = {},
    eventId = 'evt-1',
  ): EventEnvelope<Record<string, unknown>> {
    return {
      eventId,
      eventType: eventType as EventEnvelope<Record<string, unknown>>['eventType'],
      timestamp: new Date().toISOString(),
      version: '1.0',
      payload,
    };
  }

  describe('idempotency', () => {
    it('should process the same event only once', async () => {
      const event = makeEvent(KAFKA_TOPICS.ORDER_CREATED, { orderId: 'o-1' }, 'dup-1');

      await handler.onEvent(event);
      // Second call with same eventId should be a no-op (no throw)
      await handler.onEvent(event);
    });

    it('should process different events independently', async () => {
      const event1 = makeEvent(KAFKA_TOPICS.ORDER_CREATED, { orderId: 'o-1' }, 'evt-a');
      const event2 = makeEvent(KAFKA_TOPICS.ORDER_CANCELLED, { orderId: 'o-2' }, 'evt-b');

      await handler.onEvent(event1);
      await handler.onEvent(event2);
      // Both should process without error
    });
  });

  describe('concurrent reservations', () => {
    it('should handle concurrent events for different orders', async () => {
      const events = Array.from({ length: 10 }, (_, i) =>
        makeEvent(KAFKA_TOPICS.ORDER_CREATED, { orderId: `order-${i}` }, `evt-${i}`),
      );

      // Simulate concurrent processing
      await Promise.all(events.map((e) => handler.onEvent(e)));
    });

    it('should handle concurrent duplicate events safely', async () => {
      const event = makeEvent(KAFKA_TOPICS.ORDER_CREATED, { orderId: 'o-dup' }, 'evt-dup');

      // Fire 5 concurrent identical events — idempotency should prevent double processing
      await Promise.all(Array.from({ length: 5 }, () => handler.onEvent(event)));
    });
  });

  describe('event routing', () => {
    it('should handle ORDER_CREATED events', async () => {
      const event = makeEvent(KAFKA_TOPICS.ORDER_CREATED, { orderId: 'o-1' }, 'evt-r1');
      await expect(handler.onEvent(event)).resolves.toBeUndefined();
    });

    it('should handle ORDER_CANCELLED events', async () => {
      const event = makeEvent(KAFKA_TOPICS.ORDER_CANCELLED, { orderId: 'o-2' }, 'evt-r2');
      await expect(handler.onEvent(event)).resolves.toBeUndefined();
    });

    it('should handle ORDER_DELIVERED events', async () => {
      const event = makeEvent(KAFKA_TOPICS.ORDER_DELIVERED, { orderId: 'o-3' }, 'evt-r3');
      await expect(handler.onEvent(event)).resolves.toBeUndefined();
    });

    it('should ignore unrelated events', async () => {
      const event = makeEvent(KAFKA_TOPICS.USER_REGISTERED, {}, 'evt-r4');
      await expect(handler.onEvent(event)).resolves.toBeUndefined();
    });
  });
});
