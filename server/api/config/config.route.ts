export { app as configRoute }

import { createApp } from '@/server/utils'
import { result } from '@/server/utils/response'

const app = createApp()

app.get('/', async (c) => {
  const supabase = c.get('supabase')

  const response = await supabase.from('config').select('*').single()

  return result.from(c, response, ['run_time'])
})

app.put('/', async (c) => {
  const supabase = c.get('supabase')
  const body = await c.req.json()

  const response = await supabase.from('config').update(body).eq('id', 1).select().single()

  return result.from(c, response, ['run_time'])
})
