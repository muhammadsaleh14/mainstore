import { useAuth } from '@clerk/clerk-react'
import { useQuery } from '@tanstack/react-query'
import { getCurrentUser } from '../api/auth.api'

export function useCurrentUser() {
  const { isSignedIn } = useAuth()

  return useQuery({
    queryKey: ['current-user'],
    queryFn: getCurrentUser,
    enabled: !!isSignedIn,
  })
}
