// database/tag.ts
import { eq, desc, inArray } from 'drizzle-orm'
import type { DrizzleDb } from './types'
import { tags, articleTags, type Tag, type NewTag } from './schema'

export interface CreateTagInput {
  name: string
}

export interface UpdateTagInput {
  name?: string
}

export class TagService {
  constructor(private db: DrizzleDb) {}

  /**
   * Get all tags
   */
  async getAllTags(): Promise<Tag[]> {
    return await this.db
      .select()
      .from(tags)
      .orderBy(desc(tags.createdAt))
  }

  /**
   * Get tag by ID
   */
  async getTagById(id: number): Promise<Tag | null> {
    const result = await this.db
      .select()
      .from(tags)
      .where(eq(tags.id, id))
      .limit(1)

    return result[0] || null
  }

  /**
   * Get tag by name
   */
  async getTagByName(name: string): Promise<Tag | null> {
    const result = await this.db
      .select()
      .from(tags)
      .where(eq(tags.name, name))
      .limit(1)

    return result[0] || null
  }

  /**
   * Get or create tags by names (useful for bulk operations)
   */
  async getOrCreateTags(names: string[]): Promise<Tag[]> {
    const uniqueNames = [...new Set(names)]
    const results: Tag[] = []

    for (const name of uniqueNames) {
      let tag = await this.getTagByName(name)
      if (!tag) {
        tag = await this.createTag({ name })
      }
      results.push(tag)
    }

    return results
  }

  /**
   * Create a new tag
   */
  async createTag(input: CreateTagInput): Promise<Tag> {
    const newTag: NewTag = {
      name: input.name,
    }

    const result = await this.db
      .insert(tags)
      .values(newTag)
      .returning()

    return result[0]
  }

  /**
   * Update a tag
   */
  async updateTag(id: number, input: UpdateTagInput): Promise<Tag | null> {
    const result = await this.db
      .update(tags)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(tags.id, id))
      .returning()

    return result[0] || null
  }

  /**
   * Delete a tag
   */
  async deleteTag(id: number): Promise<boolean> {
    const result = await this.db
      .delete(tags)
      .where(eq(tags.id, id))
      .returning()

    return result.length > 0
  }

  /**
   * Get tags for an article
   */
  async getTagsForArticle(articleId: number): Promise<Tag[]> {
    return await this.db
      .select({
        id: tags.id,
        name: tags.name,
        createdAt: tags.createdAt,
        updatedAt: tags.updatedAt,
      })
      .from(articleTags)
      .innerJoin(tags, eq(articleTags.tagId, tags.id))
      .where(eq(articleTags.articleId, articleId))
  }
}
