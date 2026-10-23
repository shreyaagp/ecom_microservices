/**
 * Represents the possible states in the order lifecycle.
 *
 * ```
 *  PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED
 *    │           │           │
 *    └→ CANCELLED ←──────────┘
 * ```
 */
export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

/** A single line item within an order. */
export interface OrderItem {
  productId: string;
  sku: string;
  quantity: number;
  /** Price per unit in the order's currency (at time of purchase). */
  unitPrice: number;
}

/** The canonical contract for an order shared across services. */
export interface OrderContract {
  id: string;
  userId: string;
  status: OrderStatus;
  items: OrderItem[];
  /** ISO 4217 currency code (e.g. "usd"). */
  currency: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}
