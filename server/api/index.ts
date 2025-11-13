export { createApiRouter }

import { logger } from '@/server/middleware/logger'
import { articleRoute } from './article/article.route'
import { categoryRoute } from './category/category.route'
import { tagRoutes } from './tag'
import { healthRouter } from './health/health.route'
import { initSupabase } from '@/supabase'
import { createApp } from '../utils'
import { result } from '../utils/response'

function createApiRouter() {

  const app = createApp()

  // Apply logger for API routes
  app.use('*', logger)

  app.use('*', async (c, next) => {
    const supabase = initSupabase()
    c.set('supabase', supabase)
    await next()
  })

  // Mount route handlers
  app.route('/articles', articleRoute)
  app.route('/categories', categoryRoute)
  app.route('/tags', tagRoutes)
  app.route('/health', healthRouter)

  // 404 handler for API routes - must be last
  app.get('*', (c) => {
    return result.error(c, `API endpoint not found: ${c.req.method} ${c.req.path}`, 404)
  })

  app.onError((err, c) => {
    console.error('API Error:', err)
    return result.error(c, err.message || 'Internal Server Error', 500)
  })

  return app
}
