// server/api/category.ts
import { Hono } from 'hono'
import { db } from '../../database/client'
import { CategoryService } from '../../database/category'
import type { Context } from 'hono'

export const categoryRoutes = new Hono()

const categoryService = new CategoryService(db)

// GET /api/categories - Get all categories
categoryRoutes.get('/', async (c: Context) => {
  try {
    const categories = await categoryService.getAllCategories()

    return c.json({
      success: true,
      data: categories
    })
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// GET /api/categories/:id - Get category by ID
categoryRoutes.get('/:id', async (c: Context) => {
  try {
    const id = Number(c.req.param('id'))

    if (isNaN(id)) {
      return c.json({
        success: false,
        error: 'Invalid category ID'
      }, 400)
    }

    const category = await categoryService.getCategoryById(id)

    if (!category) {
      return c.json({
        success: false,
        error: 'Category not found'
      }, 404)
    }

    return c.json({
      success: true,
      data: category
    })
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// POST /api/categories - Create new category
categoryRoutes.post('/', async (c: Context) => {
  try {
    const body = await c.req.json()

    const category = await categoryService.createCategory(body)

    return c.json({
      success: true,
      data: category
    }, 201)
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// PUT /api/categories/:id - Update category
categoryRoutes.put('/:id', async (c: Context) => {
  try {
    const id = Number(c.req.param('id'))
    const body = await c.req.json()

    if (isNaN(id)) {
      return c.json({
        success: false,
        error: 'Invalid category ID'
      }, 400)
    }

    const category = await categoryService.updateCategory(id, body)

    if (!category) {
      return c.json({
        success: false,
        error: 'Category not found'
      }, 404)
    }

    return c.json({
      success: true,
      data: category
    })
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// DELETE /api/categories/:id - Delete category
categoryRoutes.delete('/:id', async (c: Context) => {
  try {
    const id = Number(c.req.param('id'))

    if (isNaN(id)) {
      return c.json({
        success: false,
        error: 'Invalid category ID'
      }, 400)
    }

    await categoryService.deleteCategory(id)

    return c.json({
      success: true,
      message: 'Category deleted successfully'
    })
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})
