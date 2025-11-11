export { createApiRouter }

import { Hono } from 'hono'
import { logger } from '@/server/middleware/logger'
import { error } from '../utils/response'
import { articleRoutes } from './article'
import { categoryRoutes } from './category'
import { tagRoutes } from './tag'
import { healthRouter } from './health'
import { SupabaseClient } from '@supabase/supabase-js'
import { initSupabase } from '@/supabase'

type Variables = {
  supabase: SupabaseClient
}

function createApiRouter() {

  const app = new Hono<{ Variables: Variables }>()

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
