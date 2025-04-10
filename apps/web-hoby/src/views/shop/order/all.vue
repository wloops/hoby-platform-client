<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-26 17:15:52
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-04-10 10:23:12
 * @FilePath:
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script lang="ts" setup>
import type {
  ChildTableProps,
  ColumnDefinition,
  TableRecord,
} from '#/components/CommonTable/types';

import { ref } from 'vue';

import CommonTable from '#/components/CommonTable/index.vue';

// 界面::卖方的全部销售订单页面
const pageParams = ref({
  pageID: 'sellerAllSaleOrderPage',
  showAddButton: false, // 控制是否显示新增按钮
});
// 定义表格列配置
const columns = ref<ColumnDefinition[]>([
  {
    title: '操作',
    dataIndex: 'action',
    visible: true,
    type: 'operation',
    defaultActions: ['view'], // 默认显示的按钮 : view 查看, edit 编辑, delete 删除
    // defaultActions: false,
    width: 100,
    fixed: 'right',
    align: 'center',
    actions: [
      {
        text: '示例按钮',
        type: 'link',
        danger: true,
        visible: false, // 控制按钮是否显示
        runMode: 'modal',
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
// 展开子表配置
const childTables = ref<ChildTableProps>({
  pageID: 'sellerWaitDistributionOrderPage',
  pageDataGrpID: 'selGoodsInformationByOrderID',
  // 子表列配置
  childTableColumns: [
    { field: 'companyName', title: '厂家' },
    { field: 'productName', title: '产品' },
    { field: 'srlID', title: '型号' },
    { field: 'wareAttrValueList', title: '库存规格' },
    { field: 'prdNum', title: '采购数量' },
    { field: 'prdUnitPrc', title: '单价' },
    { field: 'discount', title: '折扣' },
    { field: 'priceAfterDiscount', title: '折后单价' },
    { field: 'totalAmtAfterDiscount', title: '折后总价' },
  ],
  // 子表数据参数映射
  childTableParams: (row: any) => ({
    billNo: row.billNo,
  }),
  // 自定义加载子表数据的方法
  // loadChildTableData: async (row: any) => {
  // 这里实现加载子表数据的逻辑
  // 返回子表数据数组
  // return await yourApi.getChildTableData(row.id);
  // },
  // 子表数据转换方法（可选）
  // childTableDataTransform: (data: any) => {
  //   // 转换数据格式
  //   return data.map((item: any) => ({
  //     ...item,
  //     // 转换逻辑...
  //   }));
  // },});
});

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
    :child-tables="childTables"
    @selection-change="handleSelectionChange"
  />
</template>
