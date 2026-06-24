import type { Db } from '../../db'
import { categories } from '../../db/schema/category'
import type { NewCategory } from '../../db/schema/category'

export async function findAllCategories(db: Db) {
  return db.select().from(categories)
}

export async function insertCategory(db: Db, data: NewCategory) {
  const [category] = await db.insert(categories).values(data).returning()
  return category
}
