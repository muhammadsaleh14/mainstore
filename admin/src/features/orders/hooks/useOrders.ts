import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'
import type { OrderStatusUpdate } from '@/types/api'
import { getOrder, getOrders, updateOrderStatus } from '../api/orders.api'

const ORDERS_KEY = ['orders']
const orderKey = (id: number) => ['order', id]

export function useOrders() {
  return useQuery({
    queryKey: ORDERS_KEY,
    queryFn: getOrders,
  })
}

export function useOrder(id: number | undefined) {
  return useQuery({
    queryKey: orderKey(id ?? 0),
    queryFn: () => getOrder(id as number),
    enabled: typeof id === 'number' && id > 0,
  })
}

export function useUpdateOrderStatus(id: number) {
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  return useMutation({
    mutationFn: (status: OrderStatusUpdate) => updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_KEY })
      queryClient.invalidateQueries({ queryKey: orderKey(id) })
      message.success('Order status updated')
    },
    onError: () => {
      message.error('Failed to update order status')
    },
  })
}
