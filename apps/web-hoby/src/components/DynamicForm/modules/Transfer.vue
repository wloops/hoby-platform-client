<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-26 11:09:38
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-26 15:57:44
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\components\DynamicForm\modules\Transfer.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Input } from 'ant-design-vue';

import Transfer from '../components/Transfer/Transfer.vue';

const emit = defineEmits(['blur', 'change']);

const [Modal, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: Transfer,
});

const modelValue = defineModel<string>({
  default: () => '',
});

function onChange() {
  emit('change', modelValue.value);
}

const transferRef = ref(null);

function open() {
  modalApi
    .setData({
      content: modelValue.value,
      payload: '外部传递的数据 payload',
    })
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
      @blur="emit('blur')"
      @change="onChange"
      @click="open"
    />
    <Modal ref="transferRef" @confirm="onConfirm" />
  </div>
</template>
