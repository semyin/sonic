export { createApiRouter }

import { logger } from '@/server/middleware/logger'
import { error } from '../utils/response'
import { articleRoutes } from './article/index'
import { categoryRoutes } from './category'
import { tagRoutes } from './tag'
import { healthRouter } from './health'
import { initSupabase } from '@/supabase'
import { createApp } from '../utils'

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
  app.route('/articles', articleRoutes)
  app.route('/categories', categoryRoutes)
  app.route('/tags', tagRoutes)
  app.route('/health', healthRouter)

  // 404 handler for API routes - must be last
  app.get('*', (c) => {
    return error(c, `API endpoint not found: ${c.req.method} ${c.req.path}`, 404)
  })

  return app
}
