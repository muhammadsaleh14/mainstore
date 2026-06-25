import type { ShippingAddress } from '@/types/api'

export function formatShippingAddress(address: ShippingAddress): string {
  return [
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.postalCode,
    address.country,
  ]
    .filter(Boolean)
    .join(', ')
}
