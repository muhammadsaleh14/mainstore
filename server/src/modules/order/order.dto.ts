import { z } from 'zod'

export const shippingAddressSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  line1: z.string().trim().min(1, 'Address line 1 is required'),
  line2: z.string().trim().min(1).nullable().default(null),
  city: z.string().trim().min(1, 'City is required'),
  state: z.string().trim().min(1).nullable().default(null),
  postalCode: z.string().trim().min(1, 'Postal code is required'),
  country: z.string().trim().min(1, 'Country is required'),
  phone: z.string().trim().min(1).nullable().default(null),
})

export const checkoutLineItemSchema = z.object({
  variantId: z.number().int().positive('Invalid variant id'),
  quantity: z.number().int('Quantity must be an integer').min(1),
})

export const checkoutSchema = z.object({
  shippingAddress: shippingAddressSchema,
  items: z.array(checkoutLineItemSchema).min(1, 'Your cart is empty'),
})

export const updateOrderStatusSchema = z.object({
  status: z.enum(['shipped', 'delivered', 'cancelled']),
})

export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>
export type CheckoutLineItem = z.infer<typeof checkoutLineItemSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>
