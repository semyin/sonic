export { app as uploadRoute }

import { createApp } from '@/server/utils'
import { result } from '@/server/utils/response'

const app = createApp()

// 允许的图片类型
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml'
]

// 最大文件大小 (20MB)
const MAX_FILE_SIZE = 20 * 1024 * 1024

// 生成安全的文件名（移除中文和特殊字符）
function generateSafeFileName(originalName: string): string {
  // 获取文件扩展名
  const lastDotIndex = originalName.lastIndexOf('.')
  const ext = lastDotIndex !== -1 ? originalName.substring(lastDotIndex) : ''

  // 生成随机字符串
  const randomStr = Math.random().toString(36).substring(2, 15)
  const timestamp = Date.now()

  // 返回：时间戳-随机字符串.扩展名
  return `${timestamp}-${randomStr}${ext}`
}

// 上传文件
app.post('/', async (c) => {
  const supabase = c.get('supabase')
  const body = await c.req.parseBody()
  const file = body['file'] as File

  if (!file) {
    return result.error(c, 'No file provided', 400)
  }

  // 验证文件类型
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return result.error(c, `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`, 400)
  }

  // 验证文件大小
  if (file.size > MAX_FILE_SIZE) {
    return result.error(c, `File size exceeds maximum limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`, 400)
  }

  // 生成安全的文件名
  const fileName = generateSafeFileName(file.name)
  const bucketName = import.meta.env.SUPABASE_BUCKET_NAME

  // 上传文件
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, file, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    return result.error(c, error.message, 500)
  }

  // 获取公开 URL
  const { data: urlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName)

  return result.ok(c, {
    path: data.path,
    url: urlData.publicUrl
  })
})

// 删除文件
app.delete('/:path', async (c) => {
  const supabase = c.get('supabase')
  const path = c.req.param('path')
  const bucketName = 'images'

  const { error } = await supabase.storage
    .from(bucketName)
    .remove([path])

  if (error) {
    return result.error(c, error.message, 500)
  }

  return result.ok(c, { message: 'File deleted successfully' })
})

// 获取文件列表
app.get('/list', async (c) => {
  const supabase = c.get('supabase')
  const bucketName = 'images'
  const { folder = '' } = c.req.query()

  const { data, error } = await supabase.storage
    .from(bucketName)
    .list(folder, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' }
    })

  if (error) {
    return result.error(c, error.message, 500)
  }

  return result.ok(c, data)
})
