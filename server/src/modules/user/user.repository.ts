import { eq } from 'drizzle-orm'
import type { Db } from '../../db'
import { users } from '../../db/schema/user'
import type { User } from '../../db/schema/user'

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

export async function findByClerkId(db: Db, clerkId: string) {
  const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1)
  return user ?? null
}

export async function findAllUsers(db: Db) {
  return db.select().from(users)
}

export async function updateUserRole(db: Db, id: number, role: User['role']) {
  const [user] = await db.update(users).set({ role }).where(eq(users.id, id)).returning()
  return user ?? null
}
