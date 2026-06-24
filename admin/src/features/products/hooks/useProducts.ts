import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'
import type {
  CreateProductInput,
  UpdateProductInput,
  UpdateVariantInput,
  VariantInput,
} from '@/types/api'
import {
  addVariant,
  archiveProduct,
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  updateVariant,
} from '../api/products.api'

const PRODUCTS_KEY = ['products']
const productKey = (id: number) => ['product', id]

export function useProducts() {
  return useQuery({
    queryKey: PRODUCTS_KEY,
    queryFn: getProducts,
  })
}

export function useProduct(id: number | undefined) {
  return useQuery({
    queryKey: productKey(id ?? 0),
    queryFn: () => getProduct(id as number),
    enabled: typeof id === 'number' && id > 0,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: (input: CreateProductInput) => createProduct(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY })
      message.success('Product created')
    },
    onError: () => {
      message.error('Failed to create product')
    },
  })
}

export function useUpdateProduct(id: number) {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: (input: UpdateProductInput) => updateProduct(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY })
      queryClient.invalidateQueries({ queryKey: productKey(id) })
      message.success('Product updated')
    },
    onError: () => {
      message.error('Failed to update product')
    },
  })
}

export function useArchiveProduct() {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: (id: number) => archiveProduct(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY })
      queryClient.invalidateQueries({ queryKey: productKey(id) })
      message.success('Product archived')
    },
    onError: () => {
      message.error('Failed to archive product')
    },
  })
}

export function useAddVariant(productId: number) {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: (input: VariantInput) => addVariant(productId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY })
      queryClient.invalidateQueries({ queryKey: productKey(productId) })
      message.success('Variant added')
    },
    onError: () => {
      message.error('Failed to add variant')
    },
  })
}

export function useUpdateVariant(productId: number) {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: ({ variantId, input }: { variantId: number; input: UpdateVariantInput }) =>
      updateVariant(productId, variantId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY })
      queryClient.invalidateQueries({ queryKey: productKey(productId) })
      message.success('Variant updated')
    },
    onError: () => {
      message.error('Failed to update variant')
    },
  })
}
