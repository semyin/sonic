'use client'

export { Navbar }

import { useState, useEffect } from 'react'
import { Flex, Box, IconButton, Breadcrumb } from '@chakra-ui/react'
import { ColorModeButton, useColorModeValue } from '@/components/color-mode'
import { MdFullscreen, MdFullscreenExit, MdChevronRight } from 'react-icons/md'
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import { BiFullscreen, BiExitFullscreen } from "react-icons/bi";
import { RxEnterFullScreen } from "react-icons/rx";
import { RxExitFullScreen } from "react-icons/rx";

interface BreadcrumbItem {
  label: string
  href?: string
}

interface NavbarProps {
  breadcrumbs?: BreadcrumbItem[]
  sidebarWidth?: string
}

function Navbar({ breadcrumbs, sidebarWidth = '200px' }: NavbarProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const bgColor = useColorModeValue('white', 'gray.900')
  const borderColor = useColorModeValue('gray.200', 'gray.800')
  const textColor = useColorModeValue('gray.700', 'gray.200')
  const breadcrumbColor = useColorModeValue('gray.600', 'gray.400')
  const linkHoverColor = useColorModeValue('blue.600', 'blue.300')

  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  // 切换全屏
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (error) {
      console.error('全屏切换失败:', error)
    }
  }

  return (
    <Box
      as="nav"
      position="fixed"
      top={0}
      right={0}
      left={sidebarWidth}
      h="48px"
      bg={bgColor}
      borderBottom="1px solid"
      borderColor={borderColor}
      zIndex={999}
      px={6}
      transition="left 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
    >
      <Flex h="full" align="center" justify="space-between">
        {/* 面包屑导航 */}
        <Flex align="center" gap={2} fontSize="sm" flex="1" minW="0">
          {breadcrumbs && breadcrumbs.length > 0 && (
            breadcrumbs.map((crumb, index) => (
              <Flex key={index} align="center" gap={2}>
                {crumb.href && index < breadcrumbs.length - 1 ? (
                  <a
                    href={crumb.href}
                    style={{
                      color: textColor,
                      transition: 'color 0.2s',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = linkHoverColor}
                    onMouseLeave={(e) => e.currentTarget.style.color = textColor}
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <Box color={textColor} fontWeight="medium">
                    {crumb.label}
                  </Box>
                )}
                {index < breadcrumbs.length - 1 && (
                  <MdChevronRight size={16} color={breadcrumbColor} />
                )}
              </Flex>
            ))
          )}
        </Flex>

        {/* 右侧操作按钮 */}
        <Flex align="center" gap={2} flexShrink={0}>
          <IconButton
            aria-label="切换全屏"
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <BiExitFullscreen /> : <BiFullscreen />}
          </IconButton>
          <ColorModeButton />
        </Flex>
      </Flex>
    </Box>
  )
}