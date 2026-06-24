import { z } from 'zod'
import { slugify } from '../../utils/slugify'

export const createCategorySchema = z
  .object({
    name: z.string().trim().min(1, 'Category name is required'),
    slug: z.string().trim().optional(),
    parentId: z.number().int().positive('Invalid parentId').nullable().default(null),
  })
  .transform((data) => ({
    name: data.name,
    slug: data.slug && data.slug.length > 0 ? slugify(data.slug) : slugify(data.name),
    parentId: data.parentId,
  }))

export type CategoryInput = z.infer<typeof createCategorySchema>
