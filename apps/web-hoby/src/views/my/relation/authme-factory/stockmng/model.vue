<script lang="ts" setup>
import type { CommonTableProps } from '#/components/CommonTable/types';

import { ref } from 'vue';

import CommonTable from '#/components/CommonTable/index.vue';

/**
 * @pageName 授权我的库存型号页面
 * @pageID authMeWarehouseModelPage
 * @remark HOBY仓商仓储仓库型号目录-仓商界面（hobyActSaleWarePrdSrl：1646）
 */
const tableProps = ref<CommonTableProps>({
  // 基础配置(必填) CommonTableParams
  params: {
    pageID: 'authMeWarehouseModelPage', // 页面ID
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
  enableBatchActions: true,
  // 批量操作按钮（可选）
  batchActions: [], // ActionButtonProps[]
  // 使用操作列中的按钮作为批量操作按钮（可选）
  useColumnActions: true,
  // 自定义请求方法（可选）
  // requestApi: customRequestFunction,
  // 展开子表（可选）
  // childTables: {}, // ChildTableProps

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
