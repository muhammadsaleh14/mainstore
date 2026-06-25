import { Hono } from 'hono'
import { createDb } from '../../db'
import { requireRole, requireUser } from '../../middleware/auth'
import type { AuthVariables } from '../../middleware/auth'
import { getOrder, listOrders, updateOrderStatus } from '../../modules/order/order.service'
import { updateOrderStatusSchema } from '../../modules/order/order.dto'
import type { Bindings } from '../../types/env'
import { parseId, parseJson } from '../validation'

const orderRoutes = new Hono<{ Bindings: Bindings; Variables: AuthVariables }>()

orderRoutes.use('*', requireUser)

orderRoutes.get('/', async (c) => {
  const db = createDb(c.env.DATABASE_URL)
  const orders = await listOrders(db, c.get('user'))
  return c.json(orders)
})

orderRoutes.get('/:id', async (c) => {
  const id = parseId(c.req.param('id'))
  if (id === null) {
    return c.json({ error: 'Invalid order id' }, 400)
  }

  const db = createDb(c.env.DATABASE_URL)
  const result = await getOrder(db, c.get('user'), id)
  if (!result.ok) {
    return c.json({ error: result.error }, result.status)
  }
  return c.json(result.value)
})

orderRoutes.patch('/:id/status', requireRole('admin', 'manager'), async (c) => {
  const id = parseId(c.req.param('id'))
  if (id === null) {
    return c.json({ error: 'Invalid order id' }, 400)
  }

  const parsed = await parseJson(c, updateOrderStatusSchema)
  if (!parsed.ok) {
    return parsed.response
  }

  const db = createDb(c.env.DATABASE_URL)
  const result = await updateOrderStatus(db, id, parsed.data.status)
  if (!result.ok) {
    return c.json({ error: result.error }, result.status)
  }
  return c.json(result.value)
})

export default orderRoutes
