import type { User as ClerkUser } from '@clerk/backend'

export function getPrimaryEmail(clerkUser: ClerkUser): string | null {
  const primary = clerkUser.emailAddresses.find(
    (address) => address.id === clerkUser.primaryEmailAddressId,
  )

  return primary?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress ?? null
}
