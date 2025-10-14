// server/api/tag.ts
import { Hono } from 'hono'
import { db } from '../../database/client'
import { TagService } from '../../database/tag'
import type { Context } from 'hono'

export const tagRoutes = new Hono()

const tagService = new TagService(db)

// GET /api/tags - Get all tags
tagRoutes.get('/', async (c: Context) => {
  try {
    const tags = await tagService.getAllTags()

    return c.json({
      success: true,
      data: tags
    })
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// GET /api/tags/:id - Get tag by ID
tagRoutes.get('/:id', async (c: Context) => {
  try {
    const id = Number(c.req.param('id'))

    if (isNaN(id)) {
      return c.json({
        success: false,
        error: 'Invalid tag ID'
      }, 400)
    }

    const tag = await tagService.getTagById(id)

    if (!tag) {
      return c.json({
        success: false,
        error: 'Tag not found'
      }, 404)
    }

    return c.json({
      success: true,
      data: tag
    })
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// GET /api/tags/name/:name - Get tag by name
tagRoutes.get('/name/:name', async (c: Context) => {
  try {
    const name = c.req.param('name')

    const tag = await tagService.getTagByName(name)

    if (!tag) {
      return c.json({
        success: false,
        error: 'Tag not found'
      }, 404)
    }

    return c.json({
      success: true,
      data: tag
    })
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// POST /api/tags - Create new tag
tagRoutes.post('/', async (c: Context) => {
  try {
    const body = await c.req.json()

    const tag = await tagService.createTag(body)

    return c.json({
      success: true,
      data: tag
    }, 201)
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// POST /api/tags/bulk - Create or get multiple tags
tagRoutes.post('/bulk', async (c: Context) => {
  try {
    const body = await c.req.json()
    const { names } = body

    if (!Array.isArray(names)) {
      return c.json({
        success: false,
        error: 'names must be an array of strings'
      }, 400)
    }

    const tags = await tagService.getOrCreateTags(names)

    return c.json({
      success: true,
      data: tags
    })
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// PUT /api/tags/:id - Update tag
tagRoutes.put('/:id', async (c: Context) => {
  try {
    const id = Number(c.req.param('id'))
    const body = await c.req.json()

    if (isNaN(id)) {
      return c.json({
        success: false,
        error: 'Invalid tag ID'
      }, 400)
    }

    const tag = await tagService.updateTag(id, body)

    if (!tag) {
      return c.json({
        success: false,
        error: 'Tag not found'
      }, 404)
    }

    return c.json({
      success: true,
      data: tag
    })
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// DELETE /api/tags/:id - Delete tag
tagRoutes.delete('/:id', async (c: Context) => {
  try {
    const id = Number(c.req.param('id'))

    if (isNaN(id)) {
      return c.json({
        success: false,
        error: 'Invalid tag ID'
      }, 400)
    }

    await tagService.deleteTag(id)

    return c.json({
      success: true,
      message: 'Tag deleted successfully'
    })
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})
