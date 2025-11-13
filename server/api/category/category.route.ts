export { app as categoryRoute }

import { createApp } from "@/server/utils";
import { result } from '@/server/utils/response'

const app = createApp()

app.get('/', async (c) => {
  const supabase = c.get('supabase')

  const response = await supabase
    .from('category')
    .select('*')

  return result.from(c, response)
})