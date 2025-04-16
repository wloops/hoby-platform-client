<script lang="ts" setup>
import type { CommonTableProps } from '#/components/CommonTable/types';

import { ref } from 'vue';

import CommonTable from '#/components/CommonTable/index.vue';

/**
 * @pageName pageName=申请可复用履约保函页面
 * @pageID pageID=applyPerformanceGuaranteePage
 * @remark 视图=申请有效期内可复用履约保函界面（hobyActSalePlanPrdSKU：1640）
 */
const tableProps = ref<CommonTableProps>({
  // 基础配置(必填) CommonTableParams
  params: {
    pageID: 'applyPerformanceGuaranteePage', // 页面ID
    showAddButton: false, // 是否显示新增按钮
  },
  // 表格列配置(必填) ColumnDefinition[]
  columns: [
    {
      title: '操作',
      dataIndex: 'operation',
      visible: true,
      type: 'operation',
      defaultActions: ['view'], // 默认显示的按钮 : view 查看, edit 编辑, delete 删除
      width: 150,
      fixed: 'right',
      align: 'center',
      actions: [
        {
          text: '申请保函',
          type: 'link',
          danger: false,
          visible: true, // 控制按钮是否显示
          runMode: 'default',
          params: (record, user) => ({
            pageID: 'applyPerformanceGuaranteePage',
            pageButtonID: 'applyRenewalGuarantee',
            purchaseCompanyName: user?.TELLERCOMPANY,
            tellerNo: user?.tellerNo,
            ...record,
          }),
          fields: ['prdNo', 'actNo', 'saleCmpName', 'prdSrlID'],
          disabled: (record) => record && false, // 控制按钮是否禁用
          successMsg: '申请保函成功！',
          errorMsg: '申请保函失败！',
          confirm: '确认申请保函吗？',
          autoRefresh: true, // 默认为true，可省略
        },
      ],
    },
  ],
  // 页面按钮列表（可选）ActionButtonProps[]
  pageButtons: [],
  // 表格数据（可选）TableRecord[]
  tableData: [],
  // 是否展示搜索表单（可选）
  showSearch: true,
  // 是否自动刷新（可选）
  autoRefresh: false,
  // 是否展示复选框列（可选）
  showCheckbox: true,
  // 行唯一标识（可选）
  rowKey: 'id',
  // 最小选中数量（可选）
  minSelected: 1,
  // 是否启用批量操作（可选）
  enableBatchActions: false,
  // 批量操作按钮（可选）ActionButtonProps[]
  batchActions: [],
  // 使用操作列中的按钮作为批量操作按钮（可选）
  useColumnActions: true,
  // 自定义请求方法（可选）
  // requestApi: customRequestFunction,
  // 展开子表（可选）ChildTableProps
  // childTables: {},
  // 事件处理
  // 选中行变化事件（可选）
  onSelectionChange: (records, keys) => {
    console.warn('选中的记录:', records);
    console.warn('选中的键值:', keys);
  },
});

const tableRef = ref<null | {
  refresh: () => void;
}>(null);

// 刷新表格方法示例
// function refreshTable() {
//   tableRef.value?.refresh();
// }
</script>

<template>
  <CommonTable ref="tableRef" v-bind="tableProps" />
</template>
