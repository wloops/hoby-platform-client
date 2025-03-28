<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-26 13:24:12
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-28 22:36:51
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\components\DynamicForm\components\Transfer\Transfer.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Transfer } from 'ant-design-vue';

const props = defineProps({
  dataSource: {
    type: Array as any,
    default: () => [],
  },
  value: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['confirm']);

// interface MockData {
//   key: string;
//   title: string;
//   description: string;
//   chosen: boolean;
// }

// const data = ref();

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    // 拼接成字符串
    const targetKeysStr = targetKeys.value.join(',');
    emit('confirm', targetKeysStr);
    modalApi.close();
  },
  // onOpenChange(isOpen: boolean) {
  // if (isOpen) {
  //   data.value = modalApi.getData<Record<string, any>>();
  //   // console.info('data', data.value);
  // }
  // },
});

const targetKeys = ref<string[]>([]);
</script>
<template>
  <div>
    <Modal class="w-[600px]" title="基础示例">
      <Transfer
        v-model:target-keys="targetKeys"
        :titles="['未选', '已选']"
        :data-source="props.dataSource"
        show-search
        :list-style="{
          width: '350px',
          height: '450px',
        }"
        :render="(item) => item.title"
      />
    </Modal>
  </div>
</template>
