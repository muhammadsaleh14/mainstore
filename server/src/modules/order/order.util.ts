import type { OrderStatus } from '../../db/schema/order'
import type { Product } from '../../db/schema/product'
import type { ProductVariant } from '../../db/schema/product-variant'
import type { NewOrderItem } from '../../db/schema/order-item'
import { centsToString, toCents } from '../../utils/money'
import type { CheckoutLineItem } from './order.dto'

export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending_payment: ['cancelled'],
  paid: ['shipped'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
}

export interface ResolvedLineItem {
  productId: number
  variantId: number
  productName: string
  variantSku: string
  unitPrice: string
  quantity: number
}

export interface OrderTotals {
  subtotalCents: number
  totalCents: number
  subtotal: string
  shippingTotal: string
  total: string
}

type LineItemError = { ok: false; status: 404 | 409; error: string }
type LineItemSuccess = { ok: true; value: ResolvedLineItem }

export function canTransitionOrderStatus(from: OrderStatus, to: OrderStatus): boolean {
  return ORDER_STATUS_TRANSITIONS[from].includes(to)
}

export function validateAndResolveLineItem(
  item: CheckoutLineItem,
  variant: ProductVariant | null,
  product: Product | null,
): LineItemSuccess | LineItemError {
  if (!variant) {
    return { ok: false, status: 404, error: 'A product in your cart was not found' }
  }

  if (!product || product.status !== 'enabled') {
    return {
      ok: false,
      status: 409,
      error: `"${product?.name ?? 'A product'}" is no longer available`,
    }
  }

  if (item.quantity > variant.stockQuantity) {
    return { ok: false, status: 409, error: `Not enough stock for "${product.name}"` }
  }

  return {
    ok: true,
    value: {
      productId: product.id,
      variantId: variant.id,
      productName: product.name,
      variantSku: variant.sku,
      unitPrice: variant.price,
      quantity: item.quantity,
    },
  }
}

export function calculateOrderTotals(
  items: Pick<ResolvedLineItem, 'unitPrice' | 'quantity'>[],
  shippingFlatCents: number,
): OrderTotals {
  const subtotalCents = items.reduce(
    (sum, item) => sum + toCents(item.unitPrice) * item.quantity,
    0,
  )
  const totalCents = subtotalCents + shippingFlatCents

  return {
    subtotalCents,
    totalCents,
    subtotal: centsToString(subtotalCents),
    shippingTotal: centsToString(shippingFlatCents),
    total: centsToString(totalCents),
  }
}

export function toNewOrderItems(orderId: number, items: ResolvedLineItem[]): NewOrderItem[] {
  return items.map((item) => ({
    orderId,
    productId: item.productId,
    variantId: item.variantId,
    productName: item.productName,
    variantSku: item.variantSku,
    unitPrice: item.unitPrice,
    quantity: item.quantity,
  }))
}
