import { Database } from '@/supabase'
import { KVNamespace } from '@cloudflare/workers-types'
import { SupabaseClient } from '@supabase/supabase-js'
import { Hono } from 'hono'

type Variables = {
  supabase: SupabaseClient<Database>,
  KV: KVNamespace
}

export const createApp = () => {
  return new Hono<{ Variables: Variables }>()
}