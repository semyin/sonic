export { Page }

import { Plus, Edit, Trash2 } from 'lucide-react'

function Page() {
  const tags = [
    { id: 1, name: 'React', count: 12 },
    { id: 2, name: 'TypeScript', count: 10 },
    { id: 3, name: 'Node.js', count: 8 },
    { id: 4, name: 'Cloudflare', count: 5 },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">标签管理</h1>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded hover:bg-gray-800 transition-colors">
          <Plus className="h-3.5 w-3.5" />
          新建
        </button>
      </div>

      <div className="bg-white rounded border border-gray-200">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-3 py-2 text-left font-medium text-gray-600">标签名称</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">使用次数</th>
              <th className="px-3 py-2 text-right font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tags.map((tag) => (
              <tr key={tag.id} className="hover:bg-gray-50">
                <td className="px-3 py-2.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-xs font-medium text-gray-900">
                    {tag.name}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-gray-600">{tag.count}</td>
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
