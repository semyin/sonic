import React, { createContext, useContext, useEffect, useState } from "react"
import { IconButton, IconButtonProps, Skeleton, ClientOnly } from "@chakra-ui/react"
import { LuMoon, LuSun } from "react-icons/lu"

type ColorMode = "light" | "dark"

interface ColorModeContextType {
  colorMode: ColorMode
  toggleColorMode: () => void
  setColorMode: (mode: ColorMode) => void
}

const ColorModeContext = createContext<ColorModeContextType | undefined>(undefined)

export function ColorModeProvider({ children }: { children: React.ReactNode }) {
  const [colorMode, setColorModeState] = useState<ColorMode>("light")

  useEffect(() => {
    // 1. 初始化时从 localStorage 或系统偏好读取
    const savedMode = localStorage.getItem("chakra-ui-color-mode") as ColorMode | null
    const systemMode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    const initialMode = savedMode || systemMode
    
    setColorModeState(initialMode)
    applyTheme(initialMode)
  }, [])

  const applyTheme = (mode: ColorMode) => {
    const root = document.documentElement
    if (mode === "dark") {
      root.classList.add("dark")
      root.style.colorScheme = "dark"
    } else {
      root.classList.remove("dark")
      root.style.colorScheme = "light"
    }
  }

  const setColorMode = (mode: ColorMode) => {
    setColorModeState(mode)
    localStorage.setItem("chakra-ui-color-mode", mode)
    applyTheme(mode)
  }

  const toggleColorMode = () => {
    const nextMode = colorMode === "light" ? "dark" : "light"
    setColorMode(nextMode)
  }

  return (
    <ColorModeContext.Provider value={{ colorMode, toggleColorMode, setColorMode }}>
      {children}
    </ColorModeContext.Provider>
  )
}

export function useColorMode() {
  const context = useContext(ColorModeContext)
  if (!context) {
    throw new Error("useColorMode must be used within a ColorModeProvider")
  }
  return context
}

// 兼容 Chakra UI 的辅助 hook
export function useColorModeValue<T>(light: T, dark: T) {
  return { base: light, _dark: dark }
}

// 切换按钮组件
export const ColorModeButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function ColorModeButton(props, ref) {
    const { toggleColorMode, colorMode } = useColorMode()
    return (
      <ClientOnly fallback={<Skeleton boxSize="8" />}>
        <IconButton
          onClick={toggleColorMode}
          variant="ghost"
          aria-label="Toggle color mode"
          size="sm"
          ref={ref}
          {...props}
        >
          {colorMode === "dark" ? <LuMoon /> : <LuSun />}
        </IconButton>
      </ClientOnly>
    )
  }
)
