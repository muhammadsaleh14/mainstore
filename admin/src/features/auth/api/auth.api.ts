import { apiClient } from '@/lib/api-client'
import type { CurrentUser } from '@/types/api'

export async function getCurrentUser(): Promise<CurrentUser> {
  const { data } = await apiClient.get<CurrentUser>('/me')
  return data
}
