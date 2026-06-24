import { useAuth } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { setTokenGetter } from '@/lib/api-client'

/**
 * Bridges Clerk's session token into the axios client.
 * Renders nothing; runs once near the app root.
 */
export function AuthTokenSync() {
  const { getToken } = useAuth()

  useEffect(() => {
    setTokenGetter(() => getToken())
  }, [getToken])

  return null
}
