import { apiClient } from '@/lib/api-client'
import type { Order, OrderStatusUpdate, OrderSummary } from '@/types/api'

export async function getOrders(): Promise<OrderSummary[]> {
  const { data } = await apiClient.get<OrderSummary[]>('/orders')
  return data
}

export async function getOrder(id: number): Promise<Order> {
  const { data } = await apiClient.get<Order>(`/orders/${id}`)
  return data
}

export async function updateOrderStatus(id: number, status: OrderStatusUpdate): Promise<Order> {
  const { data } = await apiClient.patch<Order>(`/orders/${id}/status`, { status })
  return data
}
