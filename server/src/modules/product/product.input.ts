import type { ProductStatus } from '../../db/schema/product'

export interface VariantInput {
  sku: string
  price: string
  stockQuantity: number
  barcode: string | null
  weightGrams: number | null
  isDefault: boolean
}

export interface CreateProductInput {
  name: string
  slug: string
  description: string | null
  status: ProductStatus
  categoryId: number | null
  defaultVariant: VariantInput
}

export interface UpdateProductInput {
  name?: string
  slug?: string
  description?: string | null
  status?: ProductStatus
  categoryId?: number | null
}
