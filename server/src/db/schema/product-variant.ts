import { boolean, integer, numeric, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { products } from './product'

export const productVariants = pgTable('product_variants', {
  id: serial('id').primaryKey(),
  productId: integer('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  sku: text('sku').notNull().unique(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  stockQuantity: integer('stock_quantity').notNull().default(0),
  barcode: text('barcode'),
  weightGrams: integer('weight_grams'),
  isDefault: boolean('is_default').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type ProductVariant = typeof productVariants.$inferSelect
export type NewProductVariant = typeof productVariants.$inferInsert
