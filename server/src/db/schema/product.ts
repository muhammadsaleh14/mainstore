import { integer, pgEnum, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { categories } from './category'

export const productStatusEnum = pgEnum('product_status', ['enabled', 'disabled'])

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  status: productStatusEnum('status').notNull().default('disabled'),
  categoryId: integer('category_id').references(() => categories.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert
export type ProductStatus = (typeof productStatusEnum.enumValues)[number]
