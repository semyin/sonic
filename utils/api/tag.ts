import type { Tables, TablesInsert, TablesUpdate } from '@/supabase'
import { request } from './request'

export type Tag = Tables<'tag'>
export type TagInsert = TablesInsert<'tag'>
export type TagUpdate = TablesUpdate<'tag'>

export const tagApi = {
  getList: () => request.get<Tag[]>('/tags'),

  getById: (id: number) => request.get<Tag>(`/tags/${id}`),

  create: (data: TagInsert) => request.post<Tag, TagInsert>('/tags', data),

  update: (id: number, data: TagUpdate) => request.put<Tag, TagUpdate>(`/tags/${id}`, data),

  delete: (id: number) => request.delete<Tag>(`/tags/${id}`),
}
