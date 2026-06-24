import { Hono } from 'hono'
import { createDb } from '../../db'
import { requireAuth, requireRole } from '../../middleware/auth'
import type { AuthVariables } from '../../middleware/auth'
import {
  addVariant,
  archiveProduct,
  createProduct,
  getProduct,
  listProducts,
  updateProduct,
  updateVariant,
} from '../../modules/product/product.service'
import type { Bindings } from '../../types/env'
import { parseId, parseJson } from '../validation'
import {
  createProductSchema,
  createVariantSchema,
  updateProductSchema,
  updateVariantSchema,
} from '../../modules/product/product.schema'

const productRoutes = new Hono<{ Bindings: Bindings; Variables: AuthVariables }>()

const adminOnly = [requireAuth, requireRole('admin')] as const

productRoutes.get('/', async (c) => {
  const db = createDb(c.env.DATABASE_URL)
  const products = await listProducts(db)
  return c.json(products)
})

productRoutes.get('/:id', async (c) => {
  const id = parseId(c.req.param('id'))
  if (id === null) {
    return c.json({ error: 'Invalid product id' }, 400)
  }

  const db = createDb(c.env.DATABASE_URL)
  const result = await getProduct(db, id)
  if (!result.ok) {
    return c.json({ error: result.error }, result.status)
  }
  return c.json(result.value)
})

productRoutes.post('/', ...adminOnly, async (c) => {
  const parsed = await parseJson(c, createProductSchema)
  if (!parsed.ok) {
    return parsed.response
  }

  const db = createDb(c.env.DATABASE_URL)
  const result = await createProduct(db, parsed.data)
  if (!result.ok) {
    return c.json({ error: result.error }, result.status)
  }
  return c.json(result.value, 201)
})

productRoutes.patch('/:id', ...adminOnly, async (c) => {
  const id = parseId(c.req.param('id'))
  if (id === null) {
    return c.json({ error: 'Invalid product id' }, 400)
  }

  const parsed = await parseJson(c, updateProductSchema)
  if (!parsed.ok) {
    return parsed.response
  }

  const db = createDb(c.env.DATABASE_URL)
  const result = await updateProduct(db, id, parsed.data)
  if (!result.ok) {
    return c.json({ error: result.error }, result.status)
  }
  return c.json(result.value)
})

productRoutes.delete('/:id', ...adminOnly, async (c) => {
  const id = parseId(c.req.param('id'))
  if (id === null) {
    return c.json({ error: 'Invalid product id' }, 400)
  }

  const db = createDb(c.env.DATABASE_URL)
  const result = await archiveProduct(db, id)
  if (!result.ok) {
    return c.json({ error: result.error }, result.status)
  }
  return c.json(result.value)
})

productRoutes.post('/:id/variants', ...adminOnly, async (c) => {
  const id = parseId(c.req.param('id'))
  if (id === null) {
    return c.json({ error: 'Invalid product id' }, 400)
  }

  const parsed = await parseJson(c, createVariantSchema)
  if (!parsed.ok) {
    return parsed.response
  }

  const db = createDb(c.env.DATABASE_URL)
  const result = await addVariant(db, id, parsed.data)
  if (!result.ok) {
    return c.json({ error: result.error }, result.status)
  }
  return c.json(result.value, 201)
})

productRoutes.patch('/:id/variants/:variantId', ...adminOnly, async (c) => {
  const id = parseId(c.req.param('id'))
  const variantId = parseId(c.req.param('variantId'))
  if (id === null || variantId === null) {
    return c.json({ error: 'Invalid id' }, 400)
  }

  const parsed = await parseJson(c, updateVariantSchema)
  if (!parsed.ok) {
    return parsed.response
  }

  const db = createDb(c.env.DATABASE_URL)
  const result = await updateVariant(db, id, variantId, parsed.data)
  if (!result.ok) {
    return c.json({ error: result.error }, result.status)
  }
  return c.json(result.value)
})

export default productRoutes
