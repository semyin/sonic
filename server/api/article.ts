import { success, error, handleError } from '../utils/response'
import { ArticleService } from '../../database/services'
import { createApp } from '../utils'

export const articleRoutes = createApp()

const articleService = new ArticleService()

articleRoutes.get('/', async (c) => {
  try {
    const page = Number(c.req.query('page')) || 1
    const pageSize = Number(c.req.query('pageSize')) || 10
    const supabase = c.get('supabase')

    const articles = await supabase
      .from('article')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1)

    return success(c, articles)
  } catch (err) {
    console.log(err);
    
    return handleError(c, err)
  }
})

// GET /api/articles/:id - Get article by ID with relations
articleRoutes.get('/:id', async (c) => {
  try {
    const id = Number(c.req.param('id'))

    if (isNaN(id)) {
      return error(c, 'Invalid article ID', 400)
    }

    const supabase = c.get('supabase')

    const { data: article, error: err } = await supabase
      .from('article')
      .select('*')
      .eq('id', id)
      .single()

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
articleRoutes.get('/category/:categoryId', async (c) => {
  try {
    const categoryId = Number(c.req.param('categoryId'))
    const page = Number(c.req.query('page')) || 1
    const pageSize = Number(c.req.query('pageSize')) || 10

    if (isNaN(categoryId)) {
      return error(c, 'Invalid category ID', 400)
    }

    const articles = await articleService.getArticlesByCategory(categoryId, page, pageSize)

    return success(c, articles)
  } catch (err) {
    return handleError(c, err)
  }
})

// GET /api/articles/tag/:tagId - Get articles by tag
articleRoutes.get('/tag/:tagId', async (c) => {
  try {
    const tagId = Number(c.req.param('tagId'))
    const page = Number(c.req.query('page')) || 1
    const pageSize = Number(c.req.query('pageSize')) || 10

    if (isNaN(tagId)) {
      return error(c, 'Invalid tag ID', 400)
    }

    const supabase = c.get('supabase')

    const articles = await supabase
      .from('article')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1)

    return success(c, articles)
  } catch (err) {
    return handleError(c, err)
  }
})

// POST /api/articles - Create new article
articleRoutes.post('/', async (c) => {
  try {
    const body = await c.req.json()

    const article = await articleService.createArticle(body)

    return success(c, article, 201)
  } catch (err) {
    return handleError(c, err)
  }
})

// PUT /api/articles/:id - Update article
articleRoutes.put('/:id', async (c) => {
  try {
    const id = Number(c.req.param('id'))
    const body = await c.req.json()

    if (isNaN(id)) {
      return error(c, 'Invalid article ID', 400)
    }

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
articleRoutes.delete('/:id', async (c) => {
  try {
    const id = Number(c.req.param('id'))

    if (isNaN(id)) {
      return error(c, 'Invalid article ID', 400)
    }

    await articleService.deleteArticle(id)

    return success(c, null, 200, 'Article deleted successfully')
  } catch (err) {
    return handleError(c, err)
  }
})

// POST /api/articles/:id/like - Increment like count
articleRoutes.post('/:id/like', async (c) => {
  try {
    const id = Number(c.req.param('id'))

    if (isNaN(id)) {
      return error(c, 'Invalid article ID', 400)
    }

    await articleService.incrementLikeCount(id)

    return success(c, null, 200, 'Like count incremented')
  } catch (err) {
    return handleError(c, err)
  }
})
