import { request } from './request'

export interface UploadResponse {
  path: string
  url: string
}

export const uploadApi = {
  uploadImage: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || '上传失败')
    }

    const data = await response.json()
    return data.data
  },

  deleteImage: (path: string) => request.delete(`/upload/${path}`),

  getImageList: (page = 1, pageSize = 100, folder = '') =>
    request.get(`/upload/list?page=${page}&pageSize=${pageSize}&folder=${folder}`),
}
