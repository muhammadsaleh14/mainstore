export type UserRole = 'admin' | 'manager' | 'customer'

export interface AdminUser {
  id: number
  clerkId: string
  email: string | null
  role: UserRole
  createdAt: string
}

export type ProductStatus = 'draft' | 'active' | 'archived'

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
