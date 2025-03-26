<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-26 13:24:12
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-26 16:05:51
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\components\DynamicForm\components\Transfer\Transfer.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Transfer } from 'ant-design-vue';

const emit = defineEmits(['confirm']);

interface MockData {
  key: string;
  title: string;
  description: string;
  chosen: boolean;
}

const data = ref();

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
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      data.value = modalApi.getData<Record<string, any>>();
      // console.info('data', data.value);
    }
  },
});

const mockData = ref<MockData[]>([]);

const targetKeys = ref<string[]>([]);
onMounted(() => {
  getMock();
});
const getMock = () => {
  const keys = [];
  const mData = [];
  for (let i = 0; i < 20; i++) {
    const data = {
      key: i.toString(),
      title: `content${i + 1}`,
      description: `description of content${i + 1}`,
      chosen: Math.random() * 2 > 1,
    };
    if (data.chosen) {
      keys.push(data.key);
    }
    mData.push(data);
  }
  mockData.value = mData;
  targetKeys.value = keys;
};
</script>
<template>
  <div>
    <Modal class="w-[600px]" title="基础示例">
      <Transfer
        v-model:target-keys="targetKeys"
        :titles="['未选', '已选']"
        :data-source="mockData"
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
