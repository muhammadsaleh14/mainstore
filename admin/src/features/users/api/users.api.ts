import { apiClient } from '@/lib/api-client'
import type { AdminUser, UserRole } from '@/types/api'

export async function getUsers(): Promise<AdminUser[]> {
  const { data } = await apiClient.get<AdminUser[]>('/users')
  return data
}

export async function updateUserRole(id: number, role: UserRole): Promise<AdminUser> {
  const { data } = await apiClient.patch<AdminUser>(`/users/${id}/role`, { role })
  return data
}
