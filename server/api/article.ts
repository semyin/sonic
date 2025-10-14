// server/api/article.ts
import { Hono } from 'hono'
import { db } from '../../database/client'
import { ArticleService } from '../../database/article'
import type { Context } from 'hono'

export const articleRoutes = new Hono()

const articleService = new ArticleService(db)

// GET /api/articles - Get published articles with pagination
articleRoutes.get('/', async (c: Context) => {
  try {
    const page = Number(c.req.query('page')) || 1
    const pageSize = Number(c.req.query('pageSize')) || 10

    const articles = await articleService.getPublishedArticles(page, pageSize)
    const total = await articleService.getArticleCount(true)

    return c.json({
      success: true,
      data: {
        articles,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      }
    })
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// GET /api/articles/:id - Get article by ID with relations
articleRoutes.get('/:id', async (c: Context) => {
  try {
    const id = Number(c.req.param('id'))

    if (isNaN(id)) {
      return c.json({
        success: false,
        error: 'Invalid article ID'
      }, 400)
    }

    const article = await articleService.getArticleById(id)

    if (!article) {
      return c.json({
        success: false,
        error: 'Article not found'
      }, 404)
    }

    // Increment view count
    await articleService.incrementViewCount(id)

    return c.json({
      success: true,
      data: article
    })
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// GET /api/articles/category/:categoryId - Get articles by category
articleRoutes.get('/category/:categoryId', async (c: Context) => {
  try {
    const categoryId = Number(c.req.param('categoryId'))
    const page = Number(c.req.query('page')) || 1
    const pageSize = Number(c.req.query('pageSize')) || 10

    if (isNaN(categoryId)) {
      return c.json({
        success: false,
        error: 'Invalid category ID'
      }, 400)
    }

    const articles = await articleService.getArticlesByCategory(categoryId, page, pageSize)

    return c.json({
      success: true,
      data: {
        articles,
        pagination: { page, pageSize }
      }
    })
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// GET /api/articles/tag/:tagId - Get articles by tag
articleRoutes.get('/tag/:tagId', async (c: Context) => {
  try {
    const tagId = Number(c.req.param('tagId'))
    const page = Number(c.req.query('page')) || 1
    const pageSize = Number(c.req.query('pageSize')) || 10

    if (isNaN(tagId)) {
      return c.json({
        success: false,
        error: 'Invalid tag ID'
      }, 400)
    }

    const articles = await articleService.getArticlesByTag(tagId, page, pageSize)

    return c.json({
      success: true,
      data: {
        articles,
        pagination: { page, pageSize }
      }
    })
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// POST /api/articles - Create new article
articleRoutes.post('/', async (c: Context) => {
  try {
    const body = await c.req.json()

    const article = await articleService.createArticle(body)

    return c.json({
      success: true,
      data: article
    }, 201)
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// PUT /api/articles/:id - Update article
articleRoutes.put('/:id', async (c: Context) => {
  try {
    const id = Number(c.req.param('id'))
    const body = await c.req.json()

    if (isNaN(id)) {
      return c.json({
        success: false,
        error: 'Invalid article ID'
      }, 400)
    }

    const article = await articleService.updateArticle(id, body)

    if (!article) {
      return c.json({
        success: false,
        error: 'Article not found'
      }, 404)
    }

    return c.json({
      success: true,
      data: article
    })
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// DELETE /api/articles/:id - Delete article
articleRoutes.delete('/:id', async (c: Context) => {
  try {
    const id = Number(c.req.param('id'))

    if (isNaN(id)) {
      return c.json({
        success: false,
        error: 'Invalid article ID'
      }, 400)
    }

    await articleService.deleteArticle(id)

    return c.json({
      success: true,
      message: 'Article deleted successfully'
    })
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// POST /api/articles/:id/like - Increment like count
articleRoutes.post('/:id/like', async (c: Context) => {
  try {
    const id = Number(c.req.param('id'))

    if (isNaN(id)) {
      return c.json({
        success: false,
        error: 'Invalid article ID'
      }, 400)
    }

    await articleService.incrementLikeCount(id)

    return c.json({
      success: true,
      message: 'Like count incremented'
    })
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})
