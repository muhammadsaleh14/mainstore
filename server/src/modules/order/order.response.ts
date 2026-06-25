import type { Order, OrderStatus, PaymentStatus, ShippingAddress } from '../../db/schema/order'
import type { OrderItem } from '../../db/schema/order-item'
import { centsToString, toCents } from '../../utils/money'

export interface OrderItemResponse {
  id: number
  productId: number | null
  variantId: number | null
  productName: string
  variantSku: string
  unitPrice: string
  quantity: number
  lineTotal: string
}

export interface OrderResponse {
  id: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  subtotal: string
  shippingTotal: string
  total: string
  currency: string
  shippingAddress: ShippingAddress
  customerEmail: string | null
  items: OrderItemResponse[]
  createdAt: string
  updatedAt: string
}

export interface OrderSummary {
  id: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  total: string
  currency: string
  customerEmail: string | null
  createdAt: string
}

export function toOrderItemResponse(item: OrderItem): OrderItemResponse {
  return {
    id: item.id,
    productId: item.productId,
    variantId: item.variantId,
    productName: item.productName,
    variantSku: item.variantSku,
    unitPrice: item.unitPrice,
    quantity: item.quantity,
    lineTotal: centsToString(toCents(item.unitPrice) * item.quantity),
  }
}

export function toOrderResponse(
  order: Order,
  items: OrderItem[],
  customerEmail: string | null = null,
): OrderResponse {
  return {
    id: order.id,
    status: order.status,
    paymentStatus: order.paymentStatus,
    subtotal: order.subtotal,
    shippingTotal: order.shippingTotal,
    total: order.total,
    currency: order.currency,
    shippingAddress: order.shippingAddress,
    customerEmail,
    items: items.map(toOrderItemResponse),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  }
}

export function toOrderSummary(order: Order, customerEmail: string | null = null): OrderSummary {
  return {
    id: order.id,
    status: order.status,
    paymentStatus: order.paymentStatus,
    total: order.total,
    currency: order.currency,
    customerEmail,
    createdAt: order.createdAt.toISOString(),
  }
}
