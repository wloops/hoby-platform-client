<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-18 11:26:16
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-20 10:24:50
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
  'page.warehouse.myPrivateWarehouse.management.warehouseSKU',
);
// 表格列配置
const columns: ColumnConfig[] = [
  {
    title: '仓库',
    dataIndex: 'wareName',
    visible: true,
    searchable: true,
    type: FieldType.STRING,
    width: 180,
  },
  {
    title: '类型',
    dataIndex: 'planCate',
    visible: true,
    searchable: true,
    type: FieldType.STRING,
    width: 140,
  },
  {
    title: '产品清单',
    dataIndex: 'productNameList',
    visible: true,
    searchable: false,
    type: FieldType.STRING,
    width: 140,
  },
  {
    title: '型号清单',
    dataIndex: 'prdSrlIDList',
    visible: true,
    searchable: false,
    type: FieldType.STRING,
    width: 100,
  },
  {
    title: '产品种类数量',
    dataIndex: 'prdCateNum',
    visible: true,
    searchable: false,
    type: FieldType.NUMBER,
    width: 100,
  },
  {
    title: '型号种类数量',
    dataIndex: 'srlIDNum',
    visible: true,
    searchable: false,
    type: FieldType.NUMBER,
    width: 100,
  },
  {
    title: '商品种类数量',
    dataIndex: 'orderDtINum',
    visible: true,
    searchable: false,
    type: FieldType.NUMBER,
    width: 100,
  },
  {
    title: '商品数量',
    dataIndex: 'prdNum',
    visible: true,
    searchable: false,
    type: FieldType.NUMBER,
    width: 100,
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
    const params = {
      pageID: 'privateWarehouseMngBatchPage',
      pageDataGrpID: 'privateWarehouseMngBatch',
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

// 工具方法 - 将它们声明为函数但不直接调用，避免ESLint警告
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
  <Page auto-content-height :title="pageTitle">
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

<style scoped></style>
