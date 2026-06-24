import type { Product } from '../../db/schema/product'

export function toProductResponse(product: Product) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    createdAt: product.createdAt.toISOString(),
  }
}
