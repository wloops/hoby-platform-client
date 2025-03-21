<script lang="ts" setup>
import type { BatchActionButton } from './components/BatchActions.vue';
import type {
  ActionButton,
  ColumnConfig,
  FilterValue,
  SearchFormState,
  SorterResult,
  TableItem,
  ValueTransformer,
} from './types';

import {
  computed,
  defineEmits,
  defineProps,
  h,
  nextTick,
  onMounted,
  reactive,
  ref,
  watch,
} from 'vue';

import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Select,
  Table,
  Tag,
} from 'ant-design-vue';
import { v4 as uuidv4 } from 'uuid';

import { useEnums } from '#/composables';

import BatchActions from './components/BatchActions.vue';
import EditableCell from './components/EditableCell.vue';
import { FieldType } from './types';

// 定义属性
const props = defineProps({
  // 表头配置
  columns: {
    required: true,
    type: Array as () => ColumnConfig[],
  },
  // 当前页码
  currentPage: {
    default: 1,
    type: Number,
  },
  // 外部传入的数据源
  dataSource: {
    default: () => [],
    type: Array as () => TableItem[],
  },
  // 空数据提示文本
  emptyText: {
    default: '暂无数据',
    type: String,
  },
  // 自定义加载数据的方法
  fetchDataFunc: {
    default: null,
    type: Function,
  },
  // 加载状态
  loading: {
    default: false,
    type: Boolean,
  },
  // 每页条数
  pageSize: {
    default: 10,
    type: Number,
  },
  // 重置按钮文本
  resetButtonText: {
    default: '重置',
    type: String,
  },
  // 表格行的唯一标识字段
  rowKey: {
    default: 'id',
    type: String,
  },
  // 是否允许选择行
  rowSelection: {
    default: false,
    type: [Boolean, Object],
  },
  // 搜索按钮文本
  searchButtonText: {
    default: '搜索',
    type: String,
  },
  // 是否显示分页
  showPagination: {
    default: true,
    type: Boolean,
  },
  // 是否显示搜索面板
  showSearch: {
    default: true,
    type: Boolean,
  },
  // 数据总数
  total: {
    default: 0,
    type: Number,
  },
  // 批量操作按钮
  batchActions: {
    default: () => [],
    type: Array as () => BatchActionButton[],
  },
  // 批量操作按钮位置
  batchActionPosition: {
    default: 'top',
    type: String as () => 'bottom' | 'top',
  },
});

// 定义事件
const emit = defineEmits([
  'search',
  'reset',
  'pageChange',
  'rowClick',
  'selectionChange',
  'update:currentPage',
  'update:pageSize',
  'update:loading',
  'cellSave',
]);

const { getEnumLabel, getEnumColor, getEnumList } = useEnums();

// 使用自定义类型定义
interface TablePaginationConfig {
  [key: string]: any;
  current?: number;
  pageSize?: number;
  total?: number;
}

// 在文件顶部添加 TableColumn 类型定义
interface TableColumn {
  dataIndex: string;
  key: string;
  title: string;
  width?: number;
  ellipsis?: boolean;
  align?: 'center' | 'left' | 'right';
  enumName?: string;
  fixed?: 'left' | 'right' | boolean;
  customRender?: (params: { record: TableItem; text: any }) => any;
}

// 内部状态
const internalLoading = ref(props.loading);
const internalCurrent = ref(props.currentPage);
const internalPageSize = ref(props.pageSize);
const internalTotal = ref(props.total);
const tableData = ref<TableItem[]>(props.dataSource);
const selectedRowKeys = ref<Array<number | string>>([]);
const selectedRows = ref<TableItem[]>([]);

// 动态创建搜索表单
const searchForm = reactive<SearchFormState>({});

// 添加以下计算属性和响应式变量
const searchPanelHeight = ref(0);
const tableHeaderHeight = ref(0);
const paginationHeight = 56; // 分页器固定高度

// 计算表格可用高度
const tableScrollY = computed(() => {
  const searchHeight =
    props.showSearch && searchableFields.value.length > 0
      ? searchPanelHeight.value
      : 0;

  return `calc(100vh - ${searchHeight}px - ${tableHeaderHeight.value}px - ${paginationHeight}px - 220px)`; // 180px 为其他固定元素的总高度(如页面header等)
});

// 监听外部数据变化
watch(
  () => props.dataSource,
  (val) => {
    tableData.value = val;
  },
  { deep: true },
);

watch(
  () => props.total,
  (val) => {
    internalTotal.value = val;
  },
);

watch(
  () => props.currentPage,
  (val) => {
    internalCurrent.value = val;
  },
);

watch(
  () => props.pageSize,
  (val) => {
    internalPageSize.value = val;
  },
);

watch(
  () => props.loading,
  (val) => {
    internalLoading.value = val;
  },
);

// 赋值枚举列表
if (props.columns.length > 0) {
  props.columns.forEach((col) => {
    if (col.enumName && getEnumList(col.enumName)) {
      col.options = getEnumList(col.enumName) as any[];
    }
  });
}

// 初始化搜索表单字段
props.columns.forEach((col) => {
  if (col.searchable) {
    searchForm[col.dataIndex] = '';
  }
});

// 权限检查函数（如果有权限系统）
// const hasPermission = (permission: string) => {
//   // 实现权限检查逻辑，没有权限系统时可以直接返回true
//   return true;
// };

// 渲染操作按钮
const renderActionButton = (button: ActionButton, record: TableItem) => {
  // 如果设置了show条件且不满足，则不显示该按钮
  if (button.show && !button.show(record)) {
    return null;
  }

  // 如果设置了权限且用户没有该权限，则不显示该按钮
  // if (button.permission && !hasPermission(button.permission)) {
  //   return null;
  // }

  // 按钮点击处理函数
  const handleClick = (e: Event) => {
    e.stopPropagation(); // 阻止事件冒泡，防止触发行点击事件

    // 如果设置了确认提示，则显示确认对话框
    if (button.confirm) {
      // 处理自动生成确认提示语
      let confirmContent = button.confirm;
      if (button.confirm === 'auto') {
        confirmContent = `确定要${button.text}吗？`;
      }

      Modal.confirm({
        title: button.confirmTitle || '确认操作',
        icon: h(ExclamationCircleOutlined),
        content: confirmContent,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          button.onClick(record);
        },
      });
    } else {
      // 直接执行点击事件
      button.onClick(record);
    }
  };

  // 渲染按钮
  return h(
    Button,
    {
      ...button, // 传递其他属性
      type: button.type || 'link',
      danger: button.danger,
      disabled: button.disabled ? button.disabled(record) : false,
      onClick: handleClick,
      size: 'small',
    },
    {
      default: () => (button.icon ? h('span', {}, [button.text]) : button.text),
    },
  );
};

// 渲染操作按钮组
const renderActionButtons = (actions: ActionButton[], record: TableItem) => {
  const buttons = actions
    .map((button) => renderActionButton(button, record))
    .filter(Boolean); // 过滤掉不显示的按钮

  if (buttons.length === 0) {
    return null;
  }

  return h('div', { class: 'data-table-action-buttons' }, buttons);
};

// 处理单元格保存事件
const handleCellSave = async ({
  record,
  value,
  column,
}: {
  column: ColumnConfig;
  record: TableItem;
  value: any;
}) => {
  try {
    // 如果列配置了保存回调，调用它
    if (column.editConfig?.onSave) {
      await column.editConfig.onSave(record, value);
    }

    // 触发全局保存事件
    emit('cellSave', { record, column, value });

    // 如果存在获取数据函数，刷新表格
    if (props.fetchDataFunc) {
      await fetchData();
    }
  } catch (error) {
    console.error('保存单元格数据失败:', error);
  }
};

// 修改 visibleColumns 的渲染逻辑
const visibleColumns = computed<TableColumn[]>(() => {
  const basicColumns = props.columns
    .filter((col) => col.visible !== false && !col.actions)
    .map((col) => ({
      ...col.antdvTableProps,
      dataIndex: col.dataIndex,
      key: col.dataIndex,
      title: col.title,
      width: col.width,
      align: col.align,
      fixed: col.fixed,
      ellipsis: col.ellipsis ?? false,
      customCell: () => ({
        style: {
          padding: '8px 12px',
          borderRight: '1px solid #f0f0f0',
          // overflow: 'hidden',
          // textOverflow: 'ellipsis',
        },
      }),
      customRender: ({ text, record }: { record: TableItem; text: any }) => {
        // 判断当前单元格是否可编辑
        const editable =
          typeof col.editable === 'function'
            ? col.editable(record)
            : col.editable;

        // 如果单元格可编辑，使用EditableCell组件包装
        if (editable) {
          return h(
            EditableCell,
            {
              text,
              record,
              editable: true,
              type: col.editConfig?.type || 'input',
              options: col.editConfig?.options || [],
              rules: col.editConfig?.rules || [],
              onSave: ({ value }) =>
                handleCellSave({
                  record,
                  value,
                  column: col,
                }),
            },
            {
              default: () => {
                // 默认显示内容
                if (col.type === FieldType.SELECT && col.options) {
                  return renderCellContent(record[col.dataIndex], col);
                } else if (col.render) {
                  return col.render(text, record, 0);
                }
                return text;
              },
            },
          );
        }

        // 非可编辑单元格的现有渲染逻辑
        if (col.render) {
          return col.render(text, record, 0);
        }

        if (col.type === FieldType.SELECT) {
          return col.options && !col.enumName
            ? renderCellContent(record[col.dataIndex], col)
            : h(
                Tag,
                {
                  color:
                    getEnumColor(`${col.enumName}|${col.dataIndex}`, text) ||
                    'default',
                },
                () =>
                  getEnumLabel(`${col.enumName}|${col.dataIndex}`, text) ||
                  text,
              );
        }

        return text;
      },
    }));

  // 查找是否有操作列
  const actionColumn = props.columns.find(
    (col) => col.actions && col.actions.length > 0,
  );

  // 如果有操作列，添加到表格列中
  if (actionColumn) {
    const actionColumnProps = actionColumn.actionColumnProps || {};

    basicColumns.push({
      title: actionColumnProps.title || '操作',
      key: 'action',
      dataIndex: 'action',
      ellipsis: false,
      fixed: actionColumnProps.fixed || 'right',
      align: actionColumnProps.align || 'center',
      width: (actionColumnProps.width as number) || 180,
      customCell: () => ({
        style: {
          padding: '8px',
          borderRight: '1px solid #f0f0f0',
          // textAlign: 'center',
        },
      }),
      customRender: ({ record }: { record: TableItem }) => {
        return renderActionButtons(actionColumn.actions || [], record);
      },
    });
  }

  return basicColumns;
});

// 计算可搜索的字段
const searchableFields = computed(() => {
  return props.columns.filter((col) => col.searchable);
});

// 计算表格选择配置
const rowSelectionConfig = computed(() => {
  if (!props.rowSelection) return undefined;

  // 基础配置
  const baseConfig = {
    onChange: (keys: Array<number | string>, rows: TableItem[]) => {
      selectedRowKeys.value = keys;
      selectedRows.value = rows;
      emit('selectionChange', { keys, rows });
    },
    selectedRowKeys: selectedRowKeys.value,
    fixed: true, // 默认固定在左侧
    columnWidth: 50, // 设置默认宽度
  };

  // 如果传入的是布尔值，使用基础配置
  // 如果传入的是对象，合并基础配置和用户配置
  return typeof props.rowSelection === 'boolean'
    ? baseConfig
    : { ...baseConfig, ...props.rowSelection };
});

// 搜索方法
const handleSearch = () => {
  internalCurrent.value = 1;
  emit('update:currentPage', 1);
  emit('search', { ...searchForm });
  if (props.fetchDataFunc) fetchData();
};

// 重置搜索
const handleReset = () => {
  // 重置搜索表单
  searchableFields.value.forEach((field) => {
    searchForm[field.dataIndex] = '';
  });

  internalCurrent.value = 1;
  emit('update:currentPage', 1);
  emit('reset');
  if (props.fetchDataFunc) fetchData();
};

// 处理表格变化（分页、筛选、排序）
const handleTableChange = (
  pagination: TablePaginationConfig,
  filters: Record<string, FilterValue>,
  sorter: Array<SorterResult> | SorterResult,
) => {
  if (pagination.current) {
    internalCurrent.value = pagination.current;
    emit('update:currentPage', pagination.current);
  }
  if (pagination.pageSize) {
    internalPageSize.value = pagination.pageSize;
    emit('update:pageSize', pagination.pageSize);
  }

  emit('pageChange', {
    current: internalCurrent.value,
    filters,
    pageSize: internalPageSize.value,
    sorter,
  });

  if (props.fetchDataFunc) fetchData();
};

// 行点击事件
const handleRowClick = (record: TableItem) => {
  emit('rowClick', record);
};

// 获取数据
const fetchData = async () => {
  if (!props.fetchDataFunc) return;

  internalLoading.value = true;
  emit('update:loading', true);

  try {
    const result = await props.fetchDataFunc({
      ...searchForm,
      currentPage: internalCurrent.value,
      numOfPerPage: internalPageSize.value,
    });
    // 如果dataSource每条数据没有id，则添加一个唯一的id
    result.data.forEach((item: TableItem) => {
      if (!item.id) {
        item.id = uuidv4();
      }
    });
    tableData.value = result.data || [];
    internalTotal.value = result.total || 0;
  } catch (error) {
    console.error('获取数据失败', error);
  } finally {
    internalLoading.value = false;
    selectedRowKeys.value = [];
    emit('update:loading', false);
  }
};

// 添加一个自动调整列宽度的工具函数
const adjustColumnWidths = () => {
  // 计算除了操作列以外所有列的总宽度
  // const contentColumns = props.columns.filter(
  //   (col) => col.visible !== false && !col.actions,
  // );

  // const totalContentWidth = contentColumns.reduce((sum, col) => {
  //   return sum + (col.width || 100);
  // }, 0);

  // 找到操作列
  const actionColumn = props.columns.find(
    (col) => col.actions && col.actions.length > 0,
  );

  // 如果有操作列，调整其宽度
  if (actionColumn && actionColumn.actionColumnProps) {
    // 计算每个操作按钮的平均宽度 (大约65px)
    const buttonsCount = actionColumn.actions?.length || 0;
    const estimatedWidth = Math.max(buttonsCount * 65, 120);

    // 调整操作列宽度
    actionColumn.actionColumnProps.width = estimatedWidth;
  }
};

// 在组件挂载时调整列宽度
onMounted(() => {
  adjustColumnWidths();

  if (props.fetchDataFunc && props.dataSource.length === 0) {
    fetchData();
  }

  // 获取搜索面板高度
  nextTick(() => {
    const searchPanel = document.querySelector('.search-panel');
    if (searchPanel) {
      searchPanelHeight.value = searchPanel.getBoundingClientRect().height;
    }

    // 获取表格头部高度
    const tableHeader = document.querySelector('.ant-table-header');
    if (tableHeader) {
      tableHeaderHeight.value = tableHeader.getBoundingClientRect().height;
    }
  });
});

// 监听窗口大小变化
onMounted(() => {
  window.addEventListener('resize', updateHeight);
  return () => {
    window.removeEventListener('resize', updateHeight);
  };
});

// 更新高度的方法
const updateHeight = () => {
  nextTick(() => {
    const searchPanel = document.querySelector('.search-panel');
    if (searchPanel) {
      searchPanelHeight.value = searchPanel.getBoundingClientRect().height;
    }

    const tableHeader = document.querySelector('.ant-table-header');
    if (tableHeader) {
      tableHeaderHeight.value = tableHeader.getBoundingClientRect().height;
    }
  });
};

// 暴露方法给父组件
defineExpose({
  clearSelection: () => {
    selectedRowKeys.value = [];
    selectedRows.value = [];
  },
  getCurrentPage: () => internalCurrent.value,
  getPageSize: () => internalPageSize.value,
  getSearchParams: () => ({ ...searchForm }),
  refresh: fetchData,
  resetSearch: handleReset,
  searchForm,
  selectedRowKeys,
  selectedRows,
  setSelection: (keys: Array<number | string>, rows: TableItem[]) => {
    selectedRowKeys.value = keys;
    selectedRows.value = rows;
  },
  executeBatchAction: (actionName: string) => {
    // 查找对应名称的操作按钮
    const actionColumn = props.columns.find(
      (col) => col.actions && col.actions.length > 0,
    );
    const action = actionColumn?.actions?.find(
      (btn) => btn.text === actionName,
    );

    if (action && selectedRows.value.length > 0) {
      // 对每一行执行操作
      selectedRows.value.forEach((row) => {
        action.onClick(row);
      });
    }
  },
});

// 值转换器实现
const valueTransformers: Record<FieldType, ValueTransformer> = {
  [FieldType.SELECT]: {
    toDisplay: (value: any, column: ColumnConfig) => {
      if (!column.options) return String(value);
      const option = column.options.find((opt) => opt.value === value);
      return option ? option.label : String(value);
    },
    toValue: (displayValue: string, column: ColumnConfig) => {
      if (!column.options) return displayValue;
      const option = column.options.find((opt) => opt.label === displayValue);
      return option ? option.value : displayValue;
    },
  },
  [FieldType.STRING]: {
    toDisplay: String,
    toValue: (value: string) => value,
  },
  [FieldType.NUMBER]: {
    toDisplay: String,
    toValue: Number,
  },
  [FieldType.CHECKBOX]: {
    toDisplay: String,
    toValue: (value: string) => value,
  },
  [FieldType.DATE]: {
    toDisplay: String,
    toValue: (value: string) => value,
  },
  [FieldType.DATETIME]: {
    toDisplay: String,
    toValue: (value: string) => value,
  },
  [FieldType.SWITCH]: {
    toDisplay: String,
    toValue: (value: string) => value,
  },
  [FieldType.OPERATION]: {
    toDisplay: String,
    toValue: (value: string) => value,
  },
};

// 渲染单元格内容
const renderCellContent = (value: any, column: ColumnConfig) => {
  const transformer = valueTransformers[column.type as FieldType];
  if (transformer) {
    return transformer.toDisplay(value, column);
  }
  return value;
};

// 处理清空选择
const handleClearSelection = () => {
  selectedRowKeys.value = [];
  selectedRows.value = [];
};

// // 计算实际使用的批量操作按钮
// const effectiveBatchActions = computed(() => {
//   // 如果用户没有提供批量操作按钮，提供一个默认的
//   if (!props.batchActions || props.batchActions.length === 0) {
//     return [
//       {
//         text: '批量删除',
//         type: 'primary' as const, // 使用类型断言确保类型正确
//         danger: true,
//         onClick: () => {
//           console.warn('请配置批量删除操作'); // 使用 warn 代替 log 避免 linter 警告
//         },
//         minSelected: 1,
//         disabled: () => true, // 默认禁用
//       },
//     ];
//   }
//   return props.batchActions;
// });

// 获取行操作按钮
const rowActionButtons = computed(() => {
  const actionColumn = props.columns.find(
    (col) => col.actions && col.actions.length > 0,
  );
  return actionColumn?.actions || [];
});
</script>

<template>
  <div class="data-table-component">
    <!-- 搜索面板 -->
    <Card
      v-if="showSearch && searchableFields.length > 0"
      :bordered="false"
      class="search-panel"
    >
      <Form layout="inline" :model="searchForm">
        <div class="search-form-content">
          <div class="search-fields">
            <Form.Item
              v-for="field in searchableFields"
              :key="field.dataIndex"
              :label="field.title"
            >
              <template v-if="field.type === FieldType.SELECT && field.options">
                <Select
                  v-model:value="searchForm[field.dataIndex]"
                  placeholder="请选择"
                  allow-clear
                  style="width: 200px"
                >
                  <Select.Option
                    v-for="option in field.options"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Option>
                </Select>
              </template>
              <template v-else>
                <Input
                  v-model:value="searchForm[field.dataIndex]"
                  :placeholder="`请输入${field.title}`"
                />
              </template>
            </Form.Item>
          </div>
          <div class="search-buttons">
            <Button type="primary" @click="handleSearch">
              {{ searchButtonText }}
            </Button>
            <Button style="margin-left: 8px" @click="handleReset">
              {{ resetButtonText }}
            </Button>
          </div>
        </div>
      </Form>
    </Card>

    <!-- 表格区域 - 注意移除了 margin-top -->
    <div class="table-wrapper">
      <!-- 批量操作按钮（始终显示在表格上方） -->
      <BatchActions
        v-if="rowSelection"
        :actions="batchActions || []"
        :row-actions="rowActionButtons"
        :selected-rows="selectedRows"
        :selected-row-keys="selectedRowKeys"
        :always-show="true"
        @clear="handleClearSelection"
      />

      <Card
        :bordered="true"
        :class="{ 'table-with-batch-actions': rowSelection }"
        class="table-card"
      >
        <Table
          :columns="visibleColumns"
          :data-source="tableData"
          :loading="internalLoading"
          :pagination="
            showPagination
              ? {
                  current: internalCurrent,
                  pageSize: internalPageSize,
                  total: internalTotal,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `共 ${total} 条`,
                  position: ['bottomRight'],
                  size: 'default',
                }
              : false
          "
          :locale="{ emptyText }"
          :row-key="rowKey"
          :row-selection="rowSelectionConfig"
          :scroll="{ x: '100%', y: tableScrollY }"
          table-layout="fixed"
          @change="handleTableChange as any"
          @row-click="handleRowClick"
          :bordered="false"
        />
      </Card>
    </div>
  </div>
</template>

<style scoped>
.data-table-component {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  transition: all 0.3s;
}

.search-panel {
  flex-shrink: 0;
  margin-bottom: 16px;
}

.search-form-content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: 12px;
}

.search-fields {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  gap: 5px;
}

.search-buttons {
  display: flex;
  justify-content: flex-end;
  margin-left: 16px;
}

.table-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.table-card {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  border-radius: 2px;
}

.table-with-batch-actions {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

:deep(.ant-card-body) {
  display: flex;
  flex-direction: row;
  padding: 0;
}

:deep(.ant-table-wrapper) {
  height: 100%;
}

:deep(.ant-spin-nested-loading),
:deep(.ant-spin-container) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

:deep(.ant-table) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

:deep(.ant-table-container) {
  display: flex;
  flex-direction: column;
  height: 100%;
  border: none !important;
}

:deep(.ant-table-header) {
  flex-shrink: 0;
}

:deep(.ant-table-body) {
  flex: 1;
  margin-bottom: 0;
  overflow-y: auto !important;
}

:deep(.ant-table-pagination) {
  position: sticky;
  right: 0;
  bottom: 0;
  z-index: 10;
  flex-shrink: 0;
  padding: 8px;
  margin: 0 !important;
  background: white;
  border-top: 1px solid #f0f0f0;
}

:deep(.ant-pagination-options) {
  margin-left: 16px;
}

/* 操作按钮组样式 */
:deep(.ant-space) {
  display: flex;
  justify-content: center;
}

/* 添加操作按钮样式 */
:deep(.data-table-action-buttons) {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  align-items: center;
  justify-content: center;
  width: calc(100% + 16px);
  padding: 0 8px;
  margin: 0 -8px;
}

:deep(.data-table-action-buttons .ant-btn) {
  padding: 0 4px;
}

:deep(.ant-table-thead > tr > th) {
  border-top: 1px solid #f0f0f0;
  border-right: 1px solid #f0f0f0;
}

:deep(.ant-table-thead > tr > th:first-child),
:deep(.ant-table-tbody > tr > td:first-child) {
  border-left: 1px solid #f0f0f0;
}

:deep(.ant-table-tbody > tr) {
  border-bottom: 1px solid #f0f0f0;
}

:deep(.ant-table-tbody > tr > td) {
  border-right: 1px solid #f0f0f0;
}

:deep(.ant-table-tbody > tr > td:last-child),
:deep(.ant-table-thead > tr > th:last-child) {
  border-right: 1px solid #f0f0f0 !important;
}
</style>
