import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../api/products.api'

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  })
}
