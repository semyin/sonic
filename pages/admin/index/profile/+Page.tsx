export { Page }

import { Save } from 'lucide-react'

function Page() {
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-gray-900">个人资料</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-white rounded border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">基本信息</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-900 mb-1">网站名称</label>
              <input className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded focus:bg-white focus:ring-1 focus:ring-gray-900 focus:border-transparent transition-all text-xs" placeholder="我的博客" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-900 mb-1">网站URL</label>
              <input className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded focus:bg-white focus:ring-1 focus:ring-gray-900 focus:border-transparent transition-all text-xs" placeholder="https://example.com" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-900 mb-1">作者名称</label>
              <input className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded focus:bg-white focus:ring-1 focus:ring-gray-900 focus:border-transparent transition-all text-xs" placeholder="张三" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-900 mb-1">个人简介</label>
              <input className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded focus:bg-white focus:ring-1 focus:ring-gray-900 focus:border-transparent transition-all text-xs" placeholder="一句话介绍自己" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">联系方式</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-900 mb-1">邮箱</label>
              <input type="email" className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded focus:bg-white focus:ring-1 focus:ring-gray-900 focus:border-transparent transition-all text-xs" placeholder="admin@example.com" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-900 mb-1">GitHub</label>
              <input className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded focus:bg-white focus:ring-1 focus:ring-gray-900 focus:border-transparent transition-all text-xs" placeholder="https://github.com/username" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-900 mb-1">Twitter</label>
              <input className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded focus:bg-white focus:ring-1 focus:ring-gray-900 focus:border-transparent transition-all text-xs" placeholder="@username" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-900 mb-1">位置</label>
              <input className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded focus:bg-white focus:ring-1 focus:ring-gray-900 focus:border-transparent transition-all text-xs" placeholder="北京, 中国" />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white rounded border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">网站设置</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-900 mb-1">网站描述</label>
              <input className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded focus:bg-white focus:ring-1 focus:ring-gray-900 focus:border-transparent transition-all text-xs" placeholder="网站的详细描述，用于SEO" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-900 mb-1">版权信息</label>
              <input className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded focus:bg-white focus:ring-1 focus:ring-gray-900 focus:border-transparent transition-all text-xs" placeholder="© 2024 我的博客. All rights reserved." />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-900 mb-1">ICP备案号</label>
              <input className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded focus:bg-white focus:ring-1 focus:ring-gray-900 focus:border-transparent transition-all text-xs" placeholder="京ICP备xxxxxxxx号" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded hover:bg-gray-800 transition-colors">
          <Save className="h-3.5 w-3.5" />
          保存
        </button>
      </div>
    </div>
  )
}
