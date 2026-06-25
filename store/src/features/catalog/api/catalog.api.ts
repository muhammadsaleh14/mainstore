import type { Product } from '@/types/api'
import { apiUrl, parseJson } from '@/lib/api-client'

export async function fetchCatalog(): Promise<Product[]> {
  const response = await fetch(`${apiUrl}/catalog`)
  return parseJson<Product[]>(response)
}

export async function fetchProduct(id: number): Promise<Product> {
  const response = await fetch(`${apiUrl}/catalog/${id}`)
  return parseJson<Product>(response)
}
