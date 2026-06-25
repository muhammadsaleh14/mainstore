import { getClientSessionToken } from '@/features/auth/lib/clerk-client'
import { createCheckout } from '@/features/checkout/api/checkout.api'
import { parseShippingAddress } from '@/features/checkout/lib/checkout.util'
import {
  clearCart,
  getCartItems,
  getCartSubtotal,
  getCheckoutItems,
} from '@/features/cart/lib/cart.store'

export function initCheckoutPage(rootId = 'checkout-root'): void {
  const root = document.getElementById(rootId)
  if (!root) throw new Error('Checkout root missing')

  const items = getCartItems()

  if (!items.length) {
    root.innerHTML = `
      <div class="alert alert-info">Your cart is empty.</div>
      <a href="/" class="btn btn-primary" style="margin-top: 1rem;">Shop now</a>
    `
    return
  }

  const summary = items
    .map(
      (item) => `
        <div class="summary-line">
          <span>${item.productName} × ${item.quantity}</span>
          <span>$${item.unitPrice}</span>
        </div>
      `,
    )
    .join('')

  root.innerHTML = `
    <div class="row row-2">
      <form id="checkout-form" class="card stack">
        <h2 style="margin: 0;">Shipping address</h2>
        <label class="field">
          <span>Full name</span>
          <input name="fullName" required />
        </label>
        <label class="field">
          <span>Address line 1</span>
          <input name="line1" required />
        </label>
        <label class="field">
          <span>Address line 2</span>
          <input name="line2" />
        </label>
        <div class="field-grid">
          <label class="field">
            <span>City</span>
            <input name="city" required />
          </label>
          <label class="field">
            <span>State / Province</span>
            <input name="state" />
          </label>
        </div>
        <div class="field-grid">
          <label class="field">
            <span>Postal code</span>
            <input name="postalCode" required />
          </label>
          <label class="field">
            <span>Country</span>
            <input name="country" value="US" required />
          </label>
        </div>
        <label class="field">
          <span>Phone</span>
          <input name="phone" />
        </label>
        <p id="checkout-error" class="alert alert-error" hidden></p>
        <button type="submit" class="btn btn-primary btn-block" id="place-order-btn">Place order</button>
      </form>

      <div class="card stack">
        <h2 style="margin: 0;">Order summary</h2>
        ${summary}
        <strong>Subtotal: $${getCartSubtotal()}</strong>
        <a href="/cart" class="btn btn-block">Back to cart</a>
      </div>
    </div>
  `

  const form = document.getElementById('checkout-form') as HTMLFormElement
  const errorEl = document.getElementById('checkout-error')
  const submitBtn = document.getElementById('place-order-btn') as HTMLButtonElement

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    if (!errorEl || !submitBtn) return

    errorEl.hidden = true
    submitBtn.disabled = true
    submitBtn.textContent = 'Placing order…'

    try {
      const token = await getClientSessionToken()
      if (!token) throw new Error('Please sign in to checkout')

      const result = await createCheckout(token, {
        shippingAddress: parseShippingAddress(form),
        items: getCheckoutItems(),
      })

      clearCart()
      window.location.href = `/checkout/success?orderId=${result.orderId}`
    } catch (error) {
      errorEl.hidden = false
      errorEl.textContent =
        error instanceof Error ? error.message : 'Checkout failed. Check your cart and try again.'
      submitBtn.disabled = false
      submitBtn.textContent = 'Place order'
    }
  })
}
