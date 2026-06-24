export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:8787',
  clerkPublishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ?? '',
}

if (!env.clerkPublishableKey) {
  console.warn(
    'Missing VITE_CLERK_PUBLISHABLE_KEY. Copy .env.example to .env and add your Clerk publishable key.',
  )
}
