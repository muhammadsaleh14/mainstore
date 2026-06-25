import type { Db } from '../../db'
import type { User } from '../../db/schema/user'
import {
  findAllUsers,
  findByClerkId,
  updateUserRole,
  upsertByClerkId,
} from './user.repository'
import { getPrimaryEmail, type ClerkUserLike } from './user.util'

export async function syncCurrentUser(db: Db, clerkId: string, clerkUser: ClerkUserLike) {
  const email = getPrimaryEmail(clerkUser)
  const user = await upsertByClerkId(db, clerkId, email)

  return { clerkId, email, role: user.role, user }
}

export async function getUserByClerkId(db: Db, clerkId: string) {
  return findByClerkId(db, clerkId)
}

export async function listUsers(db: Db) {
  return findAllUsers(db)
}

export async function assignRole(db: Db, id: number, role: User['role']) {
  return updateUserRole(db, id, role)
}
