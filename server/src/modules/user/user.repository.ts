import type { Db } from '../../db'
import { users } from '../../db/schema/user'

export async function upsertByClerkId(db: Db, clerkId: string, email: string | null) {
  const [user] = await db
    .insert(users)
    .values({ clerkId, email })
    .onConflictDoUpdate({
      target: users.clerkId,
      set: { email },
    })
    .returning()

  return user
}
