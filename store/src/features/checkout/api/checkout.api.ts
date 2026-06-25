import type { CheckoutInput } from '@/types/api'
import { apiUrl, authHeaders, parseJson } from '@/lib/api-client'

export async function createCheckout(
  token: string,
  input: CheckoutInput,
): Promise<{ orderId: number }> {
  const response = await fetch(`${apiUrl}/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(token),
    },
    body: JSON.stringify(input),
  })
  return parseJson<{ orderId: number }>(response)
}
