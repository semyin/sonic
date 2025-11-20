import type { Tables, TablesInsert, TablesUpdate } from '@/supabase'
import { request } from './request'

export type Category = Tables<'category'>
export type CategoryInsert = TablesInsert<'category'>
export type CategoryUpdate = TablesUpdate<'category'>

export const categoryApi = {
  getList: () => request.get<Category[]>('/categories'),

  getById: (id: number) => request.get<Category>(`/categories/${id}`),

  create: (data: CategoryInsert) => request.post<Category, CategoryInsert>('/categories', data),

  update: (id: number, data: CategoryUpdate) => request.put<Category, CategoryUpdate>(`/categories/${id}`, data),

  delete: (id: number) => request.delete<Category>(`/categories/${id}`),
}
