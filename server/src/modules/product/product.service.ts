import type { Db } from '../../db'
import {
  findAllProductVariants,
  findAllProducts,
  findProductById,
  findVariantById,
  findVariantsByProductId,
  insertProduct,
  insertVariant,
  updateProductById,
  updateVariantById,
} from './product.repository'
import type {
  CreateProductInput,
  UpdateProductInput,
  VariantInput,
} from './product.schema'
import { toProductResponse, type ProductResponse } from './product.response'

export type ServiceResult<T> =
  | { ok: true; value: T }
  | { ok: false; status: 404 | 409; error: string }

function isUniqueViolation(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false
  const code = (error as { code?: string }).code
  const message = (error as { message?: string }).message ?? ''
  return code === '23505' || message.includes('duplicate key value')
}

export async function listProducts(db: Db) {
  const [rows, variants] = await Promise.all([findAllProducts(db), findAllProductVariants(db)])
  return rows.map((product) => toProductResponse(product, variants))
}

export async function getProduct(db: Db, id: number): Promise<ServiceResult<ProductResponse>> {
  const product = await findProductById(db, id)
  if (!product) {
    return { ok: false, status: 404, error: 'Product not found' }
  }
  const variants = await findVariantsByProductId(db, id)
  return { ok: true, value: toProductResponse(product, variants) }
}

export async function createProduct(
  db: Db,
  input: CreateProductInput,
): Promise<ServiceResult<ProductResponse>> {
  try {
    const product = await insertProduct(db, {
      name: input.name,
      slug: input.slug,
      description: input.description,
      status: input.status,
      categoryId: input.categoryId,
    })

    const variant = await insertVariant(db, {
      productId: product.id,
      sku: input.defaultVariant.sku,
      price: input.defaultVariant.price,
      stockQuantity: input.defaultVariant.stockQuantity,
      barcode: input.defaultVariant.barcode,
      weightGrams: input.defaultVariant.weightGrams,
      isDefault: true,
    })

    return { ok: true, value: toProductResponse(product, [variant]) }
  } catch (error) {
    if (isUniqueViolation(error)) {
      return { ok: false, status: 409, error: 'A product slug or variant SKU already exists' }
    }
    throw error
  }
}

export async function updateProduct(
  db: Db,
  id: number,
  input: UpdateProductInput,
): Promise<ServiceResult<ProductResponse>> {
  try {
    const product = await updateProductById(db, id, input)
    if (!product) {
      return { ok: false, status: 404, error: 'Product not found' }
    }
    const variants = await findVariantsByProductId(db, id)
    return { ok: true, value: toProductResponse(product, variants) }
  } catch (error) {
    if (isUniqueViolation(error)) {
      return { ok: false, status: 409, error: 'A product with this slug already exists' }
    }
    throw error
  }
}

export async function archiveProduct(
  db: Db,
  id: number,
): Promise<ServiceResult<ProductResponse>> {
  const product = await updateProductById(db, id, { status: 'disabled' })
  if (!product) {
    return { ok: false, status: 404, error: 'Product not found' }
  }
  const variants = await findVariantsByProductId(db, id)
  return { ok: true, value: toProductResponse(product, variants) }
}

export async function addVariant(
  db: Db,
  productId: number,
  input: VariantInput,
): Promise<ServiceResult<ProductResponse>> {
  const product = await findProductById(db, productId)
  if (!product) {
    return { ok: false, status: 404, error: 'Product not found' }
  }

  try {
    await insertVariant(db, {
      productId,
      sku: input.sku,
      price: input.price,
      stockQuantity: input.stockQuantity,
      barcode: input.barcode,
      weightGrams: input.weightGrams,
      isDefault: input.isDefault,
    })
    const variants = await findVariantsByProductId(db, productId)
    return { ok: true, value: toProductResponse(product, variants) }
  } catch (error) {
    if (isUniqueViolation(error)) {
      return { ok: false, status: 409, error: 'A variant with this SKU already exists' }
    }
    throw error
  }
}

export async function updateVariant(
  db: Db,
  productId: number,
  variantId: number,
  input: Partial<VariantInput>,
): Promise<ServiceResult<ProductResponse>> {
  const existing = await findVariantById(db, variantId)
  if (!existing || existing.productId !== productId) {
    return { ok: false, status: 404, error: 'Variant not found' }
  }

  try {
    await updateVariantById(db, variantId, input)
    const product = await findProductById(db, productId)
    const variants = await findVariantsByProductId(db, productId)
    return { ok: true, value: toProductResponse(product!, variants) }
  } catch (error) {
    if (isUniqueViolation(error)) {
      return { ok: false, status: 409, error: 'A variant with this SKU already exists' }
    }
    throw error
  }
}
