import { Hono } from 'hono'
import { createDb } from '../db'
import { listProducts } from '../modules/product/product.service'
import type { Bindings } from '../types/env'

const productsRoute = new Hono<{ Bindings: Bindings }>()

productsRoute.get('/', async (c) => {
  const db = createDb(c.env.DATABASE_URL)
  const products = await listProducts(db)
  return c.json(products)
})

export default productsRoute
