export { Page }

import { Plus, Edit, Trash2, Eye } from 'lucide-react'

function Page() {
  const articles = [
    { id: 1, title: '示例文章标题', category: '技术', status: '已发布', views: 128, date: '2024-01-15' },
    { id: 2, title: '另一篇文章', category: '生活', status: '草稿', views: 0, date: '2024-01-14' },
  ]

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
              <th className="px-3 py-2 text-left font-medium text-gray-600">分类</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">状态</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">浏览</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">日期</th>
              <th className="px-3 py-2 text-right font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="px-3 py-2.5 font-medium text-gray-900">{article.title}</td>
                <td className="px-3 py-2.5 text-gray-600">{article.category}</td>
                <td className="px-3 py-2.5">
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                    article.status === '已发布' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {article.status}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-gray-600">{article.views}</td>
                <td className="px-3 py-2.5 text-gray-600">{article.date}</td>
                <td className="px-3 py-2.5 text-right">
                  <div className="flex justify-end gap-0.5">
                    <button className="p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors">
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors">
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
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
