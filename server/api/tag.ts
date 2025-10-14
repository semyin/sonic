// server/api/tag.ts
import { Hono } from 'hono'
import type { Context } from 'hono'
import { success, error, handleError } from '../utils/response'
import { TagService } from '../../database/services'

export const tagRoutes = new Hono()

const tagService = new TagService()

// GET /api/tags - Get all tags
tagRoutes.get('/', async (c: Context) => {
  try {
    const tags = await tagService.getAllTags()
    return success(c, tags)
  } catch (err) {
    return handleError(c, err)
  }
})

// GET /api/tags/:id - Get tag by ID
tagRoutes.get('/:id', async (c: Context) => {
  try {
    const id = Number(c.req.param('id'))

    if (isNaN(id)) {
      return error(c, 'Invalid tag ID', 400)
    }

    const tagData = await tagService.getTagById(id)

    if (!tagData) {
      return error(c, 'Tag not found', 404)
    }

    return success(c, tagData)
  } catch (err) {
    return handleError(c, err)
  }
})

// GET /api/tags/name/:name - Get tag by name
tagRoutes.get('/name/:name', async (c: Context) => {
  try {
    const name = c.req.param('name')
    const tagData = await tagService.getTagByName(name)

    if (!tagData) {
      return error(c, 'Tag not found', 404)
    }

    return success(c, tagData)
  } catch (err) {
    return handleError(c, err)
  }
})

// POST /api/tags - Create new tag
tagRoutes.post('/', async (c: Context) => {
  try {
    const body = await c.req.json()
    const newTag = await tagService.createTag(body)
    return success(c, newTag, 201)
  } catch (err) {
    return handleError(c, err)
  }
})

// POST /api/tags/bulk - Create or get multiple tags
tagRoutes.post('/bulk', async (c: Context) => {
  try {
    const body = await c.req.json()
    const { names } = body

    if (!Array.isArray(names)) {
      return error(c, 'names must be an array of strings', 400)
    }

    const tags = await tagService.getOrCreateTags(names)
    return success(c, tags)
  } catch (err) {
    return handleError(c, err)
  }
})

// PUT /api/tags/:id - Update tag
tagRoutes.put('/:id', async (c: Context) => {
  try {
    const id = Number(c.req.param('id'))
    const body = await c.req.json()

    if (isNaN(id)) {
      return error(c, 'Invalid tag ID', 400)
    }

    const updatedTag = await tagService.updateTag(id, body)

    if (!updatedTag) {
      return error(c, 'Tag not found', 404)
    }

    return success(c, updatedTag)
  } catch (err) {
    return handleError(c, err)
  }
})

// DELETE /api/tags/:id - Delete tag
tagRoutes.delete('/:id', async (c: Context) => {
  try {
    const id = Number(c.req.param('id'))

    if (isNaN(id)) {
      return error(c, 'Invalid tag ID', 400)
    }

    await tagService.deleteTag(id)
    return success(c, null, 200, 'Tag deleted successfully')
  } catch (err) {
    return handleError(c, err)
  }
})
