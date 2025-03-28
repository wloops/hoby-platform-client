<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-28 11:27:16
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-28 17:02:42
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\components\DynamicForm\modules\ApiSelect.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script lang="ts" setup>
import type { SelectProps } from 'ant-design-vue';

import { ref } from 'vue';

import { Select } from 'ant-design-vue';

import { mainGetCommonQueryData } from '#/api';

const props = defineProps({
  sourceData: {
    type: Object as any,
    default: () => {},
  },
  record: {
    type: Object,
    default: () => {},
  },
});

const options = ref<SelectProps['options']>([]);
const handleFocus = async () => {
  // const record = containerApi.getValues();

  const result = parseQueryString(props.sourceData.value, [
    'table',
    'condition',
  ]);
  const apiParams = {
    INTERQUERYCON: result.condition,
    INTERFLDNAMELIST: props.sourceData?.fieldName,
    INTERRESID: result.table,
    ...props.record,
  };
  const { rs, data } = await mainGetCommonQueryData(apiParams);
  if (rs === '1') {
    options.value = convertToOptions(
      data.dbRecsGrp,
      props.sourceData?.fieldName,
    );
  }
};

/**
 * 从查询字符串中提取指定的字段值
 * @param queryStr 查询字符串，格式如: "query::table=1491,readFld=companyName,writable=1,condition=SPLENWISEQUERYOPTIONS=distinct=1`fields=companyName"
 * @param fields 需要提取的字段名数组，如 ['table', 'readFld', 'condition']
 * @returns 包含指定字段值的对象
 */
function parseQueryString(
  queryStr: string,
  fields: string[],
): Record<string, string> {
  // 移除开头的 "query::"
  const cleanStr = queryStr.replace(/^query::/, '');

  // 分割所有键值对
  const keyValuePairs = cleanStr.split(',');

  const result: Record<string, string> = {};

  // 处理每个键值对
  keyValuePairs.forEach((pair) => {
    // 处理包含等号的情况
    if (pair.includes('=')) {
      const [key, ...valueParts] = pair.split('=');
      const value = valueParts.join('='); // 处理值中包含等号的情况

      // 如果这个键是我们要提取的
      if (fields.includes(key!)) {
        result[key!] = value;
      }
    }
  });

  return result;
}

/**
 * 将对象数组转换为标准选项格式
 * @param data 原始数据数组
 * @param keyName 要作为value和label的字段名，默认为'label'
 * @returns 转换后的选项数组
 */
interface Option {
  value: string;
  label: string;
}

// 正确的泛型参数顺序
function convertToOptions<K extends string, T extends Record<K, string>>(
  data: T[],
  keyName: K,
): Option[] {
  return data.map((item) => ({
    value: item[keyName],
    label: item[keyName],
  }));
}

const filterOption = (input: string, option: any) => {
  return option.value.toLowerCase().includes(input.toLowerCase());
};

const value = ref<string | undefined>(undefined);
</script>
<template>
  <Select
    class="flex w-full gap-1"
    :value="value"
    show-search
    placeholder="Select a person"
    :options="options"
    :filter-option="filterOption"
    @focus="handleFocus"
  />
</template>
