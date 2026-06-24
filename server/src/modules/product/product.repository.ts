import type { Db } from '../../db'
import { products } from '../../db/schema/product'

export async function findAllProducts(db: Db) {
  return db.select().from(products)
}
