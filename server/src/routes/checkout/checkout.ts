import { Hono } from 'hono'
import { createDb } from '../../db'
import { requireUser } from '../../middleware/auth'
import type { AuthVariables } from '../../middleware/auth'
import { checkoutSchema } from '../../modules/order/order.dto'
import { createOrderFromItems } from '../../modules/order/order.service'
import type { Bindings } from '../../types/env'
import { parseJson } from '../validation'

const checkoutRoutes = new Hono<{ Bindings: Bindings; Variables: AuthVariables }>()

checkoutRoutes.use('*', requireUser)

checkoutRoutes.post('/', async (c) => {
  const parsed = await parseJson(c, checkoutSchema)
  if (!parsed.ok) {
    return parsed.response
  }

  const db = createDb(c.env.DATABASE_URL)
  const shippingFlatCents = Number(c.env.SHIPPING_FLAT_CENTS ?? '0') || 0

  const result = await createOrderFromItems(
    db,
    c.get('user').id,
    parsed.data.shippingAddress,
    parsed.data.items,
    shippingFlatCents,
  )
  if (!result.ok) {
    return c.json({ error: result.error }, result.status)
  }

  return c.json({ orderId: result.value.order.id }, 201)
})

export default checkoutRoutes
