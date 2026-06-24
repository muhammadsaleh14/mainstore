import { apiClient } from '@/lib/api-client'
import type { Category, CreateCategoryInput } from '@/types/api'

export async function getCategories(): Promise<Category[]> {
  const { data } = await apiClient.get<Category[]>('/categories')
  return data
}

export async function createCategory(input: CreateCategoryInput): Promise<Category> {
  const { data } = await apiClient.post<Category>('/categories', input)
  return data
}
