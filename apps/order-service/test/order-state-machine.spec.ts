import { transitionOrder } from '../src/order-state-machine';
import { OrderSagaOrchestrator } from '../src/order-saga.orchestrator';
import { KAFKA_TOPICS, EventEnvelope } from '@app/events';

describe('OrderStateMachine', () => {
  describe('transitionOrder', () => {
    it('should allow PENDING → CONFIRMED', () => {
      expect(transitionOrder('PENDING', 'CONFIRMED')).toBe('CONFIRMED');
    });

    it('should allow PENDING → CANCELLED', () => {
      expect(transitionOrder('PENDING', 'CANCELLED')).toBe('CANCELLED');
    });

    it('should allow CONFIRMED → PROCESSING', () => {
      expect(transitionOrder('CONFIRMED', 'PROCESSING')).toBe('PROCESSING');
    });

    it('should allow CONFIRMED → CANCELLED', () => {
      expect(transitionOrder('CONFIRMED', 'CANCELLED')).toBe('CANCELLED');
    });

    it('should allow PROCESSING → SHIPPED', () => {
      expect(transitionOrder('PROCESSING', 'SHIPPED')).toBe('SHIPPED');
    });

    it('should allow PROCESSING → CANCELLED', () => {
      expect(transitionOrder('PROCESSING', 'CANCELLED')).toBe('CANCELLED');
    });

    it('should allow SHIPPED → DELIVERED', () => {
      expect(transitionOrder('SHIPPED', 'DELIVERED')).toBe('DELIVERED');
    });

    it('should reject DELIVERED → PENDING', () => {
      expect(() => transitionOrder('DELIVERED', 'PENDING')).toThrow('Invalid order transition');
    });

    it('should reject CANCELLED → CONFIRMED', () => {
      expect(() => transitionOrder('CANCELLED', 'CONFIRMED')).toThrow('Invalid order transition');
    });

    it('should reject SHIPPED → CANCELLED (no cancel after ship)', () => {
      expect(() => transitionOrder('SHIPPED', 'CANCELLED')).toThrow('Invalid order transition');
    });

    it('should reject PENDING → SHIPPED (skip states)', () => {
      expect(() => transitionOrder('PENDING', 'SHIPPED')).toThrow('Invalid order transition');
    });
  });
});

describe('OrderSagaOrchestrator', () => {
  let orchestrator: OrderSagaOrchestrator;

  beforeEach(() => {
    orchestrator = new OrderSagaOrchestrator();
  });

  function makeEvent(eventType: string, orderId: string): EventEnvelope<Record<string, unknown>> {
    return {
      eventId: 'evt-1',
      eventType: eventType as EventEnvelope<Record<string, unknown>>['eventType'],
      timestamp: new Date().toISOString(),
      version: '1.0',
      payload: { orderId },
    };
  }

  it('should return INITIATE_PAYMENT on INVENTORY_RESERVED', () => {
    const result = orchestrator.handleSagaEvent(
      makeEvent(KAFKA_TOPICS.INVENTORY_RESERVED, 'order-1'),
    );
    expect(result).toEqual({ action: 'INITIATE_PAYMENT', orderId: 'order-1' });
  });

  it('should return CANCEL_ORDER on INVENTORY_RESERVATION_FAILED', () => {
    const result = orchestrator.handleSagaEvent(
      makeEvent(KAFKA_TOPICS.INVENTORY_RESERVATION_FAILED, 'order-2'),
    );
    expect(result).toEqual({ action: 'CANCEL_ORDER', orderId: 'order-2' });
  });

  it('should return CONFIRM_PROCESSING on PAYMENT_SUCCEEDED', () => {
    const result = orchestrator.handleSagaEvent(
      makeEvent(KAFKA_TOPICS.PAYMENT_SUCCEEDED, 'order-3'),
    );
    expect(result).toEqual({ action: 'CONFIRM_PROCESSING', orderId: 'order-3' });
  });

  it('should return CANCEL_AND_RELEASE on PAYMENT_FAILED', () => {
    const result = orchestrator.handleSagaEvent(makeEvent(KAFKA_TOPICS.PAYMENT_FAILED, 'order-4'));
    expect(result).toEqual({ action: 'CANCEL_AND_RELEASE', orderId: 'order-4' });
  });

  it('should return null for unrelated events', () => {
    const result = orchestrator.handleSagaEvent(makeEvent(KAFKA_TOPICS.USER_REGISTERED, 'order-5'));
    expect(result).toBeNull();
  });
});
