# DataTable 组件

DataTable 是一个功能完整的数据表格组件，支持搜索、排序、分页、选择行、自定义列渲染及操作按钮等功能。

## 特性

- 自动生成搜索表单
- 支持分页和数据加载
- 支持列排序和筛选
- 支持行选择
- 支持自定义渲染列内容
- 支持操作按钮配置（查看、编辑、删除等）
- 支持条件显示和权限控制
- 支持确认对话框
- 支持 SELECT 类型的自动值转换（数据值和显示值分离）
- **支持单元格编辑功能（新增）**
- **支持日期和时间类型编辑（新增）**

## 基本用法

```vue
<template>
  <DataTable
    :columns="columns"
    :data-source="tableData"
    :total="total"
    :fetch-data-func="fetchData"
    row-key="id"
    @search="handleSearch"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DataTable from '#/components/DataTable/index.vue';
import { FieldType } from '#/components/DataTable/types';

// 列定义
const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    visible: true,
    searchable: true,
    type: FieldType.STRING,
    width: 200,
  },
  {
    title: '状态',
    dataIndex: 'status',
    visible: true,
    searchable: true,
    type: FieldType.SELECT,
    width: 100,
    options: [
      { label: '正常', value: 1 },
      { label: '禁用', value: 2 },
    ],
  },
  {
    title: '操作',
    dataIndex: 'operation',
    visible: true,
    actionColumnProps: {
      width: 200,
      fixed: 'right',
      align: 'center',
    },
    actions: [
      {
        text: '查看',
        type: 'link',
        onClick: (record) => {
          console.warn('查看详情', record);
        },
      },
      {
        text: '编辑',
        type: 'link',
        onClick: (record) => {
          console.warn('编辑记录', record);
        },
        // 条件显示
        show: (record) => record.status === 1,
      },
      {
        text: '删除',
        type: 'link',
        danger: true,
        onClick: (record) => {
          console.warn('删除记录', record);
        },
        confirm: '确定要删除此记录吗？',
        confirmTitle: '删除确认',
      },
    ],
  },
];

// 表格数据和状态
const tableData = ref([]);
const total = ref(0);

// 获取数据的方法
const fetchData = async (params) => {
  try {
    const res = await api.getList(params);
    return {
      data: res.list,
      total: res.total,
    };
  } catch (error) {
    console.error('获取数据失败:', error);
    return { data: [], total: 0 };
  }
};

// 处理搜索事件
const handleSearch = (formData) => {
  console.warn('搜索条件：', formData);
};
</script>
```

## 单元格编辑功能（新增）

DataTable 组件现在支持单元格编辑功能，可以直接在表格中编辑数据。

```vue
<template>
  <DataTable
    :columns="columns"
    :data-source="tableData"
    :fetch-data-func="fetchData"
    @cellSave="handleCellSave"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DataTable from '#/components/DataTable/index.vue';
import { FieldType } from '#/components/DataTable/types';

// 列定义（包含可编辑列）
const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    visible: true,
    type: FieldType.STRING,
    editable: true, // 设置为可编辑
    editConfig: {
      type: 'input', // 编辑器类型
      rules: [{ required: true, message: '名称不能为空' }], // 校验规则
    },
  },
  {
    title: '价格',
    dataIndex: 'price',
    visible: true,
    type: FieldType.NUMBER,
    editable: true,
    editConfig: {
      type: 'number',
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    visible: true,
    type: FieldType.SELECT,
    editable: true,
    editConfig: {
      type: 'select',
      options: [
        { label: '正常', value: 1 },
        { label: '禁用', value: 2 },
      ],
    },
    options: [
      { label: '正常', value: 1 },
      { label: '禁用', value: 2 },
    ],
  },
  {
    title: '创建日期',
    dataIndex: 'createdAt',
    visible: true,
    type: FieldType.DATE,
    editable: true,
    editConfig: {
      type: 'date',
    },
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    visible: true,
    type: FieldType.DATETIME,
    editable: true,
    editConfig: {
      type: 'datetime',
    },
  },
];

// 处理单元格保存事件
const handleCellSave = async ({ record, column, value }) => {
  try {
    // 调用API保存数据
    await api.updateItem(record.id, { [column.dataIndex]: value });
    message.success('更新成功');
  } catch (error) {
    message.error('更新失败');
  }
};
</script>
```

## API

### Props

| 属性名           | 说明                 | 类型                | 默认值       |
| ---------------- | -------------------- | ------------------- | ------------ |
| columns          | 表格列的配置         | `ColumnConfig[]`    | 必填         |
| dataSource       | 数据源               | `TableItem[]`       | `[]`         |
| currentPage      | 当前页数             | `number`            | `1`          |
| pageSize         | 每页条数             | `number`            | `10`         |
| total            | 总记录数             | `number`            | `0`          |
| loading          | 加载状态             | `boolean`           | `false`      |
| fetchDataFunc    | 获取数据的函数       | `Function`          | -            |
| rowKey           | 表格行的唯一标识字段 | `string`            | `'id'`       |
| rowSelection     | 是否显示复选框       | `boolean \| object` | `false`      |
| showSearch       | 是否显示搜索面板     | `boolean`           | `true`       |
| showPagination   | 是否显示分页         | `boolean`           | `true`       |
| emptyText        | 空数据提示文本       | `string`            | `'暂无数据'` |
| searchButtonText | 搜索按钮文本         | `string`            | `'搜索'`     |
| resetButtonText  | 重置按钮文本         | `string`            | `'重置'`     |

### Events

| 事件名称 | 说明 | 回调参数 |
| --- | --- | --- |
| search | 搜索按钮点击触发 | `formData: object` |
| reset | 重置按钮点击触发 | - |
| pageChange | 分页变化触发 | `{ current, pageSize, filters, sorter }` |
| rowClick | 点击行触发 | `record: object` |
| selectionChange | 选择项变化触发 | `{ keys: (string\|number)[], rows: object[] }` |
| update:currentPage | 更新当前页码 | `pageNumber: number` |
| update:pageSize | 更新每页条数 | `size: number` |
| update:loading | 更新加载状态 | `loading: boolean` |
| cellSave | 单元格保存时触发 | `{ record, column, value }` |

### Methods

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| refresh | 刷新表格数据 | - |
| clearSelection | 清除选择 | - |
| resetSearch | 重置搜索条件 | - |
| getCurrentPage | 获取当前页数 | - |
| getPageSize | 获取每页条数 | - |
| getSearchParams | 获取搜索参数 | - |
| setSelection | 设置选中项 | `(keys: (string\|number)[], rows: object[])` |

## 类型定义

### ColumnConfig

```typescript
interface ColumnConfig {
  title: string; // 列标题
  dataIndex: string; // 数据字段名
  visible: boolean; // 是否显示
  searchable?: boolean; // 是否可搜索
  type: FieldType; // 字段类型
  width?: number; // 列宽度
  fixed?: 'left' | 'right' | boolean; // 是否固定列
  align?: 'left' | 'center' | 'right'; // 对齐方式
  ellipsis?: boolean; // 是否显示省略号
  options?: SelectOption[]; // 下拉选项
  render?: (text: any, record: TableItem, index: number) => VNodeChild; // 自定义渲染函数
  actions?: ActionButton[]; // 操作按钮配置
  actionColumnProps?: {
    // 操作列属性
    width?: number | string;
    fixed?: 'left' | 'right' | boolean;
    align?: 'left' | 'center' | 'right';
    title?: string;
  };
  editable?: ((record: TableItem) => boolean) | boolean; // 是否可编辑或根据记录动态决定
  editConfig?: EditableCellConfig; // 编辑配置
}
```

### EditableCellConfig（新增）

```typescript
interface EditableCellConfig {
  editable?: boolean; // 是否可编辑
  type?: 'input' | 'number' | 'select' | 'date' | 'datetime'; // 编辑器类型
  options?: SelectOptionType[]; // 如果是select类型，提供选项
  rules?: any[]; // 校验规则
  onSave?: (record: TableItem, value: any) => Promise<void> | void; // 保存回调
}
```

### FieldType

```typescript
enum FieldType {
  CHECKBOX = 'checkbox', // 复选框
  DATE = 'date', // 日期
  DATETIME = 'datetime', // 日期时间
  NUMBER = 'number', // 数字
  OPERATION = 'operation', // 操作
  SELECT = 'select', // 下拉选择
  STRING = 'string', // 字符串
  SWITCH = 'switch', // 开关
}
```

### ActionButton

```typescript
interface ActionButton {
  text: string; // 按钮文本
  type?: 'default' | 'primary' | 'ghost' | 'dashed' | 'link' | 'text'; // 按钮类型
  danger?: boolean; // 是否危险按钮
  icon?: string; // 图标名称
  onClick: (record: TableItem) => void; // 点击事件
  show?: (record: TableItem) => boolean; // 条件显示
  disabled?: (record: TableItem) => boolean; // 条件禁用
  confirm?: string; // 确认提示文本
  confirmTitle?: string; // 确认对话框标题
  permission?: string; // 权限控制
}
```

### SelectOption

```typescript
interface SelectOption {
  label: string; // 显示文本
  value: number | string; // 实际值
}
```

## 注意事项

1. **单元格编辑功能**：

   - 点击单元格右侧的编辑图标可进入编辑模式
   - 支持的编辑器类型：input（文本）、number（数字）、select（下拉选择）、date（日期）、datetime（日期时间）
   - 可以配置校验规则和保存回调
   - 编辑时按回车或点击确认图标可保存，点击外部区域也会自动保存

2. **SELECT 类型字段**：

   - 自动处理值和显示文本的转换
   - 表格中显示 options 中定义的标签文本
   - 搜索框中显示下拉选择框

3. **DATE 和 DATETIME 类型字段**：

   - DATE 类型显示为 YYYY-MM-DD 格式
   - DATETIME 类型显示为 YYYY-MM-DD HH:mm:ss 格式
   - 编辑时使用对应的日期选择器组件

4. **操作按钮**：

   - `show` 函数可控制按钮是否显示
   - `confirm` 属性设置后点击会出现确认对话框
   - `danger` 设为 true 会显示为红色
   - `permission` 属性可用于权限控制（需自行实现权限检查逻辑）

5. **数据获取**：

   - `fetchDataFunc` 需要返回 `{ data: any[], total: number }` 格式的数据
   - 搜索、分页变化时会自动调用此函数
   - 组件内部会自动处理加载状态

6. **双向绑定**：
   - 组件支持通过 v-model 绑定 currentPage、pageSize 和 loading
   - 例如: `v-model:current-page="currentPage"`
