export { Page }
import { Box, Text, Button } from "@chakra-ui/react"

function Page() {
  return (
    <>
      <Box
        h="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        // 核心用法：base 是亮色，_dark 是暗色
        bg={{ base: "white", _dark: "gray.900" }}
        color={{ base: "gray.800", _dark: "gray.100" }}
      >
        <Box textAlign="center">
          <Text fontSize="2xl" mb="4">
            Hello Chakra UI v3!
          </Text>

          <Button
            // 按钮颜色也会自动适配
            colorPalette="teal"
            variant="solid"
          >
            Click Me
          </Button>
        </Box>
      </Box>
    </>
  )
}
