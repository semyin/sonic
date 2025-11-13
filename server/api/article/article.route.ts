export { app as articleRoute }

import { createApp } from '@/server/utils'
import { result } from '@/server/utils/response'

const app = createApp()

app.get('/', async (c) => {
  const supabase = c.get('supabase')

  const response = await supabase
    .from('article')
    .select('id, title, created_at', { count: 'exact' })
    .eq('is_published', true)
    .order('created_at', { ascending: false })

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

app.post('/', async (c) => {
  const supabase = c.get('supabase')
  const body = await c.req.json()

  const response = await supabase
    .from('article')
    .insert(body)
    .select()
    .single()

  return result.from(c, response)
})

app.put('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const supabase = c.get('supabase')
  const body = await c.req.json()

  const response = await supabase
    .from('article')
    .update(body)
    .eq('id', id)
    .select()
    .single()

  return result.from(c, response)
})

app.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const supabase = c.get('supabase')

  const response = await supabase
    .from('article')
    .delete()
    .eq('id', id)
    .select()
    .single()

  return result.from(c, response)
})
