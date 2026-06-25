import type { OrderStatus, PaymentStatus } from '@/types/api'

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending_payment: 'default',
  paid: 'blue',
  shipped: 'cyan',
  delivered: 'green',
  cancelled: 'red',
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: 'Pending payment',
  paid: 'Paid',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  pending: 'default',
  paid: 'green',
  failed: 'red',
}
