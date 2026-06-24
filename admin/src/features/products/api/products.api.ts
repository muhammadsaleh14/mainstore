import { apiClient } from '@/lib/api-client'
import type {
  CreateProductInput,
  Product,
  UpdateProductInput,
  UpdateVariantInput,
  VariantInput,
} from '@/types/api'

export async function getProducts(): Promise<Product[]> {
  const { data } = await apiClient.get<Product[]>('/products')
  return data
}

export async function getProduct(id: number): Promise<Product> {
  const { data } = await apiClient.get<Product>(`/products/${id}`)
  return data
}

export async function createProduct(input: CreateProductInput): Promise<Product> {
  const { data } = await apiClient.post<Product>('/products', input)
  return data
}

export async function updateProduct(id: number, input: UpdateProductInput): Promise<Product> {
  const { data } = await apiClient.patch<Product>(`/products/${id}`, input)
  return data
}

export async function archiveProduct(id: number): Promise<Product> {
  const { data } = await apiClient.delete<Product>(`/products/${id}`)
  return data
}

export async function addVariant(productId: number, input: VariantInput): Promise<Product> {
  const { data } = await apiClient.post<Product>(`/products/${productId}/variants`, input)
  return data
}

export async function updateVariant(
  productId: number,
  variantId: number,
  input: UpdateVariantInput,
): Promise<Product> {
  const { data } = await apiClient.patch<Product>(
    `/products/${productId}/variants/${variantId}`,
    input,
  )
  return data
}
