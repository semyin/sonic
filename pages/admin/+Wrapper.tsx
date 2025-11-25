export { Wrapper }

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { Global } from '@emotion/react'
import { Provider } from "@/components/theme/Provider"

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={defaultSystem}>
      <Global
        styles={{
          // 全局过渡效果
          'html, body': {
            transition: 'background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          },
          // 所有颜色相关的属性都添加过渡
          '*': {
            transitionProperty: 'background-color, border-color, text-decoration-color, fill, stroke',
            transitionDuration: '0.3s',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          },
          // 避免某些元素的过渡（如输入框）
          'input, textarea, select': {
            transition: 'none !important',
          },
        }}
      />
      <Provider>
        {children}
      </Provider>
    </ChakraProvider>
  )
}

