export { Page }

import { Plus, Edit, Trash2, Search, X } from 'lucide-react'
import { useSuspenseQuery, useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { articleApi, type ArticleAdmin } from '@/utils/api/article'
import { categoryApi } from '@/utils/api/category'
import { tagApi } from '@/utils/api/tag'
import { format } from 'date-fns'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

function Page() {
  const queryClient = useQueryClient()
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [form, setForm] = useState({ title: '', category_id: '', tag_id: '', is_published: '' })
  const [search, setSearch] = useState({ title: '', category_id: '', tag_id: '', is_published: '' })

  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: categoryApi.getList })
  const { data: tags } = useQuery({ queryKey: ['tags'], queryFn: tagApi.getList })

  const { data, isFetching } = useSuspenseQuery({
    queryKey: ['admin-articles', search],
    queryFn: () => {
      const params: any = {}
      if (search.title) params.title = search.title
      if (search.category_id && search.category_id.trim()) params.category_id = Number(search.category_id)
      if (search.tag_id && search.tag_id.trim()) params.tag_id = Number(search.tag_id)
      if (search.is_published && search.is_published.trim()) params.is_published = search.is_published === 'true'
      return articleApi.getAdminList(Object.keys(params).length > 0 ? params : undefined)
    }
  })

  const handleSearch = () => setSearch(form)
  const handleReset = () => {
    setForm({ title: '', category_id: '', tag_id: '', is_published: '' })
    setSearch({ title: '', category_id: '', tag_id: '', is_published: '' })
  }

  const deleteMutation = useMutation({
    mutationFn: articleApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] })
      setDeleteId(null)
    }
  })

  const articles = data || []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">文章管理</h1>
        <a href="/admin/posts/edit" className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded hover:bg-gray-800 transition-colors cursor-pointer">
          <Plus className="h-3.5 w-3.5" />
          新建
        </a>
      </div>

      <div className="bg-white border border-gray-200 p-3">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索标题"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-48 h-8 pl-2 pr-7 text-sm border border-gray-300 focus:outline-none focus:border-gray-400"
            />
            {form.title && (
              <button
                onClick={() => setForm({ ...form, title: '' })}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <Select value={form.category_id} onValueChange={(val) => setForm({ ...form, category_id: val })}>
            <SelectTrigger className="w-32 h-8 text-sm">
              <SelectValue placeholder="全部分类" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" " className="text-sm">全部分类</SelectItem>
              {categories?.map(cat => <SelectItem key={cat.id} value={String(cat.id)} className="text-sm">{cat.name}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={form.tag_id} onValueChange={(val) => setForm({ ...form, tag_id: val })}>
            <SelectTrigger className="w-32 h-8 text-sm">
              <SelectValue placeholder="全部标签" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" " className="text-sm">全部标签</SelectItem>
              {tags?.map(tag => <SelectItem key={tag.id} value={String(tag.id)} className="text-sm">{tag.name}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={form.is_published} onValueChange={(val) => setForm({ ...form, is_published: val })}>
            <SelectTrigger className="w-28 h-8 text-sm">
              <SelectValue placeholder="全部状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" " className="text-sm">全部状态</SelectItem>
              <SelectItem value="true" className="text-sm">已发布</SelectItem>
              <SelectItem value="false" className="text-sm">草稿</SelectItem>
            </SelectContent>
          </Select>

          <button
            onClick={handleSearch}
            className="flex items-center gap-1 px-3 h-8 text-sm bg-gray-900 text-white hover:bg-gray-800 cursor-pointer"
          >
            <Search className="h-3.5 w-3.5" />
            搜索
          </button>
          <button
            onClick={handleReset}
            className="px-3 h-8 text-sm text-gray-700 border border-gray-300 hover:bg-gray-50 cursor-pointer"
          >
            重置
          </button>
        </div>
      </div>

      {isFetching && (
        <div className="bg-white rounded border border-gray-200 p-12 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
            <span className="text-sm text-gray-600">加载中...</span>
          </div>
        </div>
      )}

      {!isFetching && (
        <div className="bg-white rounded border border-gray-200 overflow-x-auto">
          <table className="w-full text-xs min-w-[800px]">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-3 py-2 text-center font-medium text-gray-600 whitespace-nowrap">ID</th>
              <th className="px-3 py-2 text-center font-medium text-gray-600 whitespace-nowrap">标题</th>
              <th className="px-3 py-2 text-center font-medium text-gray-600 whitespace-nowrap">分类</th>
              <th className="px-3 py-2 text-center font-medium text-gray-600 whitespace-nowrap">标签</th>
              <th className="px-3 py-2 text-center font-medium text-gray-600 whitespace-nowrap">状态</th>
              <th className="px-3 py-2 text-center font-medium text-gray-600 whitespace-nowrap">浏览</th>
              <th className="px-3 py-2 text-center font-medium text-gray-600 whitespace-nowrap hidden md:table-cell">创建日期</th>
              <th className="px-3 py-2 text-center font-medium text-gray-600 whitespace-nowrap hidden lg:table-cell">更新日期</th>
              <th className="px-3 py-2 text-center font-medium text-gray-600 whitespace-nowrap">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {articles.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-3 py-12 text-center text-gray-400 text-sm">
                  暂无数据
                </td>
              </tr>
            ) : (
              articles.map((article: ArticleAdmin) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2.5 font-medium text-gray-900 text-center whitespace-nowrap">{article.id}</td>
                  <td className="px-3 py-2.5 font-medium text-gray-900 max-w-[200px] truncate">{article.title}</td>
                  <td className="px-3 py-2.5 text-center text-gray-600 whitespace-nowrap">{article.category?.name || '-'}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex gap-1 flex-wrap justify-center max-w-[150px]">
                      {article.tags.map(tag => (
                        <span key={tag.id} className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-[10px] whitespace-nowrap">
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap ${
                      article.is_published ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {article.is_published ? '已发布' : '草稿'}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center text-gray-600 whitespace-nowrap">{article.view_count}</td>
                  <td className="px-3 py-2.5 text-center text-gray-600 whitespace-nowrap hidden md:table-cell">{format(new Date(article.created_at), 'yyyy-MM-dd HH:mm:ss')}</td>
                  <td className="px-3 py-2.5 text-center text-gray-600 whitespace-nowrap hidden lg:table-cell">{format(new Date(article.updated_at), 'yyyy-MM-dd HH:mm:ss')}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex justify-center gap-0.5 whitespace-nowrap">
                      <a href={`/admin/posts/edit?id=${article.id}`} className="p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors cursor-pointer">
                        <Edit className="h-3.5 w-3.5" />
                      </a>
                      <button
                        onClick={() => setDeleteId(article.id)}
                        disabled={deleteMutation.isPending}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      )}

      <Dialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="w-[80%] sm:max-w-sm p-3 sm:p-4">
          <DialogHeader className="space-y-1.5 sm:space-y-2">
            <DialogTitle className="text-sm sm:text-base">删除文章</DialogTitle>
            <DialogDescription className="text-xs">
              确定要删除这篇文章吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-3 sm:mt-4 flex-row justify-center sm:justify-end">
            <button
              onClick={() => setDeleteId(null)}
              className="flex-1 sm:flex-none px-2.5 py-0.5 sm:px-3 sm:py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors cursor-pointer"
            >
              取消
            </button>
            <button
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              disabled={deleteMutation.isPending}
              className="flex-1 sm:flex-none px-2.5 py-0.5 sm:px-3 sm:py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
            >
              确定删除
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
