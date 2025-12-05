export { Page }

import { CategorySelect, TagSelect } from "@/components/admin/Select";
import { Button, HStack } from "@chakra-ui/react";

function Page() {
  return (
    <>
      <h1>文章管理</h1>
      <HStack gap={4}>
        <CategorySelect size="lg" />
        <TagSelect multiple size="lg" />
        <Button size="lg">查询</Button>
        <Button size="lg" variant="subtle">清空条件</Button>
      </HStack>
    </>
  )
}
