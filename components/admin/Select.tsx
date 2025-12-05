export { CategorySelect, TagSelect };

import { Box, Icon, createListCollection, ListCollection, Portal, Select, Skeleton, Text, Flex } from "@chakra-ui/react";
import { LuCircleAlert, LuRefreshCw } from "react-icons/lu";
import { useSuspenseQuery } from "@tanstack/react-query";
import { withFallback } from 'vike-react-query';
import { Tooltip } from "@/components/admin/Tooltip";
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
  onValueChange?: (details: { value: string[] }) => void;  // 新增：值变化回调
  onOpenChange?: (details: { open: boolean }) => void;     // 新增：开关状态变化
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
      onValueChange={props.onValueChange}
      onOpenChange={props.onOpenChange}
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

// 不同 size 对应的尺寸规格
const SIZE_MAPPINGS = {
  xs: {
    height: "8",
    fontSize: "xs",
    iconSize: "xs",
    px: "2",
  },
  sm: {
    height: "9",
    fontSize: "sm",
    iconSize: "sm",
    px: "3"
  },
  md: {
    height: "10",
    fontSize: "md",
    iconSize: "sm",
    px: "4",
  },
  lg: {
    height: "11",
    fontSize: "lg",
    iconSize: "md",
    px: "4",
  }
} as const;


function SelectSkeleton(props: ICategoryPropsWithoutOptions) {

  const { size = "md", width, label } = props;
  const sizeConfig = SIZE_MAPPINGS[size];

  return (
    <Box width={width || "200px"}>
      {label && <Skeleton height="20px" mb={2} width="100px" />}
      <Skeleton height={sizeConfig.height} borderRadius="md" />
    </Box>
  );
}

function SelectError(props: Pick<ICategoryProps, 'label' | 'width'> & {
  error: {
    message: string;
  } & Record<string, unknown>;
  retry: () => void;
}) {
  const { label, width, error, retry } = props;

  return (
    <Box width={width || "200px"}>
      {label && <Text mb={2} fontWeight="medium">{label}</Text>}
      <Box
        p={2}
        bg="red.50"
        borderRadius="sm"
      >
        <Flex align="center" justify="space-between">
          <Flex align="center" flex="1" minW={0}>
            <Icon size="sm" mt={0} color="red.600">
              <LuCircleAlert />
            </Icon>
            <Tooltip
              showArrow
              content={error.message}
              contentProps={{
                css: {
                  "--tooltip-bg": "colors.red.400",
                  "color": "white"
                }
              }}>
              <Text
                ml={2}
                flex="1"
                truncate
                color="red.600"
                fontSize="sm"
                minW={0}
                cursor="pointer"
              >
                {error.message}
              </Text>
            </Tooltip>
          </Flex>
          <Box ml={2} flexShrink={0}>
            <Icon cursor="pointer" size="sm" mt={0} color="red.600" onClick={retry}>
              <LuRefreshCw />
            </Icon>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

function CategorySelectComponent(props: ICategoryPropsWithoutOptions) {

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

function TagSelectComponent(props: ICategoryPropsWithoutOptions) {

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

// 使用 withFallback 包装导出组件
const CategorySelect = withFallback(CategorySelectComponent, SelectSkeleton, ({ error, retry, ...rest }) => <SelectError {...rest} error={error} retry={retry} />);

const TagSelect = withFallback(TagSelectComponent, SelectSkeleton, ({ error, retry, ...rest }) => <SelectError {...rest} error={error} retry={retry} />);
