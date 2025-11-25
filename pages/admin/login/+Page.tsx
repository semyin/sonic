export { Page }

import { Button, ClientOnly, Skeleton, Box } from "@chakra-ui/react"
import { ColorModeButton, useColorMode, useColorModeValue } from "@/components/theme/ColorMode"

function Page() {
  const { colorMode, toggleColorMode } = useColorMode()
  const bg = useColorModeValue("white", "gray.800")
  return (
    <>
      <h1>Login</h1>
      <Button>登录</Button>
      <div>
      {/* 使用预制的切换按钮 */}
      {/* <ColorModeButton /> */}
      <ClientOnly fallback={<Skeleton width="40px" height="40px" />}>
        <ColorModeButton />
      </ClientOnly>
      
      {/* 或自定义按钮 */}
      <button onClick={toggleColorMode}>
        当前主题: {colorMode}
      </button>
      
      {/* 使用响应式颜色 */}
      <Box bg={bg}>
        内容
      </Box>
    </div>
    </>
  )
}
