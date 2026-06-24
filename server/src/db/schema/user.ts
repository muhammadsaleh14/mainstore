import { pgEnum, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const roleEnum = pgEnum('role', ['admin', 'manager', 'customer'])

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  clerkId: text('clerk_id').notNull().unique(),
  email: text('email'),
  role: roleEnum('role').notNull().default('customer'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
