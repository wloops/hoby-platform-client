<script lang="ts" setup>
import type { ActionButton, TableItem } from '../types';

import { computed, defineEmits, defineProps, h } from 'vue';

import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Button, Modal } from 'ant-design-vue';

// 批量操作按钮接口
export interface BatchActionButton {
  text: string; // 按钮文本
  type?: 'dashed' | 'default' | 'ghost' | 'link' | 'primary' | 'text'; // 按钮类型
  danger?: boolean; // 是否危险按钮
  icon?: string; // 图标名称
  onClick: (selectedRows: TableItem[]) => void; // 点击事件处理函数
  disabled?: (selectedRows: TableItem[]) => boolean; // 控制按钮是否禁用
  confirm?: string; // 确认提示文本
  confirmTitle?: string; // 确认对话框标题
  minSelected?: number; // 最少需要选择的行数，默认为1
  permission?: string; // 权限控制
  // 新增属性：标记是否可以批量操作
  batchable?: boolean;
}

// 定义组件属性
const props = defineProps({
  // 批量操作按钮
  actions: {
    required: true,
    type: Array as () => BatchActionButton[],
  },
  // 选中的行数据
  selectedRows: {
    required: true,
    type: Array as () => TableItem[],
  },
  // 选中的行key
  selectedRowKeys: {
    required: true,
    type: Array as () => Array<number | string>,
  },
  // 是否显示清空选择按钮
  showClear: {
    default: true,
    type: Boolean,
  },
  // 组件一直显示
  alwaysShow: {
    default: true,
    type: Boolean,
  },
  // 行操作按钮配置，用于生成批量操作
  rowActions: {
    default: () => [],
    type: Array as () => ActionButton[],
  },
});

// 定义事件
const emit = defineEmits(['clear']);

// 处理清空选择
const handleClear = () => {
  emit('clear');
};

// 从行操作按钮生成批量操作按钮
const generateBatchActionsFromRowActions = computed(() => {
  if (!props.rowActions || props.rowActions.length === 0) {
    return [];
  }

  return props.rowActions
    .filter((action) => {
      // 过滤出可批量操作的按钮（默认所有按钮都可批量操作，除非明确设置为不可批量操作）
      return action.batchable !== false;
    })
    .map((action) => {
      // 处理确认提示
      let confirmMessage = action.confirm;
      if (action.confirm === 'auto' && props.selectedRows.length === 1) {
        confirmMessage = `确定要${action.text}吗？`;
      } else if (action.confirm) {
        confirmMessage = `确定要对选中的 ${props.selectedRows.length} 条记录执行${action.text}操作吗？`;
      }

      // 转换为批量操作按钮
      return {
        text: `批量${action.text}`,
        type: 'dashed',
        size: 'small',
        danger: action.danger,
        icon: action.icon,
        onClick: (rows: TableItem[]) => {
          // 对每一行执行操作 - 修改为只有一个确认弹窗
          if (action.confirm) {
            Modal.confirm({
              title: action.confirmTitle || `确认批量${action.text}`,
              icon: h(ExclamationCircleOutlined),
              content: confirmMessage,
              okText: '确认',
              cancelText: '取消',
              onOk: () => {
                // 批量执行操作，没有弹窗
                rows.forEach((row) => {
                  // 直接执行，不再显示每行的确认
                  action.onClick(row);
                });
              },
            });
          } else {
            // 直接批量执行
            rows.forEach((row) => {
              action.onClick(row);
            });
          }
        },
        // 禁用条件：如果任何一行不满足按钮的显示或启用条件，则禁用批量操作
        disabled: (rows: TableItem[]) => {
          if (action.disabled) {
            return rows.some((row) => action.disabled!(row));
          }
          if (action.show) {
            return rows.some((row) => !action.show!(row));
          }
          return false;
        },
      } as BatchActionButton;
    });
});

// 合并自定义批量操作和从行操作生成的批量操作
const allBatchActions = computed(() => {
  const customActions = props.actions || [];
  const generatedActions = generateBatchActionsFromRowActions.value;

  // 去重：如果有同名操作，优先使用自定义批量操作
  const actionTextSet = new Set(customActions.map((a) => a.text));
  const filteredGeneratedActions = generatedActions.filter(
    (a) => !actionTextSet.has(a.text),
  );

  return [...customActions, ...filteredGeneratedActions];
});

// 渲染批量操作按钮
const renderActionButtons = () => {
  if (allBatchActions.value.length === 0) {
    return null;
  }

  const buttons = allBatchActions.value.map((button) => {
    // 判断是否禁用
    const isDisabled = button.disabled
      ? button.disabled(props.selectedRows)
      : props.selectedRows.length < (button.minSelected || 1);

    // 按钮点击处理函数
    const handleClick = () => {
      // 如果设置了确认提示，则显示确认对话框
      if (button.confirm) {
        // 处理自动生成确认提示语
        let confirmContent = button.confirm;
        if (button.confirm === 'auto') {
          confirmContent = `确定要${button.text}吗？`;
        }

        Modal.confirm({
          title: button.confirmTitle || '确认批量操作',
          icon: h(ExclamationCircleOutlined),
          content: confirmContent,
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            // 直接执行批量操作，不再为每行单独显示确认
            button.onClick(props.selectedRows);
          },
        });
      } else {
        // 直接执行点击事件
        button.onClick(props.selectedRows);
      }
    };

    // 渲染按钮
    return h(
      Button,
      {
        type: button.type || 'primary',
        danger: button.danger,
        disabled: isDisabled,
        onClick: handleClick,
        size: 'small',
        style: {
          marginRight: '0',
        },
      },
      {
        default: () => button.text,
      },
    );
  });

  return buttons;
};

// 计算按钮列表
const actionButtons = computed(() => {
  return renderActionButtons();
});

// 计算是否显示选择信息
const showSelectionInfo = computed(() => {
  return props.selectedRowKeys.length > 0;
});

// 计算是否有可用的批量操作按钮
// const hasBatchActions = computed(() => {
//   return allBatchActions.value.length > 0;
// });
</script>

<template>
  <!-- 组件始终渲染，调整样式使其紧贴表格 -->
  <div class="batch-actions-container">
    <div class="left-section">
      <div class="selection-info" v-if="showSelectionInfo">
        已选择
        <span class="selected-count">{{ selectedRowKeys.length }}</span> 项
        <a v-if="showClear" class="clear-selection" @click="handleClear"
          >清空</a
        >
      </div>
      <div class="selection-info" v-else>
        <span class="no-selection">未选择记录</span>
      </div>
    </div>
    <div class="action-buttons" v-if="selectedRowKeys.length > 0">
      <component
        :is="button"
        v-for="(button, index) in actionButtons"
        :key="index"
      />
      <span
        v-if="!actionButtons || actionButtons.length === 0"
        class="no-actions"
      >
        无可用批量操作
      </span>
    </div>
  </div>
</template>

<style scoped>
.batch-actions-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  margin: 0; /* 移除外边距 */
  background-color: #f8f8f8; /* 更柔和的背景色 */
  border: 1px solid #f0f0f0; /* 增加边框与表格一致 */
  border-bottom: none; /* 移除底部边框与表格连接 */
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.left-section {
  display: flex;
  align-items: center;
}

.selection-info {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.selected-count {
  margin: 0 4px;
  font-weight: bold;
  color: #1890ff;
}

.no-selection {
  color: #999;
}

.no-actions {
  font-size: 14px;
  font-style: italic;
  color: #999;
}

.clear-selection {
  margin-left: 8px;
  color: #1890ff;
  cursor: pointer;
}

.clear-selection:hover {
  color: #40a9ff;
  text-decoration: underline;
}

.action-buttons {
  display: flex;
  gap: 8px; /* 稍微增加按钮间间距 */
  align-items: center;
}
</style>
