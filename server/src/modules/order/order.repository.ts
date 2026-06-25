import { desc, eq, sql } from 'drizzle-orm'
import type { Db } from '../../db'
import { orderItems } from '../../db/schema/order-item'
import type { NewOrderItem } from '../../db/schema/order-item'
import { orders } from '../../db/schema/order'
import type { NewOrder } from '../../db/schema/order'
import { productVariants } from '../../db/schema/product-variant'
import { users } from '../../db/schema/user'

export async function insertOrder(db: Db, data: NewOrder) {
  const [order] = await db.insert(orders).values(data).returning()
  return order
}

export async function insertOrderItems(db: Db, items: NewOrderItem[]) {
  if (items.length === 0) {
    return []
  }
  return db.insert(orderItems).values(items).returning()
}

export async function findOrderById(db: Db, id: number) {
  const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1)
  return order ?? null
}

export async function findOrderItemsByOrderId(db: Db, orderId: number) {
  return db.select().from(orderItems).where(eq(orderItems.orderId, orderId))
}

export async function findOrdersByUserId(db: Db, userId: number) {
  return db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt))
}

export async function findAllOrdersWithUser(db: Db) {
  return db
    .select({ order: orders, email: users.email })
    .from(orders)
    .innerJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt))
}

export async function updateOrderById(db: Db, id: number, data: Partial<NewOrder>) {
  const [order] = await db
    .update(orders)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(orders.id, id))
    .returning()
  return order ?? null
}

export async function decrementVariantStock(db: Db, variantId: number, quantity: number) {
  await db
    .update(productVariants)
    .set({
      stockQuantity: sql`${productVariants.stockQuantity} - ${quantity}`,
      updatedAt: new Date(),
    })
    .where(eq(productVariants.id, variantId))
}
