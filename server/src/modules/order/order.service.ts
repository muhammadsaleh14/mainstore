import type { Db } from '../../db'
import type { OrderStatus, ShippingAddress } from '../../db/schema/order'
import type { Order } from '../../db/schema/order'
import type { OrderItem } from '../../db/schema/order-item'
import type { User } from '../../db/schema/user'
import { findProductById, findVariantById } from '../product/product.repository'
import { findUserEmailById } from '../user/user.repository'
import { isStaffUser } from '../user/user.util'
import type { CheckoutLineItem } from './order.dto'
import {
  decrementVariantStock,
  findAllOrdersWithUser,
  findOrderById,
  findOrderItemsByOrderId,
  findOrdersByUserId,
  insertOrder,
  insertOrderItems,
  updateOrderById,
} from './order.repository'
import { toOrderResponse, toOrderSummary, type OrderResponse, type OrderSummary } from './order.response'
import {
  calculateOrderTotals,
  canTransitionOrderStatus,
  toNewOrderItems,
  validateAndResolveLineItem,
  type ResolvedLineItem,
} from './order.util'

export type ServiceResult<T> =
  | { ok: true; value: T }
  | { ok: false; status: 400 | 404 | 409; error: string }

async function resolveCheckoutItems(
  db: Db,
  items: CheckoutLineItem[],
): Promise<ServiceResult<ResolvedLineItem[]>> {
  if (items.length === 0) {
    return { ok: false, status: 400, error: 'Your cart is empty' }
  }

  const resolved: ResolvedLineItem[] = []

  for (const item of items) {
    const variant = await findVariantById(db, item.variantId)
    const product = variant ? await findProductById(db, variant.productId) : null
    const result = validateAndResolveLineItem(item, variant, product)
    if (!result.ok) {
      return result
    }
    resolved.push(result.value)
  }

  return { ok: true, value: resolved }
}

export async function createOrderFromItems(
  db: Db,
  userId: number,
  shippingAddress: ShippingAddress,
  lineItems: CheckoutLineItem[],
  shippingFlatCents: number,
): Promise<ServiceResult<{ order: Order; items: OrderItem[] }>> {
  const resolved = await resolveCheckoutItems(db, lineItems)
  if (!resolved.ok) {
    return resolved
  }

  const totals = calculateOrderTotals(resolved.value, shippingFlatCents)

  const order = await insertOrder(db, {
    userId,
    status: 'paid',
    paymentStatus: 'paid',
    subtotal: totals.subtotal,
    shippingTotal: totals.shippingTotal,
    total: totals.total,
    shippingAddress,
  })

  const items = await insertOrderItems(db, toNewOrderItems(order.id, resolved.value))

  for (const item of items) {
    if (item.variantId !== null) {
      await decrementVariantStock(db, item.variantId, item.quantity)
    }
  }

  return { ok: true, value: { order, items } }
}

export async function listOrders(db: Db, user: User): Promise<OrderSummary[]> {
  return isStaffUser(user) ? listAllOrders(db) : listOrdersForUser(db, user.id)
}

export async function getOrder(
  db: Db,
  user: User,
  orderId: number,
): Promise<ServiceResult<OrderResponse>> {
  return isStaffUser(user) ? getOrderById(db, orderId) : getOrderForUser(db, user.id, orderId)
}

export async function listOrdersForUser(db: Db, userId: number): Promise<OrderSummary[]> {
  const rows = await findOrdersByUserId(db, userId)
  return rows.map((order) => toOrderSummary(order))
}

export async function getOrderForUser(
  db: Db,
  userId: number,
  orderId: number,
): Promise<ServiceResult<OrderResponse>> {
  const order = await findOrderById(db, orderId)
  if (!order || order.userId !== userId) {
    return { ok: false, status: 404, error: 'Order not found' }
  }
  const items = await findOrderItemsByOrderId(db, orderId)
  return { ok: true, value: toOrderResponse(order, items) }
}

export async function listAllOrders(db: Db): Promise<OrderSummary[]> {
  const rows = await findAllOrdersWithUser(db)
  return rows.map((row) => toOrderSummary(row.order, row.email))
}

export async function getOrderById(db: Db, orderId: number): Promise<ServiceResult<OrderResponse>> {
  const order = await findOrderById(db, orderId)
  if (!order) {
    return { ok: false, status: 404, error: 'Order not found' }
  }
  const items = await findOrderItemsByOrderId(db, orderId)
  const email = await findUserEmailById(db, order.userId)
  return { ok: true, value: toOrderResponse(order, items, email) }
}

export async function updateOrderStatus(
  db: Db,
  orderId: number,
  status: OrderStatus,
): Promise<ServiceResult<OrderResponse>> {
  const order = await findOrderById(db, orderId)
  if (!order) {
    return { ok: false, status: 404, error: 'Order not found' }
  }

  if (!canTransitionOrderStatus(order.status, status)) {
    return {
      ok: false,
      status: 409,
      error: `Cannot change status from ${order.status} to ${status}`,
    }
  }

  const updated = await updateOrderById(db, orderId, { status })
  const items = await findOrderItemsByOrderId(db, orderId)
  const email = await findUserEmailById(db, order.userId)
  return { ok: true, value: toOrderResponse(updated!, items, email) }
}
