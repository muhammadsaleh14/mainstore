import { apiClient } from '@/lib/api-client'
import type { Product } from '@/types/api'

export async function getProducts(): Promise<Product[]> {
  const { data } = await apiClient.get<Product[]>('/products')
  return data
}
