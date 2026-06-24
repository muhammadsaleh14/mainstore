import type { User as ClerkUser } from '@clerk/backend'
import type { Db } from '../../db'
import { upsertByClerkId } from './user.repository'
import { getPrimaryEmail } from './user.util'

export async function syncCurrentUser(db: Db, clerkId: string, clerkUser: ClerkUser) {
  const email = getPrimaryEmail(clerkUser)
  const user = await upsertByClerkId(db, clerkId, email)

  return { clerkId, email, user }
}
