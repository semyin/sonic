export { app as healthRouter }

import { createApp } from '@/server/utils'

export const app = createApp()  

app.get('', (c) => {
  
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
})