export interface ProductVariant {
  id: number
  sku: string
  price: string
  stockQuantity: number
  barcode: string | null
  weightGrams: number | null
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string | null
  status: 'enabled' | 'disabled'
  categoryId: number | null
  createdAt: string
  updatedAt: string
  variants: ProductVariant[]
}

export interface CartLine {
  variantId: number
  quantity: number
  productId: number
  productName: string
  sku: string
  unitPrice: string
  stockQuantity: number
}

export interface ShippingAddress {
  fullName: string
  line1: string
  line2: string | null
  city: string
  state: string | null
  postalCode: string
  country: string
  phone: string | null
}

export interface CheckoutInput {
  shippingAddress: ShippingAddress
  items: { variantId: number; quantity: number }[]
}

export type OrderStatus = 'pending_payment' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'failed'

export interface OrderItem {
  id: number
  productId: number | null
  variantId: number | null
  productName: string
  variantSku: string
  unitPrice: string
  quantity: number
  lineTotal: string
}

export interface Order {
  id: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  subtotal: string
  shippingTotal: string
  total: string
  currency: string
  shippingAddress: ShippingAddress
  customerEmail: string | null
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

export interface OrderSummary {
  id: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  total: string
  currency: string
  customerEmail: string | null
  createdAt: string
}
