import { Hono } from 'hono'
import { createDb } from '../../db'
import { requireAuth, requireRole } from '../../middleware/auth'
import type { AuthVariables } from '../../middleware/auth'
import { createCategory, listCategories } from '../../modules/category/category.service'
import type { Bindings } from '../../types/env'
import { parseJson } from '../validation'
import { createCategorySchema } from '../../modules/category/category.dto'

const categoryRoutes = new Hono<{ Bindings: Bindings; Variables: AuthVariables }>()

categoryRoutes.get('/', async (c) => {
  const db = createDb(c.env.DATABASE_URL)
  const categories = await listCategories(db)
  return c.json(categories)
})

categoryRoutes.post('/', requireAuth, requireRole('admin'), async (c) => {
  const parsed = await parseJson(c, createCategorySchema)
  if (!parsed.ok) {
    return parsed.response
  }

  const db = createDb(c.env.DATABASE_URL)
  const category = await createCategory(db, parsed.data)
  return c.json(category, 201)
})

export default categoryRoutes
