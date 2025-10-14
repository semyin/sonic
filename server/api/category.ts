// server/api/category.ts
import { Hono } from 'hono'
import { db } from '../../database/client'
import { CategoryService } from '../../database/services'
import type { Context } from 'hono'
import { success, error, handleError } from '../utils/response'

export const categoryRoutes = new Hono()

const categoryService = new CategoryService(db)

// GET /api/categories - Get all categories
categoryRoutes.get('/', async (c: Context) => {
  try {
    const categories = await categoryService.getAllCategories()
    return success(c, categories)
  } catch (err) {
    return handleError(c, err)
  }
})

// GET /api/categories/:id - Get category by ID
categoryRoutes.get('/:id', async (c: Context) => {
  try {
    const id = Number(c.req.param('id'))

    if (isNaN(id)) {
      return error(c, 'Invalid category ID', 400)
    }

    const category = await categoryService.getCategoryById(id)

    if (!category) {
      return error(c, 'Category not found', 404)
    }

    return success(c, category)
  } catch (err) {
    return handleError(c, err)
  }
})

// POST /api/categories - Create new category
categoryRoutes.post('/', async (c: Context) => {
  try {
    const body = await c.req.json()
    const category = await categoryService.createCategory(body)
    return success(c, category, 201)
  } catch (err) {
    return handleError(c, err)
  }
})

// PUT /api/categories/:id - Update category
categoryRoutes.put('/:id', async (c: Context) => {
  try {
    const id = Number(c.req.param('id'))
    const body = await c.req.json()

    if (isNaN(id)) {
      return error(c, 'Invalid category ID', 400)
    }

    const category = await categoryService.updateCategory(id, body)

    if (!category) {
      return error(c, 'Category not found', 404)
    }

    return success(c, category)
  } catch (err) {
    return handleError(c, err)
  }
})

// DELETE /api/categories/:id - Delete category
categoryRoutes.delete('/:id', async (c: Context) => {
  try {
    const id = Number(c.req.param('id'))

    if (isNaN(id)) {
      return error(c, 'Invalid category ID', 400)
    }

    await categoryService.deleteCategory(id)
    return success(c, { message: 'Category deleted successfully' })
  } catch (err) {
    return handleError(c, err)
  }
})
