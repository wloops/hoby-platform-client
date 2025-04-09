<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-04-09 14:29:44
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-04-09 21:01:03
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\components\CommonTable\components\PageButtons.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!-- apps/web-hoby/src/components/CommonTable/components/PageButtons.vue -->
<script lang="ts" setup>
import type { ActionButtonProps } from '../types';

import { computed } from 'vue';

import { Button } from 'ant-design-vue';

const props = defineProps({
  // 按钮配置列表
  buttons: {
    type: Array as () => ActionButtonProps[],
    default: () => [],
  },
  // 按钮参数
  params: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['click']);

// 计算实际显示的按钮
const visibleButtons = computed(() => {
  return props.buttons.filter((button) => {
    if (typeof button.visible === 'function') {
      return button.visible(props.params);
    }
    return button.visible !== false;
  });
});

// 处理按钮点击事件
const handleClick = (button: ActionButtonProps) => {
  if (button.onClick) {
    button.onClick({ key: button.key, params: props.params });
  } else {
    emit(
      'click',
      button,
      props.params?.selectedRecords.length && props.params.selectedRecords[0],
    );
  }
};

// 判断按钮是否禁用
const isDisabled = (button: ActionButtonProps): boolean => {
  if (typeof button.disabled === 'function') {
    return button.disabled(props.params);
  }
  return button.disabled || false;
};
</script>

<template>
  <div class="page-buttons">
    <Button
      v-for="button in visibleButtons"
      :key="button.key"
      type="default"
      :danger="button.danger"
      :disabled="isDisabled(button)"
      @click="handleClick(button)"
    >
      <template v-if="button.icon">
        <span :class="button.icon" class="button-icon"></span>
      </template>
      {{ button.label ?? button.text }}
    </Button>
  </div>
</template>

<style scoped>
.page-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.button-icon {
  margin-right: 4px;
}
</style>
