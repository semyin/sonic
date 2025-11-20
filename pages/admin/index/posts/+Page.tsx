export { Page }

import { Plus, Edit, Trash2 } from 'lucide-react'
import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { articleApi, type ArticleAdmin } from '@/utils/api/post'
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

function Page() {
  const queryClient = useQueryClient()
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { data } = useSuspenseQuery({
    queryKey: ['admin-articles'],
    queryFn: articleApi.getAdminList
  })

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
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded hover:bg-gray-800 transition-colors cursor-pointer">
          <Plus className="h-3.5 w-3.5" />
          新建
        </button>
      </div>

      <div className="bg-white rounded border border-gray-200">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-3 py-2 text-center font-medium text-gray-600">ID</th>
              <th className="px-3 py-2 text-center font-medium text-gray-600">标题</th>
              <th className="px-3 py-2 text-center font-medium text-gray-600">分类</th>
              <th className="px-3 py-2 text-center font-medium text-gray-600 w-[20%]">标签</th>
              <th className="px-3 py-2 text-center font-medium text-gray-600">状态</th>
              <th className="px-3 py-2 text-center font-medium text-gray-600">浏览</th>
              <th className="px-3 py-2 text-center font-medium text-gray-600">创建日期</th>
              <th className="px-3 py-2 text-center font-medium text-gray-600">更新日期</th>
              <th className="px-3 py-2 text-center font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {articles.map((article: ArticleAdmin) => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="px-3 py-2.5 font-medium text-gray-900 text-center">{article.id}</td>
                <td className="px-3 py-2.5 font-medium text-gray-900">{article.title}</td>
                <td className="px-3 py-2.5 text-center text-gray-600">{article.category?.name || '-'}</td>
                <td className="px-3 py-2.5">
                  <div className="flex gap-1 flex-wrap justify-center">
                    {article.tags.map(tag => (
                      <span key={tag.id} className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-[10px]">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-2.5 text-center">
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                    article.is_published ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {article.is_published ? '已发布' : '草稿'}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-center text-gray-600">{article.view_count}</td>
                <td className="px-3 py-2.5 text-center text-gray-600">{format(new Date(article.created_at), 'yyyy-MM-dd HH:mm:ss')}</td>
                <td className="px-3 py-2.5 text-center text-gray-600">{format(new Date(article.updated_at), 'yyyy-MM-dd HH:mm:ss')}</td>
                <td className="px-3 py-2.5">
                  <div className="flex justify-center gap-0.5">
                    <button className="p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors cursor-pointer">
                      <Edit className="h-3.5 w-3.5" />
                    </button>
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
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="max-w-sm p-4">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-base">删除文章</DialogTitle>
            <DialogDescription className="text-xs">
              确定要删除这篇文章吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-4">
            <button
              onClick={() => setDeleteId(null)}
              className="px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors cursor-pointer"
            >
              取消
            </button>
            <button
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              disabled={deleteMutation.isPending}
              className="px-2 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
            >
              确定删除
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
