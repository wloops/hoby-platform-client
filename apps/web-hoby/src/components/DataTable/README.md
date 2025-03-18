# DataTable 组件使用文档

## 组件概述

DataTable 是一个功能丰富的表格组件，基于 Ant Design Vue 的 Table 组件进行封装，支持搜索、分页、行选择、自定义数据加载等功能。该组件专为数据展示和管理场景设计，拥有灵活的配置项和良好的性能表现。

## 基本使用

```vue
<template>
  <DataTable
    ref="dataTableRef"
    :columns="columns"
    :data-source="tableData"
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    v-model:loading="loading"
    :total="total"
    :fetch-data-func="fetchData"
    :row-selection="true"
    row-key="id"
    @search="handleSearch"
    @pageChange="handlePageChange"
    @selectionChange="handleSelectionChange"
  />
</template>
```

## 属性（Props）

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| columns | `ColumnConfig[]` | 必填 | 表格列配置 |
| currentPage | `number` | 1 | 当前页码，支持 v-model:current-page |
| dataSource | `TableItem[]` | [] | 表格数据源 |
| emptyText | `string` | "暂无数据" | 空数据提示文本 |
| fetchDataFunc | `Function` | null | 自定义数据加载函数，接收搜索参数、分页信息 |
| loading | `boolean` | false | 加载状态，支持 v-model:loading |
| pageSize | `number` | 10 | 每页条数，支持 v-model:page-size |
| resetButtonText | `string` | "重置" | 重置按钮文本 |
| rowKey | `string` | "id" | 表格行唯一标识字段 |
| rowSelection | `boolean \| object` | false | 行选择配置 |
| searchButtonText | `string` | "搜索" | 搜索按钮文本 |
| showPagination | `boolean` | true | 是否显示分页 |
| showSearch | `boolean` | true | 是否显示搜索面板 |
| total | `number` | 0 | 数据总数 |

## 列配置（ColumnConfig）

每个列配置对象支持以下属性：

```typescript
interface ColumnConfig {
  title: string; // 列标题
  dataIndex: string; // 数据字段名
  visible?: boolean; // 是否显示该列，默认 true
  searchable?: boolean; // 是否可搜索，默认 false
  type?: FieldType; // 字段类型，用于搜索表单
  width?: number | string; // 列宽度
  options?: Array<{ label: string; value: string | number }>; // 选项，用于 SELECT 类型
}
```

字段类型枚举：

```typescript
enum FieldType {
  STRING = 'string',
  NUMBER = 'number',
  SELECT = 'select',
  DATE = 'date',
  DATETIME = 'datetime',
}
```

## 事件（Events）

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| search | `formData: Record<string, any>` | 点击搜索按钮时触发 |
| reset | 无 | 点击重置按钮时触发 |
| pageChange | `{ current, pageSize, filters, sorter }` | 分页、筛选或排序变化时触发 |
| rowClick | `record: TableItem` | 点击行时触发 |
| selectionChange | `{ keys: (string \| number)[], rows: TableItem[] }` | 选择行变化时触发 |
| update:currentPage | `page: number` | 当前页变化时触发 |
| update:pageSize | `size: number` | 每页条数变化时触发 |
| update:loading | `loading: boolean` | 加载状态变化时触发 |

## 方法（Methods）

通过 ref 可以访问以下组件方法：

| 方法名 | 参数 | 返回值 | 说明 |
| --- | --- | --- | --- |
| clearSelection | 无 | 无 | 清除当前选中行 |
| getCurrentPage | 无 | `number` | 获取当前页码 |
| getPageSize | 无 | `number` | 获取每页条数 |
| getSearchParams | 无 | `Record<string, any>` | 获取当前搜索参数 |
| refresh | 无 | 无 | 刷新表格数据 |
| resetSearch | 无 | 无 | 重置搜索条件 |
| setSelection | `(keys: (string \| number)[], rows: TableItem[])` | 无 | 设置选中行 |

## 高级用法

### 自定义数据加载

```typescript
const fetchData = async (params) => {
  try {
    // params 包含搜索条件和分页信息
    const { page, pageSize, ...searchParams } = params;
    const result = await api.getList({
      pageNum: page,
      pageSize,
      ...searchParams,
    });

    return {
      data: result.records || [],
      total: result.total || 0,
    };
  } catch (error) {
    console.error('获取数据失败', error);
    return { data: [], total: 0 };
  }
};
```

### 动态高度计算

组件会自动计算表格的可用高度，考虑：

- 搜索面板高度
- 表头高度
- 分页高度
- 页面其他元素高度

表格内容区域会自动滚动，表头和分页区域固定不动。

### 完整示例

```vue
<template>
  <DataTable
    ref="dataTableRef"
    :columns="columns"
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    v-model:loading="loading"
    :data-source="tableData"
    :total="total"
    :fetch-data-func="fetchData"
    :row-selection="true"
    row-key="id"
    search-button-text="查询"
    reset-button-text="清空"
    @search="handleSearch"
    @pageChange="handlePageChange"
    @selectionChange="handleSelectionChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DataTable from '#/components/DataTable/index.vue';
import { FieldType } from '#/components/DataTable/types';
import type { ColumnConfig, TableItem } from '#/components/DataTable/types';

// 表格列配置
const columns: ColumnConfig[] = [
  {
    title: '名称',
    dataIndex: 'name',
    visible: true,
    searchable: true,
    type: FieldType.STRING,
  },
  {
    title: '状态',
    dataIndex: 'status',
    visible: true,
    searchable: true,
    type: FieldType.SELECT,
    options: [
      { label: '正常', value: 'normal' },
      { label: '禁用', value: 'disabled' },
    ],
  },
];

// 状态
const tableData = ref<TableItem[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const loading = ref(false);
const dataTableRef = ref();

// 获取数据方法
const fetchData = async (params) => {
  try {
    const result = await api.getList(params);
    return {
      data: result.records,
      total: result.total,
    };
  } catch (error) {
    console.error('获取数据失败', error);
    return { data: [], total: 0 };
  }
};

// 事件处理
const handleSearch = (formData) => {
  console.log('搜索条件:', formData);
};

const handlePageChange = (info) => {
  console.log('分页信息:', info);
};

const handleSelectionChange = ({ keys, rows }) => {
  console.log('选中行:', rows);
};

// 暴露方法
defineExpose({
  refreshTable: () => {
    dataTableRef.value?.refresh();
  },
});
</script>
```

## 注意事项

1. `fetchDataFunc` 函数需要返回特定格式的对象 `{ data: TableItem[], total: number }`
2. 组件内部使用 v-model 进行双向绑定，确保 currentPage、pageSize 和 loading 的更新
3. 表格高度会自动计算，无需手动设置固定高度
4. 如果需要使用组件提供的方法，请使用 ref 获取组件实例

## 最佳实践

1. 对于复杂表格，建议提前定义好列配置和数据模型
2. 使用 v-model 双向绑定分页和加载状态
3. 在父组件处理搜索和分页逻辑，保持组件的纯展示职责
4. 对于频繁变化的数据，考虑添加防抖或节流处理

## 性能优化

1. 仅在必要时才在列中使用 `searchable: true`
2. 对于大量数据，可以关闭行选择功能
3. 合理设置每页条数，避免一次加载过多数据
4. 使用 v-if 条件渲染，在不需要表格时不渲染组件
