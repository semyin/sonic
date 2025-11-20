export { Page }

import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { articleApi, type Article } from '@/utils/api/post'
import { format } from 'date-fns'

function Page() {
  const queryClient = useQueryClient()

  const { data } = useSuspenseQuery({
    queryKey: ['articles'],
    queryFn: articleApi.getList
  })

  const deleteMutation = useMutation({
    mutationFn: articleApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
    }
  })

  const articles = data || []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">文章管理</h1>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded hover:bg-gray-800 transition-colors">
          <Plus className="h-3.5 w-3.5" />
          新建
        </button>
      </div>

      <div className="bg-white rounded border border-gray-200">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-3 py-2 text-left font-medium text-gray-600">标题</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">状态</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">浏览</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">日期</th>
              <th className="px-3 py-2 text-right font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {articles.map((article: Article) => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="px-3 py-2.5 font-medium text-gray-900">{article.title}</td>
                <td className="px-3 py-2.5">
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                    article.is_published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {article.is_published ? '已发布' : '草稿'}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-gray-600">{article.view_count}</td>
                <td className="px-3 py-2.5 text-gray-600">{format(new Date(article.created_at), 'yyyy-MM-dd')}</td>
                <td className="px-3 py-2.5 text-right">
                  <div className="flex justify-end gap-0.5">
                    <button className="p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors">
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors">
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(article.id)}
                      disabled={deleteMutation.isPending}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
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
    </div>
  )
}
