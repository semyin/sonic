import { useState, useEffect } from 'react'
import { usePageContext } from 'vike-react/usePageContext'

// 统一管理断点常量
export const MOBILE_BREAKPOINT = 768

// 简单的 UA 判断逻辑
function checkUserAgent(userAgent: string = '') {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
}

export function useIsMobile() {
  const pageContext = usePageContext()

  // 1. 初始化状态逻辑
  const [isMobile, setIsMobile] = useState(() => {
    // 优先使用 pageContext 中的 userAgent 进行判断
    // 注意：即使在客户端，第一次渲染也建议用 userAgent，
    // 这样能保证和服务端生成的 HTML 一致，避免 hydration warning。
    if (pageContext.headers?.['user-agent']) {
      return checkUserAgent(pageContext.headers['user-agent'])
    }

    // 如果没有 userAgent (极少情况)，回退到 window 检查 (仅客户端)
    if (typeof window !== 'undefined') {
      return window.innerWidth < MOBILE_BREAKPOINT
    }

    return false // 默认兜底
  })

  useEffect(() => {
    const checkIsMobileByWidth = () => {
      // 这里的检查是最准确的 CSS 媒体查询逻辑
      return window.innerWidth < MOBILE_BREAKPOINT
    }

    // 2. 组件挂载后，立即用 window 宽度校准一次
    // 这一步非常重要：
    // 场景：用户用桌面浏览器，但为了测试改了 UserAgent 为 iPhone。
    // 此时初始状态是 Mobile (根据 UA)，但挂载后会立即变成 Desktop (根据宽度)。
    // 虽然会闪一下，但保证了功能的正确性。正常手机设备不会闪。
    const currentWidthStatus = checkIsMobileByWidth()
    if (currentWidthStatus !== isMobile) {
      setIsMobile(currentWidthStatus)
    }

    // 3. 监听调整
    const handleResize = () => {
      setIsMobile(checkIsMobileByWidth())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, []) // 这里的依赖空数组是正确的

  return isMobile
}
