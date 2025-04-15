<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-17 17:48:23
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-20 13:50:58
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\views\warehouse\private\general-ledger\service.vue
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
  'page.warehouse.myPrivateWarehouse.generalLedger.storageModel',
);

// 表格列配置
const columns: ColumnConfig[] = [
  {
    title: '仓商',
    dataIndex: 'saleCmpName',
    visible: true,
    searchable: true,
    type: FieldType.STRING,
    width: 120,
  },
  {
    title: '产品',
    dataIndex: 'productName',
    visible: true,
    searchable: true,
    type: FieldType.STRING,
    width: 150,
  },
  {
    title: '型号',
    dataIndex: 'srlID',
    visible: true,
    searchable: true,
    type: FieldType.STRING,
    width: 200,
  },
  {
    title: '库存总数',
    dataIndex: 'totalNum',
    visible: true,
    type: FieldType.NUMBER,
    width: 100,
  },
  {
    title: '可用数量',
    dataIndex: 'avaNum',
    visible: true,
    type: FieldType.NUMBER,
    width: 100,
  },
  {
    title: '锁住数量',
    dataIndex: 'lockedNum',
    visible: true,
    type: FieldType.NUMBER,
    width: 100,
  },
  {
    title: '报废数量',
    dataIndex: 'destoriedNum',
    visible: true,
    type: FieldType.NUMBER,
    width: 100,
  },
  {
    title: '有效期',
    dataIndex: 'validPeriod',
    visible: true,
    type: FieldType.STRING,
    width: 180,
  },
  {
    title: '状态',
    dataIndex: 'status',
    visible: true,
    searchable: true,
    type: FieldType.SELECT,
    width: 80,
    enumName: 'warehouseStatus',
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
const modelApi = {
  getList: async (_params: SearchParams) => {
    // 模拟API调用延迟
    // await new Promise((resolve) => setTimeout(resolve, 500));

    const params = {
      pageID: 'privateWareStoreSrlIDPage',
      pageDataGrpID: 'privateWareStoreSrlID',
      ..._params,
    };
    const { data, total } = await useMainGetData(params);
    return {
      data: data.value,
      total: total.value,
    };
  },
};

// 获取数据的方法
const fetchModelData = async (params: SearchParams) => {
  try {
    return await modelApi.getList(params);
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
  <Page auto-content-height :title="pageTitle" class="model-page">
    <DataTable
      ref="dataTableRef"
      :columns="columns"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      v-model:loading="loading"
      :data-source="tableData"
      :total="total"
      :fetch-data-func="fetchModelData"
      :row-selection="true"
      row-key="id"
      @search="handleSearch"
      @page-change="handlePageChange"
      @selection-change="handleSelectionChange"
    />
  </Page>
</template>

<style scoped>
.model-page {
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
