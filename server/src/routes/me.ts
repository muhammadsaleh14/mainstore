import { getAuth } from '@hono/clerk-auth'
import { Hono } from 'hono'
import { createDb } from '../db'
import { users } from '../db/schema/user'
import { requireAuth } from '../middleware/auth'
import type { Bindings } from '../types/env'

const meRoute = new Hono<{ Bindings: Bindings }>()

meRoute.use('*', requireAuth)

meRoute.get('/', async (c) => {
  const auth = getAuth(c)
  const clerkClient = c.get('clerk')
  const db = createDb(c.env.DATABASE_URL)

  const clerkUser = await clerkClient.users.getUser(auth!.userId!)
  const email = clerkUser.emailAddresses[0]?.emailAddress ?? null

  const [user] = await db
    .insert(users)
    .values({ clerkId: auth!.userId!, email })
    .onConflictDoUpdate({
      target: users.clerkId,
      set: { email },
    })
    .returning()

  return c.json({
    clerkId: auth!.userId,
    email,
    user,
  })
})

export default meRoute
