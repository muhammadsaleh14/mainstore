import { CART_UPDATED_EVENT, getCartItemCount } from '@/features/cart/lib/cart.store'

export function initCartBadge(badgeId = 'cart-badge'): void {
  const badge = document.getElementById(badgeId)
  if (!badge) return

  function updateBadge() {
    const count = getCartItemCount()
    badge.textContent = count > 0 ? String(count) : ''
  }

  updateBadge()
  window.addEventListener(CART_UPDATED_EVENT, updateBadge)
  window.addEventListener('storage', updateBadge)
}
