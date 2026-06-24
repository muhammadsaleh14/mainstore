import type { Db } from '../../db'
import { findAllProductVariants, findAllProducts } from './product.repository'
import { toProductResponse } from './product.util'

export async function listProducts(db: Db) {
  const [rows, variants] = await Promise.all([
    findAllProducts(db),
    findAllProductVariants(db),
  ])

  return rows.map((product) => toProductResponse(product, variants))
}
