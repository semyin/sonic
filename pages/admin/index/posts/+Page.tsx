export { Page }

import { CategorySelect, TagSelect } from "@/components/admin/Select";
import { Button, HStack } from "@chakra-ui/react";

function Page() {
  return (
    <>
      <h1>文章管理</h1>
      <HStack gap={4}>
        <CategorySelect />
        <TagSelect multiple />
        <Button size="sm">查询</Button>
        <Button size="sm" variant="subtle">清空条件</Button>
      </HStack>
    </>
  )
}
