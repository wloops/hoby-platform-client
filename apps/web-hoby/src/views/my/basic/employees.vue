<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-26 17:15:52
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-04-09 21:04:05
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\views\buyer\settlement.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script lang="ts" setup>
import type {
  ActionButtonProps,
  ColumnDefinition,
  TableRecord,
} from '#/components/CommonTable/types';

import { ref } from 'vue';

import CommonTable from '#/components/CommonTable/index.vue';

const pageParams = ref({
  pageID: 'myCompanyEmployeePage',
  showAddButton: true, // 控制是否显示新增按钮
  // onAdd: () => {
  //   // 自定义新增处理逻辑
  //   console.warn('新增');
  // },
});
const pageButtons: ActionButtonProps[] = [
  {
    key: 'import',
    text: '新增员工',
    runMode: 'modal',
    schema: [
      {
        fieldName: 'tellerName',
        displayName: '姓名',
        useType: 'input',
        value: '',
      },
      {
        fieldName: 'mobile',
        displayName: '手机',
        useType: 'input',
        value: '',
        default: '13378999344',
      },
      {
        fieldName: 'tellerNo',
        displayName: '登录账号',
        useType: 'input',
        value: '',
      },
      {
        fieldName: 'cipherText',
        displayName: '登录密码',
        useType: 'passwordEncBypk',
        value: '',
        valueConstraint: 'notnull',
      },
      {
        fieldName: 'roleID',
        displayName: '固定参数',
        default: '小微企业超级用户',
        value: '',
        visible: true,
      },
      {
        fieldName: 'instCateID',
        displayName: '固定参数',
        default: '小微企业客户',
        value: '',
        visible: true,
      },
      // {
      //   fieldName: 'companyName',
      //   displayName: '固定取值',
      //   value: 'active.tellerCompanyName',
      //   visible: true,
      // },
    ],
    params: {
      pageID: 'myCompanyEmployeePage',
      pageButtonID: 'createEmployeeAndAccount',
    },
  },
  // {
  //   key: 'export',
  //   label: '导出',
  //   icon: 'icon-[mdi--download]',
  //   disabled: (params: any) => params.selectedRecords.length === 0,
  //   onClick: (params: any) => {
  //     console.warn('页面按钮自定义点击逻辑', params);
  //   },
  // },
];
// 定义表格列配置
const columns = ref<ColumnDefinition[]>([
  {
    title: '操作',
    dataIndex: 'action',
    visible: true,
    type: 'operation',
    defaultActions: ['view', 'edit', 'delete'],
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
    :page-buttons="pageButtons"
    :columns="columns"
    :table-data="tableData"
    :show-search="true"
    @selection-change="handleSelectionChange"
  />
</template>
