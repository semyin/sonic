// server/index.ts

import { Hono } from 'hono'
import { apply } from 'vike-cloudflare/hono'
import { serve } from 'vike-cloudflare/hono/serve'
import { createApiRouter } from './api'
import { logger } from './middleware/logger'

function startServer() {
  const app = new Hono()

  // Apply logger middleware globally
  app.use('*', logger)

  // Mount API routes
  const api = createApiRouter()
  app.route('/api', api)

  // Apply Vike middleware (must be after API routes)
  apply(app)

  return serve(app, { port: 3000 })
}

export default startServer()