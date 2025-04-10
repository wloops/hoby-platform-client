<script lang="ts" setup>
import type { CommonTableProps } from '#/components/CommonTable/types';

import { ref } from 'vue';

import CommonTable from '#/components/CommonTable/index.vue';

/**
 * @pageName 我的企业员工操作账号页面
 * @pageID myCompanyEmployeeTellNoPage
 * @remark
 */
const tableProps = ref<CommonTableProps>({
  // 基础配置(必填) CommonTableParams
  params: {
    pageID: 'myCompanyEmployeeTellNoPage',
    showAddButton: false,
  },
  // 表格列配置(必填) ColumnDefinition[]
  columns: [
    {
      title: '操作',
      dataIndex: 'operation',
      visible: true,
      type: 'operation',
      defaultActions: ['view'],
      actionColumnProps: {
        width: 200,
        fixed: 'right',
        align: 'center',
      },
      actions: [
        {
          text: '修改密码',
          type: 'link',
          danger: true,
          visible: true,
          batchable: false,
          runMode: 'modal',
          schema: [
            {
              fieldName: 'tellerNo',
              displayName: '操作账号',
              useType: 'readOnly',
              value: '',
            },
            {
              fieldName: 'oldPinCiperUnderOriKey',
              displayName: '旧密码',
              useType: 'passwordEncBypk',
              value: '',
              valueConstraint: 'notnull',
              isPrimaryKey: false,
            },
            {
              fieldName: 'cipherText',
              displayName: '新密码',
              useType: 'passwordEncBypk',
              value: '',
              valueConstraint: 'notnull',
              isPrimaryKey: false,
            },
          ],
          params: (record) => ({
            pageID: 'myCompanyEmployeeTellNoPage',
            pageButtonID: 'modifyLoginAccountPassword',
            ...record,
          }),
          disabled: (record) => record && false,
          successMsg: '示例成功提示',
          errorMsg: '示例失败提示',
          confirm: 'auto',
          autoRefresh: true,
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
