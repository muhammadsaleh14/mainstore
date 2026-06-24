import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'
import type { CreateCategoryInput } from '@/types/api'
import { createCategory, getCategories } from '../api/categories.api'

const CATEGORIES_KEY = ['categories']

export function useCategories() {
  return useQuery({
    queryKey: CATEGORIES_KEY,
    queryFn: getCategories,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: (input: CreateCategoryInput) => createCategory(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY })
      message.success('Category created')
    },
    onError: () => {
      message.error('Failed to create category')
    },
  })
}
