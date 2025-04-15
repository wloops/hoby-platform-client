<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-26 17:15:52
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-04-03 21:38:10
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\views\buyer\settlement.vue
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
  pageID: 'privateWareActivatedPage',
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
    // defaultActions: ['view', 'edit', 'delete'],
    defaultActions: false,
    actionColumnProps: {
      width: 200,
      fixed: 'right',
      align: 'center',
    },
    actions: [
      {
        text: '建立仓储目录',
        type: 'link',
        danger: false,
        visible: true, // 控制按钮是否显示
        runMode: 'modal', //
        batchable: false,
        params: (record) => ({
          pageID: 'hobySelPrivcateWareSrlDir',
          pageButtonID: 'createWareSKUDir',
          ...record,
        }),
        disabled: (record) => record && false, // 控制按钮是否禁用
        successMsg: '建立仓储目录成功',
        errorMsg: '建立仓储目录失败',
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
