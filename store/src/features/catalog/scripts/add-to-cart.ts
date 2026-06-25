import type { Product } from '@/types/api'
import { addCartItem } from '@/features/cart/lib/cart.store'

export function initAddToCartForm(product: Product): void {
  const form = document.getElementById('add-to-cart-form')
  const variantSelect = form?.querySelector('select[name="variantId"]')
  const quantityInput = form?.querySelector('input[name="quantity"]') as HTMLInputElement | null
  const stockLabel = document.getElementById('stock-label')
  const message = document.getElementById('cart-message')
  const variants = product.variants

  function getSelectedVariant() {
    const id = Number(variantSelect?.value)
    return variants.find((v) => v.id === id)
  }

  variantSelect?.addEventListener('change', () => {
    const variant = getSelectedVariant()
    if (!variant || !quantityInput || !stockLabel) return
    quantityInput.max = String(variant.stockQuantity)
    quantityInput.dataset.stock = String(variant.stockQuantity)
    stockLabel.textContent = `${variant.stockQuantity} in stock`
  })

  form?.addEventListener('submit', (event) => {
    event.preventDefault()
    const variant = getSelectedVariant()
    const quantity = Number(quantityInput?.value ?? 1)
    if (!variant || !message) return

    const ok = addCartItem({
      variantId: variant.id,
      quantity,
      productId: product.id,
      productName: product.name,
      sku: variant.sku,
      unitPrice: variant.price,
      stockQuantity: variant.stockQuantity,
    })

    if (!ok) {
      message.hidden = false
      message.className = 'alert alert-error'
      message.textContent = 'Not enough stock available'
      return
    }

    window.location.href = '/cart'
  })
}
