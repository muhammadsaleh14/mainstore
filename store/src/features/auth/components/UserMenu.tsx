import { UserButton } from '@clerk/astro/react'

export function UserMenu() {
  return <UserButton afterSignOutUrl="/" />
}
