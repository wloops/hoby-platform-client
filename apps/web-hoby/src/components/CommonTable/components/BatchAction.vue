<script lang="ts" setup>
import type { ActionButtonProps, TableRecord } from '../types';

import { computed, defineEmits, defineProps } from 'vue';

import { Button } from 'ant-design-vue';

// 定义组件属性
const props = defineProps({
  // 选中的记录
  selectedRecords: {
    type: Array as () => TableRecord[],
    default: () => [],
  },
  // 批量操作按钮
  batchActions: {
    type: Array as () => ActionButtonProps[],
    default: () => [],
  },
  // 操作列中的按钮
  columnActions: {
    type: Array as () => ActionButtonProps[],
    default: () => [],
  },
  // 批量操作最小选择数量
  minSelected: {
    type: Number,
    default: 1,
  },
  // 是否启用批量操作
  enableBatchActions: {
    type: Boolean,
    default: true,
  },
  // 使用操作列中的按钮作为批量操作按钮
  useColumnActions: {
    type: Boolean,
    default: true,
  },
});

// 定义事件
const emit = defineEmits(['action', 'clear']);

// 计算是否显示批量操作
const showBatchActions = computed(() => {
  return (
    props.enableBatchActions &&
    props.selectedRecords.length >= props.minSelected &&
    (props.batchActions.length > 0 ||
      (props.useColumnActions && props.columnActions.length > 0))
  );
});

// 合并批量操作按钮和列操作按钮
const mergedActions = computed(() => {
  if (!props.useColumnActions) return props.batchActions;
  return [...props.batchActions, ...props.columnActions];
});

// 检查按钮是否应该禁用（基于选中记录的状态）
function isButtonDisabled(action: ActionButtonProps): boolean {
  if (typeof action.disabled !== 'function') {
    return !!action.disabled;
  }

  // 检查是否所有选中记录中有任何一个应该被禁用
  return props.selectedRecords.every((record) => {
    // 对每条记录单独检查是否需要禁用
    const disabledFn = action.disabled as (record: TableRecord) => boolean;
    return disabledFn(record);
  });
}

// 处理批量操作按钮点击
function handleActionClick(action: ActionButtonProps): void {
  const onClick = action.onClick as ((record: TableRecord) => void) | undefined;
  if (typeof onClick !== 'function') return;

  // 对每条选中记录执行操作
  props.selectedRecords.forEach((record) => {
    // 只对未被禁用的记录执行操作
    if (typeof action.disabled === 'function') {
      const disabledFn = action.disabled as (record: TableRecord) => boolean;
      if (!disabledFn(record)) {
        onClick(record);
      }
    } else if (!action.disabled) {
      onClick(record);
    }
  });

  // 触发事件
  emit('action', {
    action,
    records: props.selectedRecords,
  });

  // 如果需要操作后清空选择，可以触发clear事件
  if (action.clearAfterAction) {
    emit('clear');
  }
}
</script>

<template>
  <div v-if="showBatchActions" class="batch-action-container">
    <div class="batch-action-buttons">
      <Button
        v-for="action in mergedActions"
        :key="action.key || action.name || action.text"
        :type="action.type === 'link' ? 'link' : 'primary'"
        :danger="action.danger"
        :disabled="isButtonDisabled(action)"
        size="small"
        v-show="
          typeof action.visible === 'function'
            ? !action.visible(selectedRecords)
            : action.visible !== false
        "
        @click="() => handleActionClick(action)"
      >
        {{ action.label || action.text || '操作' }}
      </Button>
    </div>
  </div>
</template>

<style scoped>
.batch-action-container {
  display: flex;
  gap: 16px;
  align-items: center;
}

.batch-action-buttons {
  display: flex;
  gap: 8px;
}
</style>
