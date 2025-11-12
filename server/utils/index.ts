import { Database } from '@/supabase'
import { SupabaseClient } from '@supabase/supabase-js'
import { Hono } from 'hono'

type Variables = {
  supabase: SupabaseClient<Database>
}

export const createApp = () => {
  return new Hono<{ Variables: Variables }>()
}