import { Logger } from '@nestjs/common';

import { OrderStatus } from '@app/contracts';

/**
 * Valid state transitions for the order state machine.
 *
 * ```
 *  PENDING ──► CONFIRMED ──► PROCESSING ──► SHIPPED ──► DELIVERED
 *    │             │             │
 *    └─► CANCELLED ◄─────────────┘
 * ```
 */
const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};

/**
 * Validates and executes order state transitions.
 *
 * Throws if the requested transition is not allowed from the current status.
 *
 * @param currentStatus - The order's current status.
 * @param targetStatus  - The desired next status.
 * @returns The new status if the transition is valid.
 * @throws Error if the transition is not allowed.
 */
export function transitionOrder(
  currentStatus: OrderStatus,
  targetStatus: OrderStatus,
): OrderStatus {
  const logger = new Logger('OrderStateMachine');
  const allowed = VALID_TRANSITIONS[currentStatus];

  if (!allowed.includes(targetStatus)) {
    throw new Error(
      `Invalid order transition: ${currentStatus} → ${targetStatus}. Allowed: [${allowed.join(', ')}]`,
    );
  }

  logger.log(`Order transition: ${currentStatus} → ${targetStatus}`);
  return targetStatus;
}
