export { Page }

import { CategorySelect, TagSelect } from "@/components/admin/Select";

function Page() {
  return (
    <>
      <h1>文章管理</h1>
      <CategorySelect />
      <TagSelect label="标签" multiple />
    </>
  )
}
