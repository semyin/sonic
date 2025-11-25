import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import { ColorModeProvider } from "./ColorMode"

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider>
        {children}
      </ColorModeProvider>
    </ChakraProvider>
  )
}
