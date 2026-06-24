import { getAuth } from '@hono/clerk-auth'
import { createMiddleware } from 'hono/factory'
import type { Bindings } from '../types/env'

export const requireAuth = createMiddleware<{ Bindings: Bindings }>(async (c, next) => {
  const auth = getAuth(c)

  if (!auth?.userId) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  await next()
})
