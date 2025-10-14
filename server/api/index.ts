// server/api/index.ts
import { Hono } from 'hono'
import { detailedLogger } from '../middleware/logger-detailed'
import { error } from '../utils/response'
import { articleRoutes } from './article'
import { categoryRoutes } from './category'
import { tagRoutes } from './tag'

export function createApiRouter() {
  const api = new Hono()

  // Apply detailed logger only for API routes
  api.use('*', detailedLogger)

  // Mount route handlers
  api.route('/articles', articleRoutes)
  api.route('/categories', categoryRoutes)
  api.route('/tags', tagRoutes)

  // 404 handler for API routes - must be last
  api.get('*', (c) => {
    return error(c, `API endpoint not found: ${c.req.method} ${c.req.path}`, 404)
  })

  return api
}
