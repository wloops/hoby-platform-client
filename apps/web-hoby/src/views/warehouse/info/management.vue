<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-17 17:48:23
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-19 11:38:01
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\views\warehouse\info\management.vue
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

const pageTitle = $t('page.warehouse.myWarehouse.info');

// 表格列配置
const columns: ColumnConfig[] = [
  {
    title: '仓库',
    dataIndex: 'warehouse',
    visible: true,
    searchable: true,
    type: FieldType.STRING,
    width: 180,
  },
  {
    title: '是否店铺',
    dataIndex: 'isShop',
    visible: true,
    searchable: true,
    type: FieldType.SELECT,
    width: 120,
    options: [
      { label: '是', value: 1 },
      { label: '否', value: 0 },
    ],
  },
  {
    title: '区属',
    dataIndex: 'area',
    visible: true,
    searchable: true,
    type: FieldType.STRING,
    width: 120,
  },
  {
    title: '详细地址',
    dataIndex: 'address',
    visible: true,
    ellipsis: true,
    type: FieldType.STRING,
    width: 180,
  },
  {
    title: '联系人',
    dataIndex: 'contact',
    visible: true,
    type: FieldType.STRING,
    width: 120,
  },
  {
    title: '联系电话',
    dataIndex: 'phone',
    visible: true,
    type: FieldType.STRING,
    width: 120,
  },
  {
    title: '有效',
    dataIndex: 'valid',
    visible: true,
    searchable: true,
    type: FieldType.SELECT,
    width: 100,
    options: [
      { label: '是', value: 1 },
      { label: '否', value: 0 },
    ],
  },
];

// 表格数据和状态
const tableData = ref<TableItem[]>([]);
const total = ref<number>(0);
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const loading = ref<boolean>(false);

// 引用组件实例
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
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      data: [
        {
          id: 1,
          warehouse: '广州天润大厦仓',
          isShop: 1,
          area: '广东省广州市白云区',
          address: '白云大道北路1号',
          contact: '张三',
          phone: '13800138000',
          valid: 1,
        },
        {
          id: 2,
          warehouse: '广州天润大厦仓',
          isShop: 0,
          area: '广东省广州市白云区',
          address:
            '白云大道北路1号白云大道北路1号白云大道北路1号白云大道北路1号白云大道北路1号',
          contact: '李四',
          phone: '13800138001',
          valid: 0,
        },
      ],
      total: 2,
    };
  },
};

// 获取数据的方法
const fetchWarehouseData = async (params: SearchParams) => {
  try {
    loading.value = true;
    const result = await warehouseApi.getList(params);
    tableData.value = result.data;
    total.value = result.total;
    return result;
  } catch (error) {
    console.error('获取数据失败:', error);
    return {
      data: [],
      total: 0,
    };
  } finally {
    loading.value = false;
  }
};

// 处理搜索事件
const handleSearch = (formData: Record<string, any>) => {
  console.warn('搜索条件：', formData);
  fetchWarehouseData({
    ...formData,
    page: 1,
    pageSize: pageSize.value,
  });
};

// 处理分页变化
const handlePageChange = (pagination: PageChangeInfo) => {
  console.warn('分页变化：', pagination);
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
  <Page auto-content-height :title="pageTitle" class="warehouse-open-page">
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
.warehouse-open-page {
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
