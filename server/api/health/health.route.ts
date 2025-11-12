export { app as healthRouter }

import { createApp } from '@/server/utils'
import { result } from '@/server/utils/response'

export const app = createApp()

app.get('', (c) => {

  return result.from(c, {
    error: null,
    data: {
      timestamp: new Date().toISOString(),
    }
  }, ['timestamp'])
})