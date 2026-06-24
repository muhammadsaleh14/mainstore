import type { User as ClerkUser } from '@clerk/backend'
import type { User } from '../../db/schema/user'

export const USER_ROLES = ['admin', 'manager', 'customer'] as const

export function isUserRole(value: unknown): value is User['role'] {
  return typeof value === 'string' && (USER_ROLES as readonly string[]).includes(value)
}

export function getPrimaryEmail(clerkUser: ClerkUser): string | null {
  const primary = clerkUser.emailAddresses.find(
    (address) => address.id === clerkUser.primaryEmailAddressId,
  )

  return primary?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress ?? null
}
