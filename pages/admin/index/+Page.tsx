export { Page }

import { FileText, FolderOpen, Tag, Link, Eye } from 'lucide-react'

function Page() {
  const stats = [
    { label: '文章总数', value: '28', icon: FileText },
    { label: '分类数量', value: '5', icon: FolderOpen },
    { label: '标签数量', value: '12', icon: Tag },
    { label: '友链数量', value: '8', icon: Link },
  ]

  const recentArticles = [
    { title: '示例文章标题', views: 128, date: '2024-01-15' },
    { title: '另一篇文章', views: 95, date: '2024-01-14' },
    { title: '技术分享', views: 203, date: '2024-01-13' },
  ]

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-gray-900">仪表盘</h1>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded border border-gray-200 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-600">{stat.label}</p>
                <p className="text-xl font-semibold text-gray-900 mt-0.5">{stat.value}</p>
              </div>
              <div className="p-2 bg-gray-100 rounded">
                <stat.icon className="h-4 w-4 text-gray-700" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="bg-white rounded border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">最近文章</h2>
          <div className="space-y-2">
            {recentArticles.map((article, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-xs font-medium text-gray-900">{article.title}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{article.date}</p>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Eye className="h-3 w-3" />
                  <span className="text-[10px]">{article.views}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">快速操作</h2>
          <div className="space-y-1.5">
            <a href="/admin/posts" className="flex items-center gap-2 p-2 rounded border border-gray-200 hover:bg-gray-50 transition-colors">
              <FileText className="h-3.5 w-3.5 text-gray-700" />
              <span className="text-xs font-medium text-gray-900">新建文章</span>
            </a>
            <a href="/admin/classfiy" className="flex items-center gap-2 p-2 rounded border border-gray-200 hover:bg-gray-50 transition-colors">
              <FolderOpen className="h-3.5 w-3.5 text-gray-700" />
              <span className="text-xs font-medium text-gray-900">管理分类</span>
            </a>
            <a href="/admin/label" className="flex items-center gap-2 p-2 rounded border border-gray-200 hover:bg-gray-50 transition-colors">
              <Tag className="h-3.5 w-3.5 text-gray-700" />
              <span className="text-xs font-medium text-gray-900">管理标签</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
