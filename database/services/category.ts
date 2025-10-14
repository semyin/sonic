// database/services/category.ts
import { eq, desc } from 'drizzle-orm'
import { getDb } from '../client'
import { categories, type Category, type NewCategory } from '../schema'

export interface CreateCategoryInput {
  name: string
  description?: string
}

export interface UpdateCategoryInput {
  name?: string
  description?: string
}

export class CategoryService {
  /**
   * Get all categories
   */
  async getAllCategories(): Promise<Category[]> {
    const db = getDb()
    return await db
      .select()
      .from(categories)
      .orderBy(desc(categories.createdAt))
  }

  /**
   * Get category by ID
   */
  async getCategoryById(id: number): Promise<Category | null> {
    const db = getDb()
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1)

    return result[0] || null
  }

  /**
   * Get category by name
   */
  async getCategoryByName(name: string): Promise<Category | null> {
    const db = getDb()
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.name, name))
      .limit(1)

    return result[0] || null
  }

  /**
   * Create a new category
   */
  async createCategory(input: CreateCategoryInput): Promise<Category> {
    const db = getDb()
    const newCategory: NewCategory = {
      name: input.name,
      description: input.description,
    }

    const result = await db
      .insert(categories)
      .values(newCategory)
      .returning()

    return result[0]
  }

  /**
   * Update a category
   */
  async updateCategory(id: number, input: UpdateCategoryInput): Promise<Category | null> {
    const db = getDb()
    const result = await db
      .update(categories)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, id))
      .returning()

    return result[0] || null
  }

  /**
   * Delete a category
   */
  async deleteCategory(id: number): Promise<boolean> {
    const db = getDb()
    const result = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning()

    return result.length > 0
  }
}
