<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-04-07 11:48:04
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-04-09 16:30:38
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\components\CommonTable\README.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

# CommonTable 组件文档

## 组件简介

CommonTable 是一个功能丰富的表格组件，提供了高度可定制的表格展示、搜索、排序、批量操作和动态表单集成等功能。该组件旨在简化表格操作，提高开发效率，使开发人员能够快速构建具有复杂功能的数据表格界面。

## 功能特点

- 支持自定义表格列配置
- 内置搜索表单功能
- 支持自定义数据请求方法
- 支持单行和批量操作
- 集成动态表单，支持抽屉或模态框形式
- 支持表格数据自动刷新
- 支持复选框选择功能
- 自适应列宽和表格布局
- 按钮支持自定义 schema 配置,可用于动态表单渲染

## 属性说明

| 属性名 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| columns | ColumnDefinition[] | [] | 是 | 表格列配置，定义表格的列结构和功能 |
| tableData | TableRecord[] | [] | 否 | 表格数据，若提供则直接使用，否则通过requestApi获取 |
| autoRefresh | Boolean | false | 否 | 是否启用表格数据自动刷新功能 |
| showSearch | Boolean | true | 否 | 是否显示搜索表单 |
| requestApi | Function | null | 否 | 自定义数据请求方法，需返回包含list和total的对象 |
| showCheckbox | Boolean | true | 否 | 是否显示复选框列 |
| rowKey | String | 'id' | 否 | 行数据的唯一标识字段 |
| batchActions | ActionButtonProps[] | [] | 否 | 批量操作按钮配置 |
| minSelected | Number | 1 | 否 | 批量操作最小选择数量 |
| enableBatchActions | Boolean | true | 否 | 是否启用批量操作功能 |
| useColumnActions | Boolean | true | 否 | 是否使用操作列中的按钮作为批量操作 |
| params | Object | {} | 否 | 附加参数，会传递给requestApi |

## 列定义（ColumnDefinition）

表格列可以通过以下属性进行详细配置：

```ts
interface ColumnDefinition {
  title: string; // 列标题
  dataIndex: string; // 数据字段名
  visible: boolean; // 是否可见
  searchable?: boolean; // 是否支持搜索
  type: FieldType | string; // 数据类型
  width?: number; // 列宽度
  fixed?: 'left' | 'right' | boolean; // 固定列位置
  align?: 'center' | 'left' | 'right'; // 对齐方式
  ellipsis?: boolean; // 是否启用省略
  enumName?: string; // 枚举类型名称
  options?: SelectOption[]; // 下拉选项
  render?: (text: any, record: TableRecord, index: number) => any; // 自定义渲染函数
  actions?: ActionButtonProps[]; // 操作按钮配置
  actionColumnProps?: ActionColumnProps; // 操作列配置
  defaultActions?: boolean | string[]; // true表示全部显示，字符串数组表示显示指定的按钮，false表示不显示默认按钮
  editable?: ((record: TableRecord) => boolean) | boolean; // 是否可编辑
  editConfig?: any; // 如果需要使用原有的 EditableCellConfig
}
```

## 操作按钮配置（ActionButtonProps）

用于定义操作列中的按钮，支持以下属性：

```ts
interface ActionButtonProps {
  // 按钮文字
  text?: string;
  // 按钮标签（优先于text）
  label?: string;
  // 按钮类型
  type?: VxeButtonType;
  // 是否危险操作
  danger?: boolean;
  // 按钮唯一标识
  key?: string;
  // 按钮名称
  name?: string;
  // 按钮是否禁用 - 修改为只处理单条记录
  disabled?: ((record: any) => boolean) | boolean;
  // 按钮是否可见 - 修改为只处理单条记录
  visible?: ((record: any) => boolean) | boolean;
  // 点击回调 - 修改为只处理单条记录
  onClick?: AnyFunction;
  // 是否需要确认
  confirm?: 'auto' | boolean | string;
  // 操作后是否清除选择
  clearAfterAction?: boolean;
  autoRefresh?: boolean; // 点击后是否自动刷新表格，默认为true
  // 自定义域列表
  schema?: CustomSchemaList[];
  // 新增 API 相关属性
  api?: (params: any) => Promise<any>; // API 调用函数
  params?: ((record: any) => any) | Record<string, any>; // 单条记录参数
  batchParams?: (records: any[]) => any; // 批量操作参数
  fields?: string[]; // 要从记录中提取的字段
  successMsg?: string; // 成功提示消息
  errorMsg?: string; // 错误提示消息

  // 按钮执行模式
  runMode?: 'default' | 'drawer' | 'modal' | 'route'; // 默认不传为直接执行，drawer为弹抽屉执行，modal为弹窗执行，route为跳转执行
  // 添加批量操作相关属性
  batchable?: boolean; // 是否支持批量操作，默认为false
  batchConfirm?: string; // 批量操作确认提示文本
}
```

### Schema 配置说明

- `schema`: 数组类型，定义表单字段结构
  - `fieldName`: 字段名称
  - `displayName`: 显示名称
  - `useType`: 字段类型（input、select、datepicker、readOnly等）
  - `value`: 默认值
  - `valueConstraint`: 值约束（notnull等）
  - `isPrimaryKey`: 是否为主键

### 其他按钮属性

- `runMode`: 运行模式，支持 'modal'(对话框) 或 'drawer'(抽屉)
- `visible`: 控制按钮是否显示，可以是布尔值或函数
- `disabled`: 控制按钮是否禁用，可以是布尔值或函数
- `confirm`: 确认提示，'auto'为自动生成，也可以自定义文本
- `autoRefresh`: 操作完成后是否自动刷新表格
- `successMsg`/`errorMsg`: 操作成功/失败的提示信息

## 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| open-dynamic-form | 打开动态表单 | { buttonTitle, mode, pageButtonID, pageID, record, type } |

## 方法

通过ref引用组件实例，可以调用以下方法：| 方法名 | 说明 | 参数 | |-------|------|------| | refresh | 刷新表格数据 | - | | openDynamicForm | 打开动态表单 | { buttonTitle, mode, pageButtonID, pageID, record, type } |

## 使用示例

```vue
<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-26 17:15:52
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-04-03 16:09:02
 * @FilePath: \Example.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script lang="ts" setup>
import type {
  ColumnDefinition,
  TableRecord,
} from '#/components/CommonTable/types';

import { ref } from 'vue';

import CommonTable from '#/components/CommonTable/index.vue';

const pageParams = ref({
  pageID: 'myCompanyAddressPage',
  showAddButton: false, // 控制是否显示新增按钮
  // onAdd: () => {
  //   // 自定义新增处理逻辑
  //   console.warn('新增');
  // },
});
// 定义表格列配置
const columns = ref<ColumnDefinition[]>([
  {
    title: '操作',
    dataIndex: 'action',
    visible: true,
    type: 'operation',
    defaultActions: ['view', 'edit', 'delete'], // 默认显示的按钮 : view 查看, edit 编辑, delete 删除
    // defaultActions: false,
    actionColumnProps: {
      width: 200,
      fixed: 'right',
      align: 'center',
    },
    actions: [
      {
        text: '示例按钮',
        type: 'link',
        danger: true,
        visible: false, // 控制按钮是否显示
        runMode: 'modal',
        // schema: [
        //   {
        //     fieldName: 'id',
        //     displayName: '自定义示例动态表单',
        //     useType: 'input',
        //     value: '',
        //     valueConstraint: 'notnull',
        //     isPrimaryKey: false,
        //   },
        // ],
        params: (record) => ({
          pageID: '示例页面ID',
          pageButtonID: '示例按钮ID',
          ...record,
        }),
        disabled: (record) => record && false, // 控制按钮是否禁用
        successMsg: '示例成功提示',
        errorMsg: '示例失败提示',
        confirm: 'auto',
        autoRefresh: true, // 默认为true，可省略
      },
    ],
  },
]);

// 表格数据
const tableData = ref([]);
// 自定义请求方法示例 :request-api="customRequest"
// const customRequest = async (formValues: any) => {
//   console.warn('表单值:', formValues);

//   // 这里可以进行实际的API调用
//   // const res = await api.getList(page, formValues);
//   const params = {
//     pageID: 'myBranchWareShopPage',
//     pageDataGrpID: 'myBranchWareShop',
//     ...formValues,
//   };
//   const { data, total } = await useMainGetData(params);
//   return {
//     items: data.value,
//     total: total.value,
//   };
// };

// 选中的记录
const selectedRows = ref<TableRecord[]>([]);

// 处理选择变化
const handleSelectionChange = ({
  records,
  keys,
}: {
  keys: string[];
  records: TableRecord[];
}) => {
  console.warn('选中的记录:', records);
  console.warn('选中的键值:', keys);
  selectedRows.value = records;
};

const tableRef = ref<null | {
  refresh: () => void;
}>(null);

// // 刷新表格方法示例
// function refreshTable() {
//   tableRef.value?.refresh();
// }

// 批量操作按钮示例
// const batchActions = [
//   {
//     text: '批量审核',
//     params: {
//       pageID: 'batchApprove',
//       pageButtonID: 'batchApprove',
//     },
//     confirm: '确定要批量审核选中的记录吗？',
//     successMsg: '批量审核成功',
//     errorMsg: '批量审核失败',
//   },
// ];
</script>

<template>
  <CommonTable
    ref="tableRef"
    :params="pageParams"
    :columns="columns"
    :table-data="tableData"
    :show-search="true"
    @selection-change="handleSelectionChange"
  />
</template>
```

## 注意事项 - 确保为表格行提供唯一的rowKey属性，默认为'id' -

使用动态表单需要同时引入DynamicForm组件 - 自定义请求方法(requestApi)必须返回包含list和total的对象 - 列定义中的dataIndex必须与返回数据中的字段名保持一致 ## 最佳实践 - 为提高性能，合理使用fixed属性固定列 - 仅对需要搜索的字段设置search: true - 使用formatter简化数据展示逻辑 - 为复杂的内容展示使用render函数 - 在处理大量数据时建议开启分页和懒加载

```

```
