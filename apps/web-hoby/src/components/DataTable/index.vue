<script lang="ts" setup>
import type {
  ColumnConfig,
  FilterValue,
  SearchFormState,
  SorterResult,
  TableItem,
} from './types';

import {
  computed,
  defineEmits,
  defineProps,
  nextTick,
  onMounted,
  reactive,
  ref,
  watch,
} from 'vue';

import { Button, Card, Form, Input, Select, Table } from 'ant-design-vue';

import { FieldType } from './types';

// 使用自定义类型定义
interface TablePaginationConfig {
  [key: string]: any;
  current?: number;
  pageSize?: number;
  total?: number;
}

type TableColumn = {
  [key: string]: any;
  dataIndex: string;
  key: string;
  title: string;
  width?: number | string;
};

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
]);

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

  return `calc(100vh - ${searchHeight}px - ${tableHeaderHeight.value}px - ${paginationHeight}px - 180px)`; // 180px 为其他固定元素的总高度(如页面header等)
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

// 初始化搜索表单字段
props.columns.forEach((col) => {
  if (col.searchable) {
    searchForm[col.dataIndex] = '';
  }
});

// 计算可见的表格列
const visibleColumns = computed<TableColumn[]>(() => {
  return props.columns
    .filter((col) => col.visible !== false)
    .map((col) => ({
      dataIndex: col.dataIndex,
      key: col.dataIndex,
      title: col.title,
      width: col.width,
    }));
});

// 计算可搜索的字段
const searchableFields = computed(() => {
  return props.columns.filter((col) => col.searchable);
});

// 计算表格选择配置
const rowSelectionConfig = computed(() => {
  if (!props.rowSelection) return undefined;

  const baseConfig = {
    onChange: (keys: Array<number | string>, rows: TableItem[]) => {
      selectedRowKeys.value = keys;
      selectedRows.value = rows;
      emit('selectionChange', { keys, rows });
    },
    selectedRowKeys: selectedRowKeys.value,
  };

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
      page: internalCurrent.value,
      pageSize: internalPageSize.value,
    });

    tableData.value = result.data || [];
    internalTotal.value = result.total || 0;
  } catch (error) {
    console.error('获取数据失败', error);
  } finally {
    internalLoading.value = false;
    emit('update:loading', false);
  }
};

// 组件挂载时获取数据
onMounted(() => {
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

    <!-- 表格区域 -->
    <Card
      :bordered="false"
      :class="{ 'margin-top': showSearch && searchableFields.length > 0 }"
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
        @change="handleTableChange as any"
        @row-click="handleRowClick"
        bordered
      />
    </Card>
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

.table-card {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
}

:deep(.ant-card-body) {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0;
  overflow: hidden;
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
</style>
