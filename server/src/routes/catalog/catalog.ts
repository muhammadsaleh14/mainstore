import { Hono } from 'hono'
import { createDb } from '../../db'
import { getCatalogProduct, listCatalogProducts } from '../../modules/product/product.service'
import type { Bindings } from '../../types/env'
import { parseId } from '../validation'

const catalogRoutes = new Hono<{ Bindings: Bindings }>()

catalogRoutes.get('/', async (c) => {
  const db = createDb(c.env.DATABASE_URL)
  const products = await listCatalogProducts(db)
  return c.json(products)
})

catalogRoutes.get('/:id', async (c) => {
  const id = parseId(c.req.param('id'))
  if (id === null) {
    return c.json({ error: 'Invalid product id' }, 400)
  }

  const db = createDb(c.env.DATABASE_URL)
  const result = await getCatalogProduct(db, id)
  if (!result.ok) {
    return c.json({ error: result.error }, result.status)
  }
  return c.json(result.value)
})

export default catalogRoutes
