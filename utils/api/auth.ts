import { request } from './request'

export const authApi = {
  
  login: (email: string, password: string) => request.post('/auth/login', { email, password }),

  logout: () => request.post('/auth/logout'),
}