/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_API_URL: string
  readonly PUBLIC_CLERK_PUBLISHABLE_KEY: string
  readonly CLERK_SECRET_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
