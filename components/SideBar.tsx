export { Sidebar }

import { useState } from 'react'
import { Box, Flex, Text, IconButton, Link } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import {
  MdArticle,
  MdCategory,
  MdLabel,
  MdLink,
  MdPerson,
  MdLogout,
  MdMenu,
  MdMenuOpen
} from 'react-icons/md'
import { useColorModeValue } from '@/components/theme/ColorMode'

const MotionBox = motion.create(Box)
const MotionFlex = motion.create(Flex)

interface MenuItem {
  path: string
  label: string
  icon: React.ElementType
}

const menuItems: MenuItem[] = [
  { path: '/admin/posts', label: '文章管理', icon: MdArticle },
  { path: '/admin/classfiy', label: '分类管理', icon: MdCategory },
  { path: '/admin/label', label: '标签管理', icon: MdLabel },
  { path: '/admin/links', label: '友链管理', icon: MdLink },
  { path: '/admin/profile', label: '个人信息', icon: MdPerson },
]

interface SidebarProps {
  currentPath: string
  onCollapsedChange?: (collapsed: boolean) => void
}

function Sidebar({ currentPath, onCollapsedChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleToggle = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    onCollapsedChange?.(newState)
  }

  const bgColor = useColorModeValue('white', 'gray.900')
  const borderColor = useColorModeValue('gray.200', 'gray.800')
  const hoverBg = useColorModeValue('gray.100', 'gray.800')
  const activeBg = useColorModeValue('blue.50', 'blue.900')
  const activeColor = useColorModeValue('blue.600', 'blue.300')
  const textColor = useColorModeValue('gray.700', 'gray.200')
  const logoutHoverBg = useColorModeValue('red.50', 'red.900')
  const logoutColor = useColorModeValue('red.500', 'red.400')
  const logoBg = useColorModeValue('gray.100', 'gray.800')

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', { method: 'POST' })
      if (response.ok) {
        window.location.href = '/admin/login'
      }
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <MotionBox
      as="aside"
      position="fixed"
      left={0}
      top={0}
      h="100vh"
      bg={bgColor}
      borderRight="1px solid"
      borderColor={borderColor}
      display="flex"
      flexDirection="column"
      zIndex={1000}
      initial={false}
      animate={{ width: isCollapsed ? '64px' : '200px' }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      style={{ overflow: 'hidden' }}
    >
      {/* Header with toggle button */}
      <Flex
        h="48px"
        align="center"
        justify={isCollapsed ? 'center' : 'space-between'}
        px={isCollapsed ? 0 : 2}
        borderBottom="1px solid"
        borderColor={borderColor}
      >
        {!isCollapsed && (
          <Box ml="14px">
            <Text fontSize="lg" fontWeight="bold" color={textColor}>
              Sonic
            </Text>
          </Box>
        )}

        <IconButton
          aria-label="Toggle sidebar"
          variant="ghost"
          size="sm"
          onClick={handleToggle}
        >
          {isCollapsed ? <MdMenu size={20} /> : <MdMenuOpen size={20} />}
        </IconButton>
      </Flex>

      {/* Menu items */}
      <Flex direction="column" flex={1} py={4} gap={1} px={2}>
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPath === item.path

          return (
            <Link
              as="a"
              key={item.path}
              href={item.path}
              display='block'
              position="relative"
              h="44px"
              cursor="pointer"
              bg={isActive ? activeBg : 'transparent'}
              color={isActive ? activeColor : textColor}
              borderRadius="6px"
              textDecoration="none"
              transition="background-color 0.2s"
              _hover={{
                bg: isActive ? activeBg : hoverBg,
                textDecoration: 'none'
              }}
              _focus={{
                outlineStyle: 'none'
              }}
              title={isCollapsed ? item.label : undefined}
            >
              <Flex
                position="absolute"
                left="14px"
                top="0"
                align="center"
                justify="center"
                w="20px"
                h="44px"
              >
                <Icon size={20} />
              </Flex>
              {!isCollapsed && (
                <Box
                  position="absolute"
                  left="46px"
                  top="0"
                  h="44px"
                  display="flex"
                  alignItems="center"
                  whiteSpace="nowrap"
                  overflow="hidden"
                >
                  <Text fontSize="sm" fontWeight="medium">
                    {item.label}
                  </Text>
                </Box>
              )}
            </Link>
          )
        })}
      </Flex>

      {/* Logout button at bottom */}
      <Box px={2} pb={4}>
        <Box
          display="block"
          position="relative"
          h="44px"
          cursor="pointer"
          color={logoutColor}
          _hover={{ bg: logoutHoverBg }}
          borderRadius="6px"
          onClick={handleLogout}
          title={isCollapsed ? '退出登录' : undefined}
        >
          <Flex
            position="absolute"
            left="14px"
            top="0"
            align="center"
            justify="center"
            w="20px"
            h="44px"
          >
            <MdLogout size={20} />
          </Flex>
          {!isCollapsed && (
            <Box
              position="absolute"
              left="46px"
              top="0"
              h="44px"
              display="flex"
              alignItems="center"
              whiteSpace="nowrap"
              overflow="hidden"
            >
              <Text fontSize="sm" fontWeight="medium">
                退出登录
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    </MotionBox>
  )
}
