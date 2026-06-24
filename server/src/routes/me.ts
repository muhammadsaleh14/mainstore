import { getAuth } from '@hono/clerk-auth'
import { Hono } from 'hono'
import { createDb } from '../db'
import { syncCurrentUser } from '../modules/user/user.service'
import { requireAuth } from '../middleware/auth'
import type { Bindings } from '../types/env'

const meRoute = new Hono<{ Bindings: Bindings }>()

meRoute.use('*', requireAuth)

meRoute.get('/', async (c) => {
  const auth = getAuth(c)
  const clerkClient = c.get('clerk')
  const db = createDb(c.env.DATABASE_URL)

  const clerkUser = await clerkClient.users.getUser(auth!.userId!)
  const result = await syncCurrentUser(db, auth!.userId!, clerkUser)

  return c.json(result)
})

export default meRoute
