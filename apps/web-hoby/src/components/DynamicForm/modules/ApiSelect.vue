<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-28 11:27:16
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-28 17:47:10
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\components\DynamicForm\modules\ApiSelect.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script lang="ts" setup>
import type { SelectProps } from 'ant-design-vue';

import { ref } from 'vue';

import { Select } from 'ant-design-vue';

import { mainGetCommonQueryData } from '#/api';

import { convertToOptions, parseQueryString } from './utils';

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
    'readFld',
  ]);
  const apiParams = {
    INTERQUERYCON: result.condition,
    INTERFLDNAMELIST: result.readFld,
    INTERRESID: result.table,
    ...props.record,
  };
  const { rs, data } = await mainGetCommonQueryData(apiParams);
  if (rs === '1') {
    options.value = convertToOptions(data.dbRecsGrp, result.readFld as string);
  }
};

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
