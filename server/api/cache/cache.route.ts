export { app as cacheRoute }

import { createApp } from '@/server/utils'
import { result } from '@/server/utils/response'

const app = createApp()

app.get('/', async (c) => {
  const KV = c.env.KV
  const data = await KV.get('name')
  return result.ok(c, { value: data })
}) 