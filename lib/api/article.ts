import type { Tables, TablesInsert, TablesUpdate } from '@/supabase'
import { apiClient } from './client'

export type Article = Tables<'article'>
export type ArticleInsert = TablesInsert<'article'>
export type ArticleUpdate = TablesUpdate<'article'>

export type ArticleWithRelations = Article & {
  category: Tables<'category'> | null
  tags: Tables<'tag'>[]
}

export const articleApi = {
  getList: () => apiClient.get('/api/articles'),
  getById: (id: number) => apiClient.get(`/api/articles/${id}`),
  create: (data: ArticleInsert) => apiClient.post('/api/articles', data),
  update: (id: number, data: ArticleUpdate) => apiClient.put(`/api/articles/${id}`, data),
  delete: (id: number) => apiClient.delete(`/api/articles/${id}`),
  updatePublishStatus: (id: number, is_published: boolean) =>
    apiClient.patch(`/api/articles/${id}/publish`, { is_published }),
  updateTags: (id: number, tagIds: number[]) =>
    apiClient.put(`/api/articles/${id}/tags`, { tagIds })
}
