export type UserRole = 'admin' | 'manager' | 'customer'

export interface AdminUser {
  id: number
  clerkId: string
  email: string | null
  role: UserRole
  createdAt: string
}

export type ProductStatus = 'enabled' | 'disabled'

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
  status: ProductStatus
  categoryId: number | null
  createdAt: string
  updatedAt: string
  variants: ProductVariant[]
}

export interface CurrentUser {
  clerkId: string
  email: string | null
  role: UserRole
  user: AdminUser
}

export interface Category {
  id: number
  name: string
  slug: string
  parentId: number | null
  createdAt: string
}

export interface CreateCategoryInput {
  name: string
  slug?: string
  parentId?: number | null
}

export interface VariantInput {
  sku: string
  price: string
  stockQuantity: number
  barcode?: string | null
  weightGrams?: number | null
  isDefault?: boolean
}

export interface CreateProductInput {
  name: string
  slug?: string
  description?: string | null
  status?: ProductStatus
  categoryId?: number | null
  defaultVariant: VariantInput
}

export interface UpdateProductInput {
  name?: string
  slug?: string
  description?: string | null
  status?: ProductStatus
  categoryId?: number | null
}

export type UpdateVariantInput = Partial<VariantInput>

export type OrderStatus = 'pending_payment' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'failed'
export type OrderStatusUpdate = 'shipped' | 'delivered' | 'cancelled'

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
