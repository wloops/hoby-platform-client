# DataTable 组件使用文档

DataTable 是一个功能丰富的数据表格组件，支持搜索、分页、排序、筛选、行选择、单元格编辑、批量操作等功能。

## 特性

- 🔍 内置搜索面板，支持多字段搜索
- 📄 分页、排序、筛选一应俱全
- ✏️ 单元格内容可编辑，支持多种编辑器类型
- 🔘 支持行选择和批量操作
- 🔧 操作列支持多种按钮配置和权限控制
- 🌐 支持自定义数据加载方法
- 🔄 自动响应窗口大小变化
- 🎨 可自定义样式和布局

## 基本用法

```vue
<template>
  <DataTable
    :columns="columns"
    :data-source="dataSource"
    :fetch-data-func="fetchData"
    :loading="loading"
    :row-selection="true"
    :batch-actions="batchActions"
    @search="handleSearch"
    @selectionChange="handleSelectionChange"
  />
</template>

<script setup>
import { ref, reactive } from 'vue';
import { DataTable } from '@/components/DataTable';
import { FieldType } from '@/components/DataTable/types';

const dataSource = ref([]);
const loading = ref(false);

// 定义表格列配置
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    type: FieldType.STRING,
    visible: true,
    searchable: true,
  },
  {
    title: '年龄',
    dataIndex: 'age',
    type: FieldType.NUMBER,
    visible: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    type: FieldType.SELECT,
    visible: true,
    options: [
      { label: '活跃', value: 'active' },
      { label: '禁用', value: 'disabled' },
    ],
  },
  {
    title: '操作',
    type: FieldType.OPERATION,
    actions: [
      {
        text: '编辑',
        onClick: (record) => {
          // 处理编辑逻辑
        },
      },
      {
        text: '删除',
        danger: true,
        confirm: '确定要删除该记录吗？',
        onClick: (record) => {
          // 处理删除逻辑
        },
      },
    ],
  },
];

// 定义批量操作按钮
const batchActions = [
  {
    text: '批量删除',
    type: 'primary',
    danger: true,
    confirm: '确定要删除选定的记录吗？',
    onClick: (rows) => {
      // 处理批量删除逻辑
    },
  },
];

// 加载数据方法
const fetchData = async (params) => {
  loading.value = true;
  try {
    // 调用 API 获取数据
    const result = await api.getList(params);
    return {
      data: result.data,
      total: result.total,
    };
  } catch (error) {
    console.error('获取数据失败', error);
    return { data: [], total: 0 };
  } finally {
    loading.value = false;
  }
};

// 处理搜索事件
const handleSearch = (searchParams) => {
  console.log('搜索参数:', searchParams);
};

// 处理选择变化事件
const handleSelectionChange = ({ keys, rows }) => {
  console.log('选中的行:', rows);
};
</script>
```

## 配置项

### Props

| 属性名 | 类型 | 说明 | 默认值 |
| --- | --- | --- | --- |
| columns | Array | 表格列配置，详见下方列配置 | [] |
| dataSource | Array | 数据源 | [] |
| currentPage | Number | 当前页码 | 1 |
| pageSize | Number | 每页条数 | 10 |
| total | Number | 数据总数 | 0 |
| rowKey | String | 行数据的唯一标识字段 | 'id' |
| loading | Boolean | 加载状态 | false |
| fetchDataFunc | Function | 自定义加载数据的方法 | null |
| showSearch | Boolean | 是否显示搜索面板 | true |
| showPagination | Boolean | 是否显示分页 | true |
| emptyText | String | 空数据提示文本 | '暂无数据' |
| searchButtonText | String | 搜索按钮文本 | '搜索' |
| resetButtonText | String | 重置按钮文本 | '重置' |
| rowSelection | Boolean/Object | 是否允许选择行或选择配置 | false |
| batchActions | Array | 批量操作按钮配置 | [] |
| batchActionPosition | String | 批量操作按钮位置，'top' 或 'bottom' | 'top' |

### 列配置 (ColumnConfig)

| 属性名 | 类型 | 说明 | 默认值 |
| --- | --- | --- | --- |
| title | String | 列标题 | - |
| dataIndex | String | 列数据字段名 | - |
| visible | Boolean | 是否显示该列 | true |
| searchable | Boolean | 是否可搜索 | false |
| type | FieldType | 列数据类型 | - |
| width | Number | 列宽度 | - |
| fixed | Boolean/String | 是否固定列，可选值：true/'left'/'right' | - |
| align | String | 对齐方式，可选值：'left'/'center'/'right' | 'left' |
| ellipsis | Boolean | 是否显示省略号 | false |
| enumName | String | 枚举名称，用于字典转换 | - |
| options | Array | 选项列表，用于 SELECT 类型 | - |
| render | Function | 自定义渲染函数 | - |
| actions | Array | 操作按钮配置，用于 OPERATION 类型列 | - |
| editable | Boolean/Function | 是否可编辑或判断函数 | false |
| editConfig | Object | 编辑配置，详见下方编辑配置 | - |

### 编辑配置 (EditableCellConfig)

| 属性名 | 类型 | 说明 | 默认值 |
| --- | --- | --- | --- |
| type | String | 编辑器类型，可选值：'input'/'number'/'select'/'date'/'datetime' | 'input' |
| options | Array | 选项列表，用于 'select' 类型 | [] |
| rules | Array | 校验规则 | [] |
| onSave | Function | 保存回调函数 | - |

### 操作按钮配置 (ActionButton)

| 属性名 | 类型 | 说明 | 默认值 |
| --- | --- | --- | --- |
| text | String | 按钮文本 | - |
| type | String | 按钮类型，可选值：'primary'/'default'/'dashed'/'text'/'link'/'ghost' | 'link' |
| danger | Boolean | 是否危险按钮 | false |
| icon | String | 图标名称 | - |
| onClick | Function | 点击事件处理函数 | - |
| show | Function | 控制按钮是否显示的函数 | - |
| disabled | Function | 控制按钮是否禁用的函数 | - |
| confirm | String | 确认提示文本 | - |
| confirmTitle | String | 确认对话框标题 | '确认操作' |
| permission | String | 权限控制标识 | - |
| batchable | Boolean | 是否可批量操作 | true |

### 批量操作按钮配置 (BatchActionButton)

| 属性名 | 类型 | 说明 | 默认值 |
| --- | --- | --- | --- |
| text | String | 按钮文本 | - |
| type | String | 按钮类型，同 ActionButton | 'primary' |
| danger | Boolean | 是否危险按钮 | false |
| icon | String | 图标名称 | - |
| onClick | Function | 点击事件处理函数，参数为选中的行数据数组 | - |
| disabled | Function | 控制按钮是否禁用的函数，参数为选中的行数据数组 | - |
| confirm | String | 确认提示文本 | - |
| confirmTitle | String | 确认对话框标题 | '确认批量操作' |
| minSelected | Number | 最少需要选择的行数 | 1 |
| permission | String | 权限控制标识 | - |

### 行选择配置 (rowSelection)

如果传入的是一个对象，可以通过以下属性进行配置：

| 属性名          | 类型     | 说明                            | 默认值     |
| --------------- | -------- | ------------------------------- | ---------- |
| columnWidth     | Number   | 选择列的宽度                    | 60         |
| fixed           | Boolean  | 是否固定选择列在左侧            | true       |
| selectedRowKeys | Array    | 选中的行 key 数组               | []         |
| type            | String   | 选择类型，'checkbox' 或 'radio' | 'checkbox' |
| onChange        | Function | 选择项变化时的回调              | -          |

例如，要配置选择列固定在左侧且设置宽度：

```vue
<DataTable
  :columns="columns"
  :data-source="dataSource"
  :row-selection="{
    fixed: true, // 固定选择列在左侧
    columnWidth: 50, // 设置选择列宽度为 50px
  }"
/>
```

## 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| search | 搜索事件 | (searchForm: 搜索表单数据) |
| reset | 重置搜索事件 | - |
| pageChange | 分页、排序、筛选变化事件 | (info: 变化信息) |
| rowClick | 行点击事件 | (record: 行数据) |
| selectionChange | 选择变化事件 | ({ keys: 选中的键数组, rows: 选中的行数据数组 }) |
| update:currentPage | 页码变化事件 | (page: 新页码) |
| update:pageSize | 每页条数变化事件 | (size: 新的每页条数) |
| update:loading | 加载状态变化事件 | (loading: 新的加载状态) |
| cellSave | 单元格保存事件 | ({ record: 行数据, column: 列配置, value: 保存的值 }) |

## 方法

可以通过 ref 引用获取组件实例，调用以下方法：

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| refresh | 刷新表格数据 | - |
| clearSelection | 清空选择 | - |
| setSelection | 设置选中行 | (keys: 键数组, rows: 行数据数组) |
| getCurrentPage | 获取当前页码 | - |
| getPageSize | 获取每页条数 | - |
| getSearchParams | 获取当前搜索参数 | - |
| resetSearch | 重置搜索表单 | - |
| executeBatchAction | 执行指定名称的批量操作 | (actionName: 操作按钮的文本) |

## 批量操作功能

DataTable 组件支持批量操作功能，允许用户选择多条记录并对这些记录执行相同的操作。

### 启用批量操作

要使用批量操作功能，首先需要启用表格的行选择功能：

```vue
<DataTable
  :columns="columns"
  :data-source="dataSource"
  :row-selection="{
    fixed: true, // 固定选择列在左侧
  }"
  :batch-actions="batchActions"
/>
```

### 批量操作按钮配置方式

有两种方式可以添加批量操作按钮：

#### 1. 直接定义批量操作按钮

```typescript
const batchActions = [
  {
    text: '批量开始营业',
    type: 'primary',
    onClick: (rows) => {
      // 对选中的记录执行批量操作
      handleBatchOperation(rows, 'start');
    },
    // 可选：定义最少需要选择的行数，默认为1
    minSelected: 1,
    // 可选：添加确认对话框
    confirm: '确定要将选中的店铺批量开始营业吗？',
    // 可选：根据选择的行动态控制按钮是否禁用
    disabled: (selectedRows) => {
      // 如果选中的记录中有任何一条已经是营业状态，则禁用按钮
      return selectedRows.some((row) => row.status === 'active');
    },
  },
];
```

#### 2. 自动从单行操作按钮生成批量操作

系统会自动从操作列的按钮生成对应的批量操作按钮，除非该按钮明确标记为不可批量操作。

```typescript
const columns = [
  // 其他列配置...
  {
    title: '操作',
    type: FieldType.OPERATION,
    actions: [
      {
        text: '开始营业',
        type: 'link',
        onClick: (record) => {
          handleOperation(record, 'start');
        },
        // 不设置 batchable: false，表示可以批量操作
        show: (record) => record.status !== 'active',
      },
      {
        text: '查看详情',
        onClick: (record) => {
          navigateToDetail(record.id);
        },
        // 明确标记为不可批量操作
        batchable: false,
      },
    ],
  },
];
```

### 批量操作特性

1. **智能禁用**：批量操作按钮会根据所选记录自动启用或禁用。
2. **单一确认**：对于需要确认的批量操作，只会显示一个确认对话框，而不是对每行数据单独确认。
3. **自动生成**：系统会基于单行操作按钮自动生成对应的批量操作按钮，减少重复配置。

## 完整示例

```vue
<template>
  <DataTable
    ref="dataTableRef"
    :columns="columns"
    :data-source="dataSource"
    :fetch-data-func="fetchData"
    :loading="loading"
    :row-selection="{
      fixed: true, // 固定选择列在左侧
      columnWidth: 50, // 设置选择列宽度
    }"
    :batch-actions="batchActions"
    @search="handleSearch"
    @selectionChange="handleSelectionChange"
  />
</template>

<script setup>
import { ref } from 'vue';
import { DataTable } from '@/components/DataTable';
import { FieldType } from '@/components/DataTable/types';
import { message } from 'ant-design-vue';

const dataTableRef = ref(null);
const loading = ref(false);
const dataSource = ref([]);
const selectedRows = ref([]);

// 定义表格列配置
const columns = [
  {
    title: '店铺',
    dataIndex: 'name',
    type: FieldType.STRING,
    visible: true,
    searchable: true,
    fixed: 'left', // 可以固定首列在左侧
    width: 200, // 设置列宽
  },
  {
    title: '营业中',
    dataIndex: 'status',
    type: FieldType.SELECT,
    visible: true,
    options: [
      { label: '是', value: 'active' },
      { label: '否', value: 'inactive' },
    ],
  },
  {
    title: '操作',
    type: FieldType.OPERATION,
    fixed: 'right', // 将操作列固定在右侧
    width: 150, // 设置操作列宽度
    actions: [
      {
        text: '开始营业',
        type: 'link',
        onClick: (record) => handleOperation(record, 'start'),
        show: (record) => record.status !== 'active',
        confirm: '确定要开始营业吗？',
      },
      {
        text: '停止营业',
        type: 'link',
        danger: true,
        onClick: (record) => handleOperation(record, 'stop'),
        show: (record) => record.status === 'active',
        confirm: '确定要停止营业吗？',
      },
      {
        text: '查看详情',
        onClick: (record) => {
          navigateToDetail(record.id);
        },
        // 明确标记为不可批量操作
        batchable: false,
      },
    ],
  },
];

// 定义批量操作按钮
const batchActions = [
  {
    text: '批量开始营业',
    type: 'primary',
    onClick: (rows) => handleBatchOperation(rows, 'start'),
    disabled: (rows) => rows.every((row) => row.status === 'active'),
    confirm: '确定要批量开始营业吗？',
  },
  {
    text: '批量停止营业',
    type: 'default',
    danger: true,
    onClick: (rows) => handleBatchOperation(rows, 'stop'),
    disabled: (rows) => rows.every((row) => row.status !== 'active'),
    confirm: '确定要批量停止营业吗？',
  },
];

// 处理单条记录操作
const handleOperation = async (record, action) => {
  try {
    if (action === 'start') {
      // 调用开始营业API
      await startOperation(record.id);
      message.success(`${record.name} 已开始营业`);
    } else if (action === 'stop') {
      // 调用停止营业API
      await stopOperation(record.id);
      message.success(`${record.name} 已停止营业`);
    }
    // 刷新数据
    dataTableRef.value.refresh();
  } catch (error) {
    message.error(`操作失败: ${error.message}`);
  }
};

// 处理批量操作
const handleBatchOperation = async (rows, action) => {
  try {
    for (const record of rows) {
      await handleOperation(record, action);
    }
    message.success(`批量操作成功，共处理${rows.length}条记录`);
    dataTableRef.value.clearSelection();
  } catch (error) {
    message.error(`批量操作失败: ${error.message}`);
  }
};

// 加载数据方法
const fetchData = async (params) => {
  loading.value = true;
  try {
    // 调用 API 获取数据
    const result = await api.getStoreList(params);
    return {
      data: result.data,
      total: result.total,
    };
  } catch (error) {
    console.error('获取数据失败', error);
    return { data: [], total: 0 };
  } finally {
    loading.value = false;
  }
};

// 处理搜索事件
const handleSearch = (searchParams) => {
  console.log('搜索参数:', searchParams);
};

// 处理选择变化事件
const handleSelectionChange = ({ keys, rows }) => {
  selectedRows.value = rows;
};

// 通过代码手动触发批量操作
const triggerBatchStart = () => {
  dataTableRef.value.executeBatchAction('开始营业');
};

// 清空选择
const clearAllSelection = () => {
  dataTableRef.value.clearSelection();
};
</script>
```

## 注意事项

1. `DataTable` 组件会在没有显式设置行 `id` 时，自动为每行数据生成唯一 ID。
2. 对于批量操作，确保在操作完成后调用 `clearSelection()` 方法清空选择状态。
3. 如需刷新表格数据，可以调用组件的 `refresh()` 方法。
4. 搜索表单的字段会根据列配置中 `searchable: true` 的列自动生成。
5. 批量操作按钮会根据选中的行数量和配置的 `minSelected` 属性自动启用或禁用。
6. 选择列默认固定在左侧，可以通过 `row-selection` 对象的 `fixed` 属性来控制。
7. 在表格有横向滚动时，建议将重要列使用 `fixed: 'left'` 固定在左侧，操作列使用 `fixed: 'right'` 固定在右侧。
