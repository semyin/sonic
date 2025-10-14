// database/services/article.ts
import { eq, desc, and, sql } from 'drizzle-orm'
import { getDb } from '../client'
import { articles, articleTags, tags, categories, users, type Article, type NewArticle } from '../schema'

export interface CreateArticleInput {
  title: string
  content: string
  summary?: string
  authorId: number
  categoryId?: number
  coverImage?: string
  isPublished?: boolean
  isTop?: boolean
  type?: string
  tagIds?: number[] // 标签 ID 数组
}

export interface UpdateArticleInput {
  title?: string
  content?: string
  summary?: string
  categoryId?: number | null
  coverImage?: string | null
  isPublished?: boolean
  isTop?: boolean
  type?: string
  tagIds?: number[] // 更新标签
}

export interface ArticleWithRelations extends Omit<Article, 'tags'> {
  author?: { id: number; username: string; avatarUrl: string | null }
  category?: { id: number; name: string } | null
  tags?: { id: number; name: string }[]
}

export class ArticleService {
  /**
   * Get all published articles with pagination
   */
  async getPublishedArticles(page = 1, pageSize = 10): Promise<ArticleWithRelations[]> {
    const db = getDb()
    const offset = (page - 1) * pageSize

    return await db
      .select({
        id: articles.id,
        title: articles.title,
        content: articles.content,
        summary: articles.summary,
        authorId: articles.authorId,
        categoryId: articles.categoryId,
        coverImage: articles.coverImage,
        isPublished: articles.isPublished,
        isTop: articles.isTop,
        viewCount: articles.viewCount,
        likeCount: articles.likeCount,
        commentCount: articles.commentCount,
        type: articles.type,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
        author: {
          id: users.id,
          username: users.username,
          avatarUrl: users.avatarUrl,
        },
        category: {
          id: categories.id,
          name: categories.name,
        },
      })
      .from(articles)
      .leftJoin(users, eq(articles.authorId, users.id))
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .where(eq(articles.isPublished, true))
      .orderBy(desc(articles.isTop), desc(articles.createdAt))
      .limit(pageSize)
      .offset(offset) as ArticleWithRelations[]
  }

  /**
   * Get article by ID with full relations
   */
  async getArticleById(id: number): Promise<ArticleWithRelations | null> {
    const db = getDb()
    const result = await db
      .select({
        id: articles.id,
        title: articles.title,
        content: articles.content,
        summary: articles.summary,
        authorId: articles.authorId,
        categoryId: articles.categoryId,
        coverImage: articles.coverImage,
        isPublished: articles.isPublished,
        isTop: articles.isTop,
        viewCount: articles.viewCount,
        likeCount: articles.likeCount,
        commentCount: articles.commentCount,
        type: articles.type,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
        author: {
          id: users.id,
          username: users.username,
          avatarUrl: users.avatarUrl,
        },
        category: {
          id: categories.id,
          name: categories.name,
        },
      })
      .from(articles)
      .leftJoin(users, eq(articles.authorId, users.id))
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .where(eq(articles.id, id))
      .limit(1)

    if (!result[0]) return null

    // Get tags separately
    const articleTagsResult = await db
      .select({
        id: tags.id,
        name: tags.name,
      })
      .from(articleTags)
      .innerJoin(tags, eq(articleTags.tagId, tags.id))
      .where(eq(articleTags.articleId, id))

    return {
      ...result[0],
      tags: articleTagsResult,
    } as ArticleWithRelations
  }

  /**
   * Create a new article
   */
  async createArticle(input: CreateArticleInput): Promise<Article> {
    const db = getDb()
    const newArticle: NewArticle = {
      title: input.title,
      content: input.content,
      summary: input.summary,
      authorId: input.authorId,
      categoryId: input.categoryId,
      coverImage: input.coverImage,
      isPublished: input.isPublished ?? false,
      isTop: input.isTop ?? false,
      type: input.type ?? 'article',
    }

    const result = await db
      .insert(articles)
      .values(newArticle)
      .returning()

    const article = result[0]

    // Add tags if provided
    if (input.tagIds && input.tagIds.length > 0) {
      await this.addTagsToArticle(article.id, input.tagIds)
    }

    return article
  }

  /**
   * Update an existing article
   */
  async updateArticle(id: number, input: UpdateArticleInput): Promise<Article | null> {
    const db = getDb()
    const updateData: any = {
      ...input,
      updatedAt: new Date(),
    }

    // Remove tagIds from update data as it's handled separately
    delete updateData.tagIds

    const result = await db
      .update(articles)
      .set(updateData)
      .where(eq(articles.id, id))
      .returning()

    if (!result[0]) return null

    // Update tags if provided
    if (input.tagIds !== undefined) {
      await this.replaceArticleTags(id, input.tagIds)
    }

    return result[0]
  }

  /**
   * Delete an article
   */
  async deleteArticle(id: number): Promise<boolean> {
    const db = getDb()
    const result = await db
      .delete(articles)
      .where(eq(articles.id, id))
      .returning()

    return result.length > 0
  }

  /**
   * Increment view count
   */
  async incrementViewCount(id: number): Promise<void> {
    const db = getDb()
    await db
      .update(articles)
      .set({ viewCount: sql`${articles.viewCount} + 1` })
      .where(eq(articles.id, id))
  }

  /**
   * Increment like count
   */
  async incrementLikeCount(id: number): Promise<void> {
    const db = getDb()
    await db
      .update(articles)
      .set({ likeCount: sql`${articles.likeCount} + 1` })
      .where(eq(articles.id, id))
  }

  /**
   * Get article count
   */
  async getArticleCount(publishedOnly = false): Promise<number> {
    const db = getDb()
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(articles)
      .where(publishedOnly ? eq(articles.isPublished, true) : undefined)

    return Number(result[0].count)
  }

  /**
   * Get articles by category
   */
  async getArticlesByCategory(categoryId: number, page = 1, pageSize = 10): Promise<Article[]> {
    const db = getDb()
    const offset = (page - 1) * pageSize

    return await db
      .select()
      .from(articles)
      .where(and(eq(articles.categoryId, categoryId), eq(articles.isPublished, true)))
      .orderBy(desc(articles.createdAt))
      .limit(pageSize)
      .offset(offset)
  }

  /**
   * Get articles by tag
   */
  async getArticlesByTag(tagId: number, page = 1, pageSize = 10): Promise<Article[]> {
    const db = getDb()
    const offset = (page - 1) * pageSize

    const results = await db
      .select({
        id: articles.id,
        title: articles.title,
        content: articles.content,
        summary: articles.summary,
        authorId: articles.authorId,
        categoryId: articles.categoryId,
        tags: articles.tags,
        coverImage: articles.coverImage,
        isPublished: articles.isPublished,
        isTop: articles.isTop,
        viewCount: articles.viewCount,
        likeCount: articles.likeCount,
        commentCount: articles.commentCount,
        type: articles.type,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
      })
      .from(articles)
      .innerJoin(articleTags, eq(articles.id, articleTags.articleId))
      .where(and(eq(articleTags.tagId, tagId), eq(articles.isPublished, true)))
      .orderBy(desc(articles.createdAt))
      .limit(pageSize)
      .offset(offset)

    return results as Article[]
  }

  /**
   * Add tags to article
   */
  private async addTagsToArticle(articleId: number, tagIds: number[]): Promise<void> {
    if (tagIds.length === 0) return

    const db = getDb()
    const values = tagIds.map(tagId => ({
      articleId,
      tagId,
    }))

    await db.insert(articleTags).values(values)
  }

  /**
   * Replace article tags
   */
  private async replaceArticleTags(articleId: number, tagIds: number[]): Promise<void> {
    const db = getDb()
    // Delete existing tags
    await db.delete(articleTags).where(eq(articleTags.articleId, articleId))

    // Add new tags
    if (tagIds.length > 0) {
      await this.addTagsToArticle(articleId, tagIds)
    }
  }

  /**
   * Get all articles (admin)
   */
  async getAllArticles(page = 1, pageSize = 20): Promise<Article[]> {
    const db = getDb()
    const offset = (page - 1) * pageSize

    return await db
      .select()
      .from(articles)
      .orderBy(desc(articles.createdAt))
      .limit(pageSize)
      .offset(offset)
  }

  /**
   * Get top articles
   */
  async getTopArticles(): Promise<Article[]> {
    const db = getDb()
    return await db
      .select()
      .from(articles)
      .where(and(eq(articles.isTop, true), eq(articles.isPublished, true)))
      .orderBy(desc(articles.createdAt))
  }
}
