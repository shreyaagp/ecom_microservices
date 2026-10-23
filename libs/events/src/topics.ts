export const KAFKA_TOPICS = {
  ORDER_CREATED: 'order.created',
  ORDER_CONFIRMED: 'order.confirmed',
  ORDER_CANCELLED: 'order.cancelled',
  ORDER_SHIPPED: 'order.shipped',
  ORDER_DELIVERED: 'order.delivered',
  PAYMENT_INITIATED: 'payment.initiated',
  PAYMENT_SUCCEEDED: 'payment.succeeded',
  PAYMENT_FAILED: 'payment.failed',
  PAYMENT_REFUNDED: 'payment.refunded',
  INVENTORY_RESERVED: 'inventory.reserved',
  INVENTORY_RESERVATION_FAILED: 'inventory.reservation_failed',
  INVENTORY_STOCK_LOW: 'inventory.stock_low',
  PRODUCT_CREATED: 'product.created',
  PRODUCT_UPDATED: 'product.updated',
  PRODUCT_DELETED: 'product.deleted',
  USER_REGISTERED: 'user.registered',
  USER_PASSWORD_RESET: 'user.password_reset',
} as const;

export type KafkaTopic = (typeof KAFKA_TOPICS)[keyof typeof KAFKA_TOPICS];
