import type { Product } from '../../db/schema/product'
import type { ProductVariant } from '../../db/schema/product-variant'

export function toVariantResponse(variant: ProductVariant) {
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

export function toProductResponse(product: Product, variants: ProductVariant[]) {
  const productVariants = variants.filter((variant) => variant.productId === product.id)

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    status: product.status,
    categoryId: product.categoryId,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    variants: productVariants.map(toVariantResponse),
  }
}
