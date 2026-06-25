import { eq } from 'drizzle-orm'
import type { Db } from '../../db'
import { products } from '../../db/schema/product'
import type { NewProduct } from '../../db/schema/product'
import { productVariants } from '../../db/schema/product-variant'
import type { NewProductVariant } from '../../db/schema/product-variant'

export async function findAllProducts(db: Db) {
  return db.select().from(products)
}

export async function findEnabledProducts(db: Db) {
  return db.select().from(products).where(eq(products.status, 'enabled'))
}

export async function findAllProductVariants(db: Db) {
  return db.select().from(productVariants)
}

export async function findProductById(db: Db, id: number) {
  const [product] = await db.select().from(products).where(eq(products.id, id)).limit(1)
  return product ?? null
}

export async function findVariantsByProductId(db: Db, productId: number) {
  return db.select().from(productVariants).where(eq(productVariants.productId, productId))
}

export async function insertProduct(db: Db, data: NewProduct) {
  const [product] = await db.insert(products).values(data).returning()
  return product
}

export async function updateProductById(db: Db, id: number, data: Partial<NewProduct>) {
  const [product] = await db
    .update(products)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning()
  return product ?? null
}

export async function insertVariant(db: Db, data: NewProductVariant) {
  const [variant] = await db.insert(productVariants).values(data).returning()
  return variant
}

export async function updateVariantById(db: Db, id: number, data: Partial<NewProductVariant>) {
  const [variant] = await db
    .update(productVariants)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(productVariants.id, id))
    .returning()
  return variant ?? null
}

export async function findVariantById(db: Db, id: number) {
  const [variant] = await db.select().from(productVariants).where(eq(productVariants.id, id)).limit(1)
  return variant ?? null
}
