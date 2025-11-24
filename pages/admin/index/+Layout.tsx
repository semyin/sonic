export { Layout }

import { useState, useEffect, useMemo } from 'react'
import { Box } from '@chakra-ui/react'
import { Sidebar } from "@/components/SideBar"
import { Navbar } from "@/components/Navbar"
import { useColorModeValue } from '@/components/color-mode'
import { usePageContext } from 'vike-react/usePageContext'

// 路由映射表
const routeMap: Record<string, string> = {
  '/admin': '首页',
  '/admin/posts': '文章管理',
  '/admin/classfiy': '分类管理',
  '/admin/label': '标签管理',
  '/admin/links': '友链管理',
  '/admin/profile': '个人信息',
}

function Layout({ children }: { children: React.ReactNode }) {
  const pageContext = usePageContext()
  const currentPath = pageContext.urlPathname

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const sidebarWidth = sidebarCollapsed ? '64px' : '200px'

  const bgColor = useColorModeValue('gray.50', 'gray.950')

  // 使用 useMemo 根据当前路径生成面包屑
  const breadcrumbs = useMemo(() => {
    const crumbs: Array<{ label: string; href?: string }> = [
      { label: '首页', href: '/admin' }
    ]

    if (currentPath !== '/admin') {
      const label = routeMap[currentPath] || '未知页面'
      crumbs.push({ label })
    }

    return crumbs
  }, [currentPath])

  const handleSidebarCollapsedChange = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed)
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <Sidebar currentPath={currentPath} onCollapsedChange={handleSidebarCollapsedChange} />
      <Navbar breadcrumbs={breadcrumbs} sidebarWidth={sidebarWidth} />
      <Box
        as="main"
        ml={sidebarWidth}
        mt="48px"
        p={6}
        transition="margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      >
        {children}
      </Box>
    </Box>
  )
}
