import { z } from 'zod'
import { slugify } from '../../utils/slugify'

const priceSchema = z
  .string()
  .regex(/^\d+(\.\d{1,2})?$/, 'Price must be a decimal string like "12.00"')

const variantSchema = z.object({
  sku: z.string().trim().min(1, 'Variant sku is required'),
  price: priceSchema,
  stockQuantity: z.number().int('stockQuantity must be an integer').min(0),
  barcode: z.string().trim().min(1).nullable().default(null),
  weightGrams: z.number().int('weightGrams must be an integer').min(0).nullable().default(null),
  isDefault: z.boolean().default(false),
})

export const createProductSchema = z
  .object({
    name: z.string().trim().min(1, 'Product name is required'),
    slug: z.string().trim().optional(),
    description: z.string().nullable().default(null),
    status: z.enum(['enabled', 'disabled']).default('disabled'),
    categoryId: z.number().int().positive('Invalid categoryId').nullable().default(null),
    defaultVariant: variantSchema,
  })
  .transform((data) => ({
    name: data.name,
    slug: data.slug && data.slug.length > 0 ? slugify(data.slug) : slugify(data.name),
    description: data.description,
    status: data.status,
    categoryId: data.categoryId,
    defaultVariant: { ...data.defaultVariant, isDefault: true },
  }))

export const updateProductSchema = z
  .object({
    name: z.string().trim().min(1, 'Product name must be a non-empty string'),
    slug: z.string().trim().min(1, 'Invalid slug').transform(slugify),
    description: z.string().nullable(),
    status: z.enum(['enabled', 'disabled']),
    categoryId: z.number().int().positive('Invalid categoryId').nullable(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, { message: 'No valid fields to update' })

export const createVariantSchema = variantSchema

export const updateVariantSchema = z
  .object({
    sku: z.string().trim().min(1, 'Variant sku must be a non-empty string'),
    price: priceSchema,
    stockQuantity: z.number().int('stockQuantity must be an integer').min(0),
    barcode: z.string().trim().min(1).nullable(),
    weightGrams: z.number().int('weightGrams must be an integer').min(0).nullable(),
    isDefault: z.boolean(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, { message: 'No valid fields to update' })

export type VariantInput = z.infer<typeof createVariantSchema>
export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type UpdateVariantInput = z.infer<typeof updateVariantSchema>
