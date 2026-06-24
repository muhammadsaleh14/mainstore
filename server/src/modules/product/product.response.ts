import type { Product, ProductStatus } from '../../db/schema/product'
import type { ProductVariant } from '../../db/schema/product-variant'

export interface VariantResponse {
  id: number
  sku: string
  price: string
  stockQuantity: number
  barcode: string | null
  weightGrams: number | null
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductResponse {
  id: number
  name: string
  slug: string
  description: string | null
  status: ProductStatus
  categoryId: number | null
  createdAt: string
  updatedAt: string
  variants: VariantResponse[]
}

export function toVariantResponse(variant: ProductVariant): VariantResponse {
  return {
    id: variant.id,
    sku: variant.sku,
    price: variant.price,
    stockQuantity: variant.stockQuantity,
    barcode: variant.barcode,
    weightGrams: variant.weightGrams,
    isDefault: variant.isDefault,
    createdAt: variant.createdAt.toISOString(),
    updatedAt: variant.updatedAt.toISOString(),
  }
}

export function toProductResponse(product: Product, variants: ProductVariant[]): ProductResponse {
  const ownVariants = variants.filter((variant) => variant.productId === product.id)

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    status: product.status,
    categoryId: product.categoryId,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    variants: ownVariants.map(toVariantResponse),
  }
}
