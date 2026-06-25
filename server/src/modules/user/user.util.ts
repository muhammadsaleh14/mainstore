import type { User } from '../../db/schema/user'

export const USER_ROLES = ['admin', 'manager', 'customer'] as const

export interface ClerkUserLike {
  emailAddresses: { id: string; emailAddress: string }[]
  primaryEmailAddressId: string | null
}

export function isUserRole(value: unknown): value is User['role'] {
  return typeof value === 'string' && (USER_ROLES as readonly string[]).includes(value)
}

export function isStaffUser(user: User): boolean {
  return user.role === 'admin' || user.role === 'manager'
}

export function getPrimaryEmail(clerkUser: ClerkUserLike): string | null {
  const primary = clerkUser.emailAddresses.find(
    (address) => address.id === clerkUser.primaryEmailAddressId,
  )

  return primary?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress ?? null
}
