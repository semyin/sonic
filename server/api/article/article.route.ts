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

app.get('/admin', async (c) => {
  const supabase = c.get('supabase')
  const { title, category_id, tag_id, is_published } = c.req.query()

  let query = supabase
    .from('article')
    .select(`
      id, title, cover_image, is_top, is_published, view_count, created_at, updated_at,
      category(id, name),
      tags:tag(id, name)
    `, { count: 'exact' })

  if (title) query = query.ilike('title', `%${title}%`)
  if (category_id) query = query.eq('category_id', Number(category_id))
  if (is_published !== undefined) query = query.eq('is_published', is_published === 'true')
  if (tag_id) {
    const { data: articleIds } = await supabase
      .from('article_tag')
      .select('article_id')
      .eq('tag_id', Number(tag_id))
    if (articleIds) query = query.in('id', articleIds.map(a => a.article_id))
  }

  const response = await query.order('created_at', { ascending: false })

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
