export { Page }

import { usePageContext } from 'vike-react/usePageContext'
import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { articleApi } from '@/utils/api/post'
import { categoryApi } from '@/utils/api/category'
import { tagApi } from '@/utils/api/tag'
import { uploadApi } from '@/utils/api/upload'
import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Save, Upload, X } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Toast } from '@/components/ui/toast'

// Markdown 编辑器组件（客户端渲染）
function MarkdownEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [MDEditor, setMDEditor] = useState<any>(null)

  useEffect(() => {
    // 只在客户端加载编辑器
    import('@uiw/react-md-editor').then((mod) => {
      setMDEditor(() => mod.default)
    })

    // 添加自定义样式来优化工具栏
    const style = document.createElement('style')
    style.textContent = `
      .w-md-editor-toolbar {
        background-color: #fafafa !important;
        border-bottom: 1px solid #e5e7eb !important;
        padding: 12px 12px 8px 12px !important;
        display: flex !important;
        align-items: center !important;
      }
      .w-md-editor-toolbar button {
        font-size: 16px !important;
        font-weight: 400 !important;
        color: #6b7280 !important;
        padding: 6px 6px !important;
        margin: 0 2px !important;
        border-radius: 4px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      .w-md-editor-toolbar button:hover {
        background-color: #f3f4f6 !important;
        color: #374151 !important;
      }
      .w-md-editor-toolbar button.active {
        background-color: #e5e7eb !important;
        color: #1f2937 !important;
      }
      .w-md-editor-toolbar svg {
        width: 16px !important;
        height: 16px !important;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  if (!MDEditor) {
    return (
      <div className="w-full h-[500px] border border-gray-300 rounded flex items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">加载编辑器中...</p>
      </div>
    )
  }

  return (
    <div data-color-mode="light">
      <MDEditor
        value={value}
        onChange={(val: string | undefined) => onChange(val || '')}
        height={500}
        preview="edit"
      />
    </div>
  )
}

function Page() {
  const pageContext = usePageContext()
  const queryClient = useQueryClient()
  const id = pageContext.urlParsed.search.id as string | undefined
  const isEdit = !!id

  // 获取分类和标签列表
  const { data: categories = [] } = useSuspenseQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getList,
  })

  const { data: tags = [] } = useSuspenseQuery({
    queryKey: ['tags'],
    queryFn: tagApi.getList,
  })

  // 如果是编辑模式，获取文章数据
  const { data: article } = useSuspenseQuery({
    queryKey: ['article', id],
    queryFn: () => (isEdit ? articleApi.getById(Number(id)) : Promise.resolve(null)),
  })

  // 表单状态
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    cover_image: '',
    category_id: '',
    is_published: false,
    is_top: false,
  })

  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 处理图片上传
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setToast({ message: '只支持 JPG、PNG、GIF、WebP 格式的图片', type: 'error' })
      return
    }

    // 验证文件大小（20MB）
    if (file.size > 20 * 1024 * 1024) {
      setToast({ message: '图片大小不能超过 20MB', type: 'error' })
      return
    }

    setUploading(true)
    try {
      const result = await uploadApi.uploadImage(file)
      setFormData({ ...formData, cover_image: result.url })
      setToast({ message: '图片上传成功', type: 'success' })
    } catch (error: any) {
      setToast({ message: error.message || '图片上传失败', type: 'error' })
    } finally {
      setUploading(false)
      // 清空 input，允许重复上传同一文件
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // 编辑模式下，填充表单数据
  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || '',
        content: article.content || '',
        summary: article.summary || '',
        cover_image: article.cover_image || '',
        category_id: article.category_id?.toString() || '',
        is_published: article.is_published || false,
        is_top: article.is_top || false,
      })
      setSelectedTags(article.tags?.map(t => t.id) || [])
    }
  }, [article])

  // 表单验证
  const validateForm = () => {
    if (!formData.title.trim()) {
      setToast({ message: '请输入文章标题', type: 'error' })
      return false
    }
    if (!formData.content.trim()) {
      setToast({ message: '请输入文章内容', type: 'error' })
      return false
    }
    return true
  }

  // 创建/更新文章
  const saveMutation = useMutation({
    mutationFn: async () => {
      const data = {
        ...formData,
        category_id: formData.category_id ? Number(formData.category_id) : null,
      }

      if (isEdit) {
        await articleApi.update(Number(id), data)
        if (selectedTags.length > 0) {
          await articleApi.updateTags(Number(id), selectedTags)
        }
      } else {
        const result = await articleApi.create(data)
        if (selectedTags.length > 0 && result.id) {
          await articleApi.updateTags(result.id, selectedTags)
        }
      }
    },
    onSuccess: () => {
      setToast({ message: '保存成功', type: 'success' })
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] })
      setTimeout(() => {
        window.location.href = '/admin/posts'
      }, 1000)
    },
    onError: () => {
      setToast({ message: '保存失败，请重试', type: 'error' })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      saveMutation.mutate()
    }
  }

  const toggleTag = (tagId: number) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <a href="/admin/posts" className="p-1.5 hover:bg-gray-100 rounded transition-colors cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
        </a>
        <h1 className="text-lg font-semibold text-gray-900">
          {isEdit ? '编辑文章' : '新建文章'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white rounded border border-gray-200 p-4 space-y-4">
          {/* 标题 */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-950"
              placeholder="请输入文章标题"
            />
          </div>

          {/* 分类和置顶 */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">分类</label>
              <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="选择分类" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.emoji} {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4 sm:pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_top}
                  onChange={(e) => setFormData({ ...formData, is_top: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-gray-800 focus:ring-gray-800 cursor-pointer"
                />
                <span className="text-xs font-medium text-gray-700">置顶</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-gray-800 focus:ring-gray-800 cursor-pointer"
                />
                <span className="text-xs font-medium text-gray-700">发布</span>
              </label>
            </div>
          </div>

          {/* 标签 */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">标签</label>
            <div className="flex flex-wrap gap-2">
              {tags.length === 0 ? (
                <p className="text-xs text-gray-500">暂无标签</p>
              ) : (
                tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1.5 text-xs font-normal rounded transition-colors cursor-pointer ${
                      selectedTags.includes(tag.id)
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* 封面图片 */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">封面图片</label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.cover_image}
                  onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-950"
                  placeholder="请输入封面图片 URL 或点击上传"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Upload className="h-3.5 w-3.5" />
                  {uploading ? '上传中...' : '上传'}
                </button>
                {formData.cover_image && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, cover_image: '' })}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                    title="清除图片"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {formData.cover_image && (
                <div className="relative w-full h-48 border border-gray-200 rounded overflow-hidden bg-gray-50">
                  <img
                    src={formData.cover_image}
                    alt="封面预览"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f3f4f6" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="14"%3E图片加载失败%3C/text%3E%3C/svg%3E'
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* 摘要 */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">摘要</label>
            <textarea
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              rows={3}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-950 resize-none"
              placeholder="请输入文章摘要"
            />
          </div>

          {/* Markdown 编辑器 */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              内容 <span className="text-red-500">*</span>
            </label>
            <MarkdownEditor
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
            />
          </div>
        </div>

        {/* 提交按钮 */}
        <div className="flex justify-end gap-2">
          <a
            href="/admin/posts"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors cursor-pointer"
          >
            取消
          </a>
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded hover:bg-gray-800 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            {saveMutation.isPending ? '保存中...' : '保存'}
          </button>
        </div>
      </form>

      {/* Toast 提示 */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
