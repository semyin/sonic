// server/api/index.ts
import { Hono } from 'hono'
import { articleRoutes } from './article'
import { categoryRoutes } from './category'
import { tagRoutes } from './tag'

export function createApiRouter() {
  const api = new Hono()

  // Mount route handlers
  api.route('/articles', articleRoutes)
  api.route('/categories', categoryRoutes)
  api.route('/tags', tagRoutes)

  return api
}
