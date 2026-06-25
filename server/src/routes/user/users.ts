import { Hono } from 'hono'
import { createDb } from '../../db'
import { requireAuth, requireRole } from '../../middleware/auth'
import type { AuthVariables } from '../../middleware/auth'
import { assignRole, listUsers } from '../../modules/user/user.service'
import type { Bindings } from '../../types/env'
import { parseId, parseJson } from '../validation'
import { updateUserRoleSchema } from '../../modules/user/user.dto'

const userRoutes = new Hono<{ Bindings: Bindings; Variables: AuthVariables }>()

userRoutes.use('*', requireAuth)
userRoutes.use('*', requireRole('admin'))

userRoutes.get('/', async (c) => {
  const db = createDb(c.env.DATABASE_URL)
  const users = await listUsers(db)
  return c.json(users)
})

userRoutes.patch('/:id/role', async (c) => {
  const id = parseId(c.req.param('id'))
  if (id === null) {
    return c.json({ error: 'Invalid user id' }, 400)
  }

  const parsed = await parseJson(c, updateUserRoleSchema)
  if (!parsed.ok) {
    return parsed.response
  }

  const db = createDb(c.env.DATABASE_URL)
  const user = await assignRole(db, id, parsed.data.role)
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }

  return c.json(user)
})

export default userRoutes
