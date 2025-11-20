export { app as articleRoute }

import { createApp } from '@/server/utils'
import { result } from '@/server/utils/response'

const app = createApp()

app.get('/', async (c) => {
  console.log(111);
  
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
    .select(`*, 
      category(id, name, description, created_at, updated_at, emoji), 
      tags:tag(id, name, img_url, created_at, updated_at)`)
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

app.patch('/:id/publish', async (c) => {
  const id = Number(c.req.param('id'))
  const body = await c.req.json()
  const { is_published } = body
  const supabase = c.get('supabase')

  const response = await supabase
    .from('article')
    .update({ is_published })
    .eq('id', id)
    .select()
    .single()

  return result.from(c, response)
})

app.put('/:id/tags', async (c) => {
  const id = Number(c.req.param('id'))
  const supabase = c.get('supabase')
  const { tagIds } = await c.req.json<{ tagIds: number[] }>()

  await supabase.from('article_tag').delete().eq('article_id', id)

  if (tagIds.length > 0) {
    const response = await supabase
      .from('article_tag')
      .insert(tagIds.map(tag_id => ({ article_id: id, tag_id })))

    return result.from(c, response)
  }

  return result.from(c, { data: [], error: null })
})
