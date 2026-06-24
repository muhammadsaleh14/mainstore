import axios from 'axios'
import { env } from '@/config/env'

type TokenGetter = () => Promise<string | null>

let tokenGetter: TokenGetter | null = null

/**
 * Registers how the API client should obtain a fresh Clerk session token.
 * Called once from <AuthTokenSync /> so axios stays decoupled from React.
 */
export function setTokenGetter(getter: TokenGetter) {
  tokenGetter = getter
}

export const apiClient = axios.create({
  baseURL: env.apiUrl,
})

apiClient.interceptors.request.use(async (config) => {
  if (tokenGetter) {
    const token = await tokenGetter()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})
