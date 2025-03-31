<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-26 11:09:38
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-31 15:53:41
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\components\DynamicForm\modules\Transfer.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Input } from 'ant-design-vue';

import { mainGetCommonQueryData } from '#/api';
import { useFormStore } from '#/store';

import Transfer from '../components/Transfer/Transfer.vue';
import { convertToKeyTitleArray, parseQueryString } from './utils';

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

const formStore = useFormStore();

const [Modal, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: Transfer,
});

const modelValue = defineModel<string>({
  default: () => '',
});

const transferRef = ref(null);
const transferValue = ref<
  Array<{ chosen?: boolean; key: string; title: string }>
>([]);

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
    ...formStore.getFormValues(),
  };
  const { rs, data } = await mainGetCommonQueryData(apiParams);

  if (rs === '1') {
    transferValue.value = convertToKeyTitleArray(
      data.dbRecsGrp,
      result.readFld as string,
      props.record[props.sourceData.fieldName] ?? '',
    );
  }
};

function open() {
  handleFocus();
  modalApi
    // .setData({
    //   content: modelValue.value,
    //   payload: '外部传递的数据 payload',
    // })
    .open();
}

function onConfirm(targetKeys: string) {
  modelValue.value = targetKeys;
}
</script>
<template>
  <div class="flex w-full gap-1">
    <Input
      placeholder="请选择"
      class="flex-1"
      allow-clear
      v-model:value="modelValue"
      @focus="open"
    />
    <Modal
      ref="transferRef"
      :data-source="transferValue"
      @confirm="onConfirm"
    />
  </div>
</template>
