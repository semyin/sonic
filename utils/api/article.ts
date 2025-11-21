import type { Tables, TablesInsert, TablesUpdate } from '@/supabase'
import { request } from './request'

export type Article = Tables<'article'>
export type ArticleInsert = TablesInsert<'article'>
export type ArticleUpdate = TablesUpdate<'article'>

export type ArticleWithRelations = Article & {
  category: Tables<'category'> | null
  tags: Tables<'tag'>[]
}

export type ArticleAdmin = Pick<Article, 'id' | 'title' | 'cover_image' | 'is_top' | 'is_published' | 'view_count' | 'created_at' | 'updated_at'> & {
  category: { id: number; name: string } | null
  tags: { id: number; name: string }[]
}

export type ArticleSearchParams = {
  title?: string
  category_id?: number
  tag_id?: number
  is_published?: boolean
}

export const articleApi = {

  getList: () => request.get<Article[]>('/articles'),

  getAdminList: (params?: ArticleSearchParams) => request.get<ArticleAdmin[]>('/articles/admin', params as any),

  getById: (id: number) => request.get<ArticleWithRelations>(`/articles/${id}`),

  create: (data: ArticleInsert) => request.post<Article, ArticleInsert>('/articles', data),

  update: (id: number, data: ArticleUpdate) => request.put<Article, ArticleUpdate>(`/articles/${id}`, data),

  delete: (id: number) => request.delete<Article>(`/articles/${id}`),

  updatePublishStatus: (id: number, is_published: boolean) =>
    request.patch<Article, { is_published: boolean }>(`/articles/${id}/publish`, { is_published }),

  updateTags: (id: number, tagIds: number[]) =>
    request.put<Article, { tagIds: number[] }>(`/articles/${id}/tags`, { tagIds })
}
