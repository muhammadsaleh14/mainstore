import { Hono } from 'hono'
import { createDb } from '../db'
import { requireAuth, requireRole } from '../middleware/auth'
import type { AuthVariables } from '../middleware/auth'
import { assignRole, listUsers } from '../modules/user/user.service'
import { isUserRole } from '../modules/user/user.util'
import type { Bindings } from '../types/env'

const adminRoute = new Hono<{ Bindings: Bindings; Variables: AuthVariables }>()

adminRoute.use('*', requireAuth)
adminRoute.use('*', requireRole('admin'))

adminRoute.get('/users', async (c) => {
  const db = createDb(c.env.DATABASE_URL)
  const users = await listUsers(db)
  return c.json(users)
})

adminRoute.patch('/users/:id/role', async (c) => {
  const id = Number(c.req.param('id'))

  if (!Number.isInteger(id) || id <= 0) {
    return c.json({ error: 'Invalid user id' }, 400)
  }

  const body = await c.req.json().catch(() => null)
  const role = body?.role

  if (!isUserRole(role)) {
    return c.json({ error: 'Invalid role' }, 400)
  }

  const db = createDb(c.env.DATABASE_URL)
  const user = await assignRole(db, id, role)

  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }

  return c.json(user)
})

export default adminRoute
