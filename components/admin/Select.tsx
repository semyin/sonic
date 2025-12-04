export { CategorySelect, TagSelect };

import { createListCollection, ListCollection, Portal, Select } from "@chakra-ui/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { categoryApi } from "@/utils/api/category";
import { tagApi } from "@/utils/api/tag";

interface ICategoryProps {
  label?: string;
  placeholder?: string;
  multiple?: boolean;
  width?: string;
  size?: "xs" | "sm" | "md" | "lg" | undefined;
  options: ListCollection;
  defaultValue?: string[];
  disabled?: boolean;
}

type ICategoryPropsWithoutOptions = Omit<ICategoryProps, 'options'>;

function BaseSelect(props: ICategoryProps) {

  return (
    <Select.Root
      multiple={props.multiple}
      collection={props.options}
      defaultValue={props.defaultValue || []}
      size={props.size || "md"}
      width={props.width || "200px"}
      disabled={props.disabled}
    >
      <Select.HiddenSelect />
      {
        props.label && <Select.Label>{props.label}</Select.Label>
      }
      <Select.Control>
        <Select.Trigger cursor="pointer">
          <Select.ValueText placeholder={props.placeholder || "请选择"} />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.ClearTrigger cursor="pointer" />
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {props.options.items.map((item) => (
              <Select.Item cursor="pointer" item={item} key={item.value}>
                {item.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root >
  )
}

function CategorySelect(props: ICategoryPropsWithoutOptions) {

  const { data: categories } = useSuspenseQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getList(),
    staleTime: 0
  })

  const options = createListCollection({
    items: categories.map((category) => ({
      label: category.name,
      value: category.id,
    }))
  })

  return (
    <BaseSelect {...props} options={options} />
  )
}

function TagSelect(props: ICategoryPropsWithoutOptions) {

  const { data: tags } = useSuspenseQuery({
    queryKey: ['tags'],
    queryFn: () => tagApi.getList(),
    staleTime: 0
  })

  const options = createListCollection({
    items: tags.map((tag) => ({
      label: tag.name,
      value: tag.id,
    }))
  })

  return (
    <BaseSelect {...props} options={options} />
  )
}