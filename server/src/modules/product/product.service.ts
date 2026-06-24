import type { Db } from '../../db'
import { findAllProducts } from './product.repository'
import { toProductResponse } from './product.util'

export async function listProducts(db: Db) {
  const rows = await findAllProducts(db)
  return rows.map(toProductResponse)
}
