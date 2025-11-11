export { app as healthRouter }

import { Hono } from 'hono'

export const app = new Hono()

app.get('', (c) => {

  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
})