import type { Db } from '../../db'
import { products } from '../../db/schema/product'
import { productVariants } from '../../db/schema/product-variant'

export async function findAllProducts(db: Db) {
  return db.select().from(products)
}

export async function findAllProductVariants(db: Db) {
  return db.select().from(productVariants)
}
