import { $isLoadedStore, $sessionStore } from '@clerk/astro/client'

function waitForClerkLoaded(): Promise<void> {
  if ($isLoadedStore.get()) return Promise.resolve()

  return new Promise((resolve) => {
    const unsubscribe = $isLoadedStore.subscribe((loaded) => {
      if (loaded) {
        unsubscribe()
        resolve()
      }
    })
  })
}

export async function getClientSessionToken(): Promise<string | null> {
  await waitForClerkLoaded()
  const session = $sessionStore.get()
  if (!session) return null
  return session.getToken()
}
