export { app as articleRoute }

import { createApp } from '@/server/utils'
import { result } from '@/server/utils/response'

const app = createApp()

app.get('/', async (c) => {
  const page = Number(c.req.query('page')) || 1
  const pageSize = Number(c.req.query('pageSize')) || 10
  const supabase = c.get('supabase')

  const response = await supabase
    .from('article')
    .select('id, title, created_at', { count: 'exact' })
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1)

  return result.from(c, response)
})

app.get('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const supabase = c.get('supabase')

  const response = await supabase
    .from('article')
    .select('*, category(id, name, description, created_at, updated_at, emoji)')
    .eq('id', id)
    .single()

  return result.from(c, response)
})
