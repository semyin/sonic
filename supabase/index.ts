import { createClient } from '@supabase/supabase-js'
import { Article, ArticleInsert, ArticleUpdate } from './type'

export type Database = {
  public: {
    Tables: {
      articles: {
        Row: Article
        Insert: ArticleInsert
        Update: ArticleUpdate
      }
    }
  }
}

type InitOptions = {
  auth?: {
    persistSession?: boolean
  },
  global?: {
    headers?: Record<string, string>
  }
}

export function initSupabase(options?: InitOptions) {
  return createClient<Database>(import.meta.env.SUPABASE_URL, import.meta.env.SUPABASE_KEY, {
    global: {
      headers: options?.global?.headers,
    },
  })
}

export type SupabaseClient = ReturnType<typeof initSupabase>