export { Layout }

import '@/assets/css/globals.css'
import { LayoutDashboard, FileText, FolderOpen, Tag, Link, User, LogOut, Menu, Maximize2 } from 'lucide-react'
import { useState } from 'react'

function Layout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  const navItems = [
    { icon: LayoutDashboard, label: '仪表盘', href: '/admin' },
    { icon: FileText, label: '文章管理', href: '/admin/posts' },
    { icon: FolderOpen, label: '分类管理', href: '/admin/classfiy' },
    { icon: Tag, label: '标签管理', href: '/admin/label' },
    { icon: Link, label: '友链管理', href: '/admin/links' },
    { icon: User, label: '个人资料', href: '/admin/profile' },
  ]

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className={`${collapsed ? 'w-14' : 'w-44'} bg-white border-r border-gray-200 transition-all duration-200 flex flex-col`}>
        <div className="h-12 flex items-center px-4 border-b border-gray-200">
          <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-white">S</span>
          </div>
          <span className={`text-sm font-semibold text-gray-900 ml-2 whitespace-nowrap overflow-hidden transition-all duration-200 ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>Sonic</span>
        </div>
        <nav className="p-2 space-y-0.5 flex-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-2 py-2 text-sm font-medium text-gray-700 rounded hover:bg-gray-100 transition-colors"
              title={collapsed ? item.label : ''}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              <span className={`whitespace-nowrap overflow-hidden transition-all duration-200 ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="p-2 border-t border-gray-200">
          <button className="w-full flex items-center justify-start gap-2 px-2 py-2 text-sm font-medium text-gray-700 rounded hover:bg-gray-100 transition-colors">
            <LogOut className="h-4 w-4 flex-shrink-0" />
            <span className={`whitespace-nowrap overflow-hidden transition-all duration-200 ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>退出登录</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4">
          <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors">
            <Menu className="h-4 w-4" />
          </button>
          <button onClick={toggleFullscreen} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors">
            <Maximize2 className="h-4 w-4" />
          </button>
        </header>
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
