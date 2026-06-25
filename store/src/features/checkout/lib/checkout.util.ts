import type { ShippingAddress } from '@/types/api'

export function parseShippingAddress(form: HTMLFormElement): ShippingAddress {
  const data = new FormData(form)
  const trim = (key: string) => String(data.get(key) ?? '').trim()
  const optional = (key: string) => {
    const value = trim(key)
    return value.length > 0 ? value : null
  }

  return {
    fullName: trim('fullName'),
    line1: trim('line1'),
    line2: optional('line2'),
    city: trim('city'),
    state: optional('state'),
    postalCode: trim('postalCode'),
    country: trim('country'),
    phone: optional('phone'),
  }
}
