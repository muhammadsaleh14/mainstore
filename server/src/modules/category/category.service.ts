import type { Db } from '../../db'
import { findAllCategories, insertCategory } from './category.repository'
import type { CategoryInput } from './category.schema'

export async function listCategories(db: Db) {
  return findAllCategories(db)
}

export async function createCategory(db: Db, input: CategoryInput) {
  return insertCategory(db, input)
}
