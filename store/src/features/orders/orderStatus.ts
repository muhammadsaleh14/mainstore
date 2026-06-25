import type { OrderStatus } from '@/types/api'

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: 'Pending payment',
  paid: 'Paid',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export const ORDER_STATUS_CLASSES: Record<OrderStatus, string> = {
  pending_payment: 'tag tag-pending',
  paid: 'tag tag-paid',
  shipped: 'tag tag-shipped',
  delivered: 'tag tag-delivered',
  cancelled: 'tag',
}

export function formatOrderStatus(status: OrderStatus): string {
  return ORDER_STATUS_LABELS[status]
}

export function orderStatusClass(status: OrderStatus): string {
  return ORDER_STATUS_CLASSES[status]
}
