import { apiUrl } from '@/config/env'

export async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    const message = typeof body.error === 'string' ? body.error : response.statusText
    throw new Error(message || 'Request failed')
  }
  return response.json() as Promise<T>
}

export function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` }
}

export { apiUrl }
