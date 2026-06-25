import type { Order, OrderSummary } from '@/types/api'
import { apiUrl, authHeaders, parseJson } from '@/lib/api-client'

export async function fetchOrders(token: string): Promise<OrderSummary[]> {
  const response = await fetch(`${apiUrl}/orders`, {
    headers: authHeaders(token),
  })
  return parseJson<OrderSummary[]>(response)
}

export async function fetchOrder(token: string, id: number): Promise<Order> {
  const response = await fetch(`${apiUrl}/orders/${id}`, {
    headers: authHeaders(token),
  })
  return parseJson<Order>(response)
}
