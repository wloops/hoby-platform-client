<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-18 11:26:16
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-18 22:24:13
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\views\warehouse\private\management\type.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script lang="ts" setup>
import type {
  ColumnConfig,
  PageChangeInfo,
  SearchParams,
  SelectionChangeEvent,
  TableItem,
} from '#/components/DataTable/types';

import { ref } from 'vue';

import { Page } from '@vben/common-ui';
import { $t } from '@vben/locales';

import DataTable from '#/components/DataTable/index.vue';
import { FieldType } from '#/components/DataTable/types';
import { useMainGetData } from '#/composables';

const pageTitle = $t(
  'page.warehouse.myPrivateWarehouse.generalLedger.openWarehouse',
);

// 表格列配置
const columns: ColumnConfig[] = [
  {
    title: '仓库',
    dataIndex: 'saleCmpName',
    visible: true,
    searchable: true,
    type: FieldType.STRING,
    width: 180,
  },
  {
    title: '状态',
    dataIndex: 'status',
    visible: true,
    searchable: true,
    type: FieldType.SELECT,
    width: 100,
    enumName: 'warehouseStatus',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    visible: true,
    type: FieldType.OPERATION,
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
          // 实现查看逻辑
        },
      },
      {
        text: '编辑',
        type: 'link',
        onClick: (record) => {
          console.warn('编辑记录', record);
          // 实现编辑逻辑
        },
        // 只有正常状态的记录可编辑
        show: (record) => record.status === 1,
      },
      {
        text: '删除',
        type: 'link',
        danger: true,
        onClick: (record) => {
          console.warn('删除记录', record);
          // 实现删除逻辑
        },
        confirm: '确定要删除此仓库吗？',
        confirmTitle: '删除确认',
      },
      {
        text: '停用',
        type: 'link',
        onClick: (record) => {
          console.warn('停用仓库', record);
          // 实现停用逻辑
        },
        // 只有正常和缺货状态的仓库可以停用
        show: (record) => [1, 2].includes(record.status),
        // 添加权限控制示例
        // permission: 'warehouse:disable',
      },
    ],
  },
];

// 表格数据和状态
const tableData = ref<TableItem[]>([]);
const total = ref<number>(0);
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const loading = ref<boolean>(false);

// 引用组件实例并添加类型定义
const dataTableRef = ref<null | {
  clearSelection: () => void;
  getCurrentPage: () => number;
  getPageSize: () => number;
  getSearchParams: () => Record<string, any>;
  refresh: () => void;
  resetSearch: () => void;
  searchForm: Record<string, any>;
  selectedRowKeys: Array<number | string>;
  selectedRows: TableItem[];
  setSelection: (keys: Array<number | string>, rows: TableItem[]) => void;
}>(null);

// API服务（模拟）
const warehouseApi = {
  getList: async (_params: SearchParams) => {
    // 模拟API调用延迟
    // await new Promise((resolve) => setTimeout(resolve, 500));

    const params = {
      pageID: 'privateWareActivatedPage',
      pageDataGrpID: 'privateWareActivated',
      ..._params,
    };
    const { data, total } = await useMainGetData(params);
    return {
      data: data.value,
      total: total.value,
    };
  },
};

// 获取仓库数据的方法
const fetchWarehouseData = async (params: SearchParams) => {
  try {
    return await warehouseApi.getList(params);
  } catch (error) {
    console.error('获取仓库数据失败:', error);
    return {
      data: [],
      total: 0,
    };
  }
};

// 处理搜索事件
const handleSearch = (formData: Record<string, any>) => {
  console.warn('搜索条件：', formData);
};

// 处理分页变化
const handlePageChange = (pagination: PageChangeInfo) => {
  console.warn('分页变化：', pagination);
  // 获取选中数据示例
  if (dataTableRef.value) {
    const { selectedRows } = dataTableRef.value;
    console.warn('当前选中行：', selectedRows);
  }
};

// 处理选择变化
const handleSelectionChange = (event: SelectionChangeEvent) => {
  const { keys, rows } = event;
  console.warn('选中行变化：', keys, rows);
};

// 工具方法
function refreshTable() {
  if (dataTableRef.value) {
    dataTableRef.value.refresh();
  }
}

function getCurrentState() {
  if (dataTableRef.value) {
    const page = dataTableRef.value.getCurrentPage();
    const size = dataTableRef.value.getPageSize();
    const params = dataTableRef.value.getSearchParams();
    console.warn('当前状态：', { page, size, params });
  }
}

// 暴露给外部组件调用的方法
defineExpose({
  refreshTable,
  getCurrentState,
});
</script>

<template>
  <Page auto-content-height :title="pageTitle" class="warehouse-type-page">
    <!-- 使用v-model绑定方式 -->
    <DataTable
      ref="dataTableRef"
      :columns="columns"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      v-model:loading="loading"
      :data-source="tableData"
      :total="total"
      :fetch-data-func="fetchWarehouseData"
      :row-selection="true"
      row-key="id"
      @search="handleSearch"
      @page-change="handlePageChange"
      @selection-change="handleSelectionChange"
    />
  </Page>
</template>

<style scoped>
.warehouse-type-page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

:deep(.vben-page-content) {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
}
</style>
