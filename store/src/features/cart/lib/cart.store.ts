import { centsToString, toCents } from '@/lib/money'
import type { CartLine } from '@/types/api'
import { cartLineTotal } from './cart.util'

const STORAGE_KEY = 'mainstore-cart'
export const CART_UPDATED_EVENT = 'mainstore-cart-updated'

export interface CartLineInput {
  variantId: number
  quantity?: number
  productId: number
  productName: string
  sku: string
  unitPrice: string
  stockQuantity: number
}

function readCart(): CartLine[] {
  if (typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as { state?: { items?: CartLine[] }; items?: CartLine[] }
    return parsed.state?.items ?? parsed.items ?? []
  } catch {
    return []
  }
}

function writeCart(items: CartLine[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ state: { items }, version: 0 }))
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT))
}

export function getCartItems(): CartLine[] {
  return readCart()
}

export function getCartItemCount(): number {
  return readCart().reduce((sum, item) => sum + item.quantity, 0)
}

export function getCartSubtotal(): string {
  const cents = readCart().reduce((sum, item) => sum + toCents(item.unitPrice) * item.quantity, 0)
  return centsToString(cents)
}

export function getCheckoutItems(): { variantId: number; quantity: number }[] {
  return readCart().map((item) => ({ variantId: item.variantId, quantity: item.quantity }))
}

export function addCartItem(input: CartLineInput): boolean {
  const quantity = input.quantity ?? 1
  const items = readCart()
  const existing = items.find((item) => item.variantId === input.variantId)

  if (existing) {
    const nextQuantity = existing.quantity + quantity
    if (nextQuantity > input.stockQuantity) return false
    writeCart(
      items.map((item) =>
        item.variantId === input.variantId
          ? { ...item, quantity: nextQuantity, stockQuantity: input.stockQuantity }
          : item,
      ),
    )
    return true
  }

  if (quantity > input.stockQuantity) return false

  writeCart([
    ...items,
    {
      variantId: input.variantId,
      quantity,
      productId: input.productId,
      productName: input.productName,
      sku: input.sku,
      unitPrice: input.unitPrice,
      stockQuantity: input.stockQuantity,
    },
  ])
  return true
}

export function updateCartQuantity(variantId: number, quantity: number): void {
  if (quantity <= 0) {
    removeCartItem(variantId)
    return
  }
  writeCart(
    readCart().map((item) =>
      item.variantId === variantId
        ? { ...item, quantity: Math.min(quantity, item.stockQuantity) }
        : item,
    ),
  )
}

export function removeCartItem(variantId: number): void {
  writeCart(readCart().filter((item) => item.variantId !== variantId))
}

export function clearCart(): void {
  writeCart([])
}
