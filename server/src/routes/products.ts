import { Hono } from 'hono'
import { createDb } from '../db'
import { products } from '../db/schema/product'

type Bindings = {
  DATABASE_URL: string
}

const productsRoute = new Hono<{ Bindings: Bindings }>()

productsRoute.get('/', async (c) => {
  const db = createDb(c.env.DATABASE_URL)
  const allProducts = await db.select().from(products)
  return c.json(allProducts)
})

export default productsRoute
