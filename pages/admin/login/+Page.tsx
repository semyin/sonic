import { Card, Field, Input, Button, Stack, Checkbox, Link, Text, Center, Box } from "@chakra-ui/react";
import { useColorModeValue } from '@/components/theme/ColorMode';
import { ColorModeButton } from '@/components/theme/ColorMode'; // 导入深色模式切换按钮

export const Page = () => {
  // 使用与布局一致的颜色模式值
  const bgColor = useColorModeValue('gray.50', 'gray.950');
  const cardBg = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
  const linkColor = useColorModeValue('blue.600', 'blue.300');
  
  // 商务风格黑色按钮颜色
  const buttonBg = useColorModeValue('gray.800', 'gray.200');
  const buttonTextColor = useColorModeValue('white', 'gray.800');
  const buttonHoverBg = useColorModeValue('gray.700', 'gray.300');

  return (
    <Center minHeight="100vh" bg={bgColor} position="relative">
      {/* 深色模式切换按钮 - 固定在右上角 */}
      <Box position="fixed" top="4" right="4" zIndex="1000">
        <ColorModeButton />
      </Box>

      <Card.Root 
        maxW={{ base: "90%", sm: "460px" }} // 移动端响应式宽度
        width="full" 
        bg={cardBg}
        border="1px solid"
        borderColor={borderColor}
        rounded="md"
        p={{ base: 4, md: 6 }} // 移动端减少内边距
        boxShadow="sm"
      >
        <Card.Header textAlign="center" pb="4">
          <Card.Title 
            fontSize={{ base: "lg", md: "xl" }} // 移动端字体稍小
            fontWeight="bold" 
            color={textColor}
          >
            Welcome Back
          </Card.Title>
          <Card.Description color={mutedTextColor} fontSize="sm">
            Sign in to your account
          </Card.Description>
        </Card.Header>
        <Card.Body>
          <Stack gap="4">
            <Field.Root>
              <Field.Label color={textColor} fontSize="sm">
                Email address
              </Field.Label>
              <Input type="email" placeholder="you@example.com" />
            </Field.Root>
            <Field.Root>
              <Field.Label color={textColor} fontSize="sm">
                Password
              </Field.Label>
              <Input type="password" placeholder="Enter your password" />
            </Field.Root>
            <Stack 
              direction={{ base: "column", sm: "row" }} // 移动端垂直排列
              justify="space-between" 
              align={{ base: "stretch", sm: "center" }}
              gap="3"
            >
              <Checkbox.Root cursor="pointer">
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label color={textColor} fontSize="sm">
                  Remember me
                </Checkbox.Label>
              </Checkbox.Root>
              <Link 
                color={linkColor} 
                fontSize="sm" 
                textAlign={{ base: "center", sm: "right" }} // 移动端居中
              >
                Forgot password?
              </Link>
            </Stack>
          </Stack>
        </Card.Body>
        <Card.Footer>
          <Button 
            width="full" 
            size="md"
            // bg={buttonBg}
            color={buttonTextColor}
            _hover={{ bg: buttonHoverBg }}
            transition="background-color 0.2s"
          >
            Sign in
          </Button>
        </Card.Footer>
        <Text 
          textAlign="center" 
          mt="4" 
          color={mutedTextColor} 
          fontSize="sm"
        >
          Don't have an account? <Link color={linkColor}>Sign up</Link>
        </Text>
      </Card.Root>
    </Center>
  );
};
