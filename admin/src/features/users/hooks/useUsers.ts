import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'
import type { UserRole } from '@/types/api'
import { getUsers, updateUserRole } from '../api/users.api'

const USERS_KEY = ['users']

export function useUsers() {
  return useQuery({
    queryKey: USERS_KEY,
    queryFn: getUsers,
  })
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: ({ id, role }: { id: number; role: UserRole }) => updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY })
      message.success('Role updated')
    },
    onError: () => {
      message.error('Failed to update role')
    },
  })
}
