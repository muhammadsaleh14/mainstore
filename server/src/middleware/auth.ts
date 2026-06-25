import { getAuth } from '@hono/clerk-auth'
import { createMiddleware } from 'hono/factory'
import { createDb } from '../db'
import type { User } from '../db/schema/user'
import { getUserByClerkId, syncCurrentUser } from '../modules/user/user.service'
import type { Bindings } from '../types/env'

export type AuthVariables = {
  user: User
}

export const requireAuth = createMiddleware<{ Bindings: Bindings; Variables: AuthVariables }>(
  async (c, next) => {
    const auth = getAuth(c)

    if (!auth?.userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    await next()
  },
)

export const requireUser = createMiddleware<{ Bindings: Bindings; Variables: AuthVariables }>(
  async (c, next) => {
    const auth = getAuth(c)

    if (!auth?.userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const db = createDb(c.env.DATABASE_URL)
    let user = await getUserByClerkId(db, auth.userId)

    if (!user) {
      const clerkClient = c.get('clerk')
      const clerkUser = await clerkClient.users.getUser(auth.userId)
      const result = await syncCurrentUser(db, auth.userId, clerkUser)
      user = result.user
    }

    c.set('user', user)
    await next()
  },
)

export function requireRole(...allowedRoles: User['role'][]) {
  return createMiddleware<{ Bindings: Bindings; Variables: AuthVariables }>(async (c, next) => {
    const auth = getAuth(c)

    if (!auth?.userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const db = createDb(c.env.DATABASE_URL)
    const user = await getUserByClerkId(db, auth.userId)

    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }

    if (!allowedRoles.includes(user.role)) {
      return c.json({ error: 'Forbidden' }, 403)
    }

    c.set('user', user)
    await next()
  })
}
