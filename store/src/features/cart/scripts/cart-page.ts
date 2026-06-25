import {
  getCartItems,
  getCartSubtotal,
  removeCartItem,
  updateCartQuantity,
} from '@/features/cart/lib/cart.store'
import { cartLineTotal } from '@/features/cart/lib/cart.util'

export function initCartPage(rootId = 'cart-root'): void {
  const root = document.getElementById(rootId)
  if (!root) throw new Error('Cart root missing')

  function render() {
    const items = getCartItems()

    if (!items.length) {
      root.innerHTML = `
        <div class="empty">
          <p class="muted">Your cart is empty.</p>
          <a href="/" class="btn btn-primary">Continue shopping</a>
        </div>
      `
      return
    }

    const rows = items
      .map(
        (item) => `
          <tr>
            <td><a href="/products/${item.productId}">${item.productName}</a></td>
            <td>${item.sku}</td>
            <td>$${item.unitPrice}</td>
            <td>
              <input
                type="number"
                min="1"
                max="${item.stockQuantity}"
                value="${item.quantity}"
                data-variant-id="${item.variantId}"
                class="qty-input"
                style="width: 72px;"
              />
            </td>
            <td>$${cartLineTotal(item)}</td>
            <td>
              <button type="button" class="btn btn-danger" data-remove="${item.variantId}">Remove</button>
            </td>
          </tr>
        `,
      )
      .join('')

    root.innerHTML = `
      <table class="table">
        <thead>
          <tr>
            <th>Product</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="actions" style="justify-content: space-between; margin-top: 1.5rem;">
        <strong>Subtotal: $${getCartSubtotal()}</strong>
        <div class="actions">
          <a href="/" class="btn">Continue shopping</a>
          <a href="/checkout" class="btn btn-primary">Checkout</a>
        </div>
      </div>
    `

    root.querySelectorAll('.qty-input').forEach((input) => {
      input.addEventListener('change', () => {
        const variantId = Number(input.getAttribute('data-variant-id'))
        const quantity = Number((input as HTMLInputElement).value)
        updateCartQuantity(variantId, quantity)
        render()
      })
    })

    root.querySelectorAll('[data-remove]').forEach((button) => {
      button.addEventListener('click', () => {
        const variantId = Number(button.getAttribute('data-remove'))
        removeCartItem(variantId)
        render()
      })
    })
  }

  render()
}
