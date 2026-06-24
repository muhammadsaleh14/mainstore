import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  parentId: integer('parent_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert
