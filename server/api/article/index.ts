export { app as articleRoutes }

import { createApp } from '@/server/utils'

const app  = createApp()

app.get('/', async (c) => {
  const page = Number(c.req.query('page')) || 1
    const pageSize = Number(c.req.query('pageSize')) || 10
    const supabase = c.get('supabase')

    const data = await supabase
      .from('article')
      .select('*')
      .eq('is_publishedd', true)
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1)
    // throw new Error( 'is_publishedd must be true')
    return c.json(data)
})
