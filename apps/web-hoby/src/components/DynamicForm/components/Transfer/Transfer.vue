<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-26 13:24:12
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-04-02 11:11:30
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

// 双击处理函数修改
const handleDoubleClickLeft = (item: any) => {
  // 从左边双击，添加到右边
  if (!targetKeys.value.includes(item.key)) {
    targetKeys.value = [...targetKeys.value, item.key];
  }
};

const handleDoubleClickRight = (item: any) => {
  // 从右边双击，移回左边
  targetKeys.value = targetKeys.value.filter((key) => key !== item.key);
};
</script>
<template>
  <div>
    <Modal class="w-[600px]">
      <Transfer
        v-model:target-keys="targetKeys"
        :titles="['未选', '已选']"
        :data-source="props.dataSource"
        show-search
        :list-style="{
          width: '350px',
          height: '450px',
        }"
      >
        <template #render="item">
          <div
            @dblclick="
              item?.disabled
                ? null
                : targetKeys.includes(item?.key || '')
                  ? handleDoubleClickRight(item)
                  : handleDoubleClickLeft(item)
            "
            class="cursor-pointer py-1"
          >
            {{ item?.title }}
          </div>
        </template>
      </Transfer>
    </Modal>
  </div>
</template>
