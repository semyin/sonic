// database/category.ts
import { eq, desc } from 'drizzle-orm'
import type { DrizzleDb } from './types'
import { categories, type Category, type NewCategory } from './schema'

export interface CreateCategoryInput {
  name: string
  description?: string
}

export interface UpdateCategoryInput {
  name?: string
  description?: string
}

export class CategoryService {
  constructor(private db: DrizzleDb) {}

  /**
   * Get all categories
   */
  async getAllCategories(): Promise<Category[]> {
    return await this.db
      .select()
      .from(categories)
      .orderBy(desc(categories.createdAt))
  }

  /**
   * Get category by ID
   */
  async getCategoryById(id: number): Promise<Category | null> {
    const result = await this.db
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
    const result = await this.db
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
    const newCategory: NewCategory = {
      name: input.name,
      description: input.description,
    }

    const result = await this.db
      .insert(categories)
      .values(newCategory)
      .returning()

    return result[0]
  }

  /**
   * Update a category
   */
  async updateCategory(id: number, input: UpdateCategoryInput): Promise<Category | null> {
    const result = await this.db
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
    const result = await this.db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning()

    return result.length > 0
  }
}
