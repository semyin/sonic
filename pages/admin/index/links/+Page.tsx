export { Page }

import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react'

function Page() {
  const links = [
    { id: 1, name: '示例博客', url: 'https://example.com', description: '一个很棒的博客', visible: true },
    { id: 2, name: '技术站点', url: 'https://tech.example.com', description: '技术分享', visible: true },
    { id: 3, name: '友情链接', url: 'https://friend.example.com', description: '朋友的网站', visible: false },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">友链管理</h1>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded hover:bg-gray-800 transition-colors">
          <Plus className="h-3.5 w-3.5" />
          新建
        </button>
      </div>

      <div className="bg-white rounded border border-gray-200">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-3 py-2 text-left font-medium text-gray-600">名称</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">链接</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">描述</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">状态</th>
              <th className="px-3 py-2 text-right font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {links.map((link) => (
              <tr key={link.id} className="hover:bg-gray-50">
                <td className="px-3 py-2.5 font-medium text-gray-900">{link.name}</td>
                <td className="px-3 py-2.5">
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                    {link.url}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </td>
                <td className="px-3 py-2.5 text-gray-600">{link.description}</td>
                <td className="px-3 py-2.5">
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                    link.visible ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {link.visible ? '显示' : '隐藏'}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-right">
                  <div className="flex justify-end gap-0.5">
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
