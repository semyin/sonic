export { app as profileRoute }

import { createApp } from '@/server/utils'
import { result } from '@/server/utils/response'

const app = createApp()

app.get('/', async (c) => {
  const supabase = c.get('supabase')

  const response = await supabase.from('profile').select('*').single()

  return result.from(c, response, ['run_time', 'created_at', 'updated_at'])
})

app.put('/', async (c) => {
  const supabase = c.get('supabase')
  const body = await c.req.json()

  const response = await supabase.from('profile').update(body).eq('id', 1).select().single()

  return result.from(c, response, ['run_time', 'created_at', 'updated_at'])
})
