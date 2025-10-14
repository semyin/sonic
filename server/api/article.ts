// server/api/article.ts
import { Hono } from 'hono'
import { getDb } from '../../database/client'
import { ArticleService } from '../../database/services'
import type { Context } from 'hono'
import { success, error, handleError } from '../utils/response'

export const articleRoutes = new Hono()

// GET /api/articles - Get published articles with pagination
articleRoutes.get('/', async (c: Context) => {
  try {
    const page = Number(c.req.query('page')) || 1
    const pageSize = Number(c.req.query('pageSize')) || 10

    const db = getDb()
    const articleService = new ArticleService(db)
    const articles = await articleService.getPublishedArticles(page, pageSize)

    return success(c, articles)
  } catch (err) {
    return handleError(c, err)
  }
})

// GET /api/articles/:id - Get article by ID with relations
articleRoutes.get('/:id', async (c: Context) => {
  try {
    const id = Number(c.req.param('id'))

    if (isNaN(id)) {
      return error(c, 'Invalid article ID', 400)
    }

    const db = getDb()
    const articleService = new ArticleService(db)
    const article = await articleService.getArticleById(id)

    if (!article) {
      return error(c, 'Article not found', 404)
    }

    // Increment view count
    await articleService.incrementViewCount(id)

    return success(c, article)
  } catch (err) {
    return handleError(c, err)
  }
})

// GET /api/articles/category/:categoryId - Get articles by category
articleRoutes.get('/category/:categoryId', async (c: Context) => {
  try {
    const categoryId = Number(c.req.param('categoryId'))
    const page = Number(c.req.query('page')) || 1
    const pageSize = Number(c.req.query('pageSize')) || 10

    if (isNaN(categoryId)) {
      return error(c, 'Invalid category ID', 400)
    }

    const db = getDb()
    const articleService = new ArticleService(db)
    const articles = await articleService.getArticlesByCategory(categoryId, page, pageSize)

    return success(c, articles)
  } catch (err) {
    return handleError(c, err)
  }
})

// GET /api/articles/tag/:tagId - Get articles by tag
articleRoutes.get('/tag/:tagId', async (c: Context) => {
  try {
    const tagId = Number(c.req.param('tagId'))
    const page = Number(c.req.query('page')) || 1
    const pageSize = Number(c.req.query('pageSize')) || 10

    if (isNaN(tagId)) {
      return error(c, 'Invalid tag ID', 400)
    }

    const db = getDb()
    const articleService = new ArticleService(db)
    const articles = await articleService.getArticlesByTag(tagId, page, pageSize)

    return success(c, articles)
  } catch (err) {
    return handleError(c, err)
  }
})

// POST /api/articles - Create new article
articleRoutes.post('/', async (c: Context) => {
  try {
    const body = await c.req.json()

    const db = getDb()
    const articleService = new ArticleService(db)
    const article = await articleService.createArticle(body)

    return success(c, article, 201)
  } catch (err) {
    return handleError(c, err)
  }
})

// PUT /api/articles/:id - Update article
articleRoutes.put('/:id', async (c: Context) => {
  try {
    const id = Number(c.req.param('id'))
    const body = await c.req.json()

    if (isNaN(id)) {
      return error(c, 'Invalid article ID', 400)
    }

    const db = getDb()
    const articleService = new ArticleService(db)
    const article = await articleService.updateArticle(id, body)

    if (!article) {
      return error(c, 'Article not found', 404)
    }

    return success(c, article)
  } catch (err) {
    return handleError(c, err)
  }
})

// DELETE /api/articles/:id - Delete article
articleRoutes.delete('/:id', async (c: Context) => {
  try {
    const id = Number(c.req.param('id'))

    if (isNaN(id)) {
      return error(c, 'Invalid article ID', 400)
    }

    const db = getDb()
    const articleService = new ArticleService(db)
    await articleService.deleteArticle(id)

    return success(c, null, 200, 'Article deleted successfully')
  } catch (err) {
    return handleError(c, err)
  }
})

// POST /api/articles/:id/like - Increment like count
articleRoutes.post('/:id/like', async (c: Context) => {
  try {
    const id = Number(c.req.param('id'))

    if (isNaN(id)) {
      return error(c, 'Invalid article ID', 400)
    }

    const db = getDb()
    const articleService = new ArticleService(db)
    await articleService.incrementLikeCount(id)

    return success(c, null, 200, 'Like count incremented')
  } catch (err) {
    return handleError(c, err)
  }
})
