<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-18 11:26:16
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-18 14:37:22
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

// 表格列配置
const columns: ColumnConfig[] = [
  {
    title: '仓库',
    dataIndex: 'warehouseName',
    visible: true,
    searchable: true,
    type: FieldType.STRING,
    width: 180,
  },
  {
    title: '产品',
    dataIndex: 'product',
    visible: true,
    searchable: true,
    type: FieldType.STRING,
    width: 140,
  },
  {
    title: '型号',
    dataIndex: 'model',
    visible: true,
    searchable: true,
    type: FieldType.STRING,
    width: 140,
  },
  {
    title: '库存总数',
    dataIndex: 'totalStock',
    visible: true,
    searchable: false,
    type: FieldType.NUMBER,
    width: 100,
  },
  {
    title: '可用数量',
    dataIndex: 'availableQuantity',
    visible: true,
    searchable: false,
    type: FieldType.NUMBER,
    width: 100,
  },
  {
    title: '锁住数量',
    dataIndex: 'lockedQuantity',
    visible: true,
    searchable: false,
    type: FieldType.NUMBER,
    width: 100,
  },
  {
    title: '报废数量',
    dataIndex: 'reportedQuantity',
    visible: true,
    searchable: false,
    type: FieldType.NUMBER,
    width: 100,
  },
  {
    title: '状态',
    dataIndex: 'status',
    visible: true,
    searchable: true,
    type: FieldType.SELECT,
    width: 100,
    options: [
      { label: '正常', value: '正常' },
      { label: '缺货', value: '缺货' },
      { label: '停用', value: '停用' },
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
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      data: [
        {
          id: 1,
          warehouseName: '科学城科创大厦店仓库',
          product: '男士T恤衫',
          model: '酷炫火箭衫',
          totalStock: 2100,
          availableQuantity: 2100,
          lockedQuantity: 0,
          reportedQuantity: 0,
          status: '正常',
        },
        {
          id: 2,
          warehouseName: '科学城科创大厦店仓库',
          product: '男士T恤衫',
          model: '圆领文化衫',
          totalStock: 2200,
          availableQuantity: 2200,
          lockedQuantity: 0,
          reportedQuantity: 0,
          status: '正常',
        },
        {
          id: 3,
          warehouseName: '科学城科创大厦店仓库',
          product: '男士T恤衫',
          model: '圆领文化衫',
          totalStock: 2200,
          availableQuantity: 2200,
          lockedQuantity: 0,
          reportedQuantity: 0,
          status: '正常',
        },
        {
          id: 4,
          warehouseName: '科学城科创大厦店仓库',
          product: '男士T恤衫',
          model: '圆领文化衫',
          totalStock: 2200,
          availableQuantity: 2200,
          lockedQuantity: 0,
          reportedQuantity: 0,
          status: '正常',
        },
        {
          id: 5,
          warehouseName: '科学城科创大厦店仓库',
          product: '男士T恤衫',
          model: '圆领文化衫',
          totalStock: 2200,
          availableQuantity: 2200,
          lockedQuantity: 0,
          reportedQuantity: 0,
          status: '正常',
        },
        {
          id: 6,
          warehouseName: '科学城科创大厦店仓库',
          product: '男士T恤衫',
          model: '圆领文化衫',
          totalStock: 2200,
          availableQuantity: 2200,
          lockedQuantity: 0,
          reportedQuantity: 0,
          status: '正常',
        },
        {
          id: 7,
          warehouseName: '科学城科创大厦店仓库',
          product: '男士T恤衫',
          model: '圆领文化衫',
          totalStock: 2200,
          availableQuantity: 2200,
          lockedQuantity: 0,
          reportedQuantity: 0,
          status: '正常',
        },
        {
          id: 8,
          warehouseName: '科学城科创大厦店仓库',
          product: '男士T恤衫',
          model: '圆领文化衫',
          totalStock: 2200,
          availableQuantity: 2200,
          lockedQuantity: 0,
          reportedQuantity: 0,
          status: '正常',
        },
        {
          id: 9,
          warehouseName: '科学城科创大厦店仓库',
          product: '男士T恤衫',
          model: '圆领文化衫',
          totalStock: 2200,
          availableQuantity: 2200,
          lockedQuantity: 0,
          reportedQuantity: 0,
          status: '正常',
        },
        {
          id: 10,
          warehouseName: '科学城科创大厦店仓库',
          product: '男士T恤衫',
          model: '圆领文化衫',
          totalStock: 2200,
          availableQuantity: 2200,
          lockedQuantity: 0,
          reportedQuantity: 0,
          status: '正常',
        },
        {
          id: 11,
          warehouseName: '科学城科创大厦店仓库',
          product: '男士T恤衫',
          model: '圆领文化衫',
          totalStock: 2200,
          availableQuantity: 2200,
          lockedQuantity: 0,
          reportedQuantity: 0,
          status: '正常',
        },
        {
          id: 12,
          warehouseName: '科学城科创大厦店仓库',
          product: '男士T恤衫',
          model: '圆领文化衫',
          totalStock: 2200,
          availableQuantity: 2200,
          lockedQuantity: 0,
          reportedQuantity: 0,
          status: '正常',
        },
        {
          id: 13,
          warehouseName: '科学城科创大厦店仓库',
          product: '男士T恤衫',
          model: '圆领文化衫',
          totalStock: 2200,
          availableQuantity: 2200,
          lockedQuantity: 0,
          reportedQuantity: 0,
          status: '正常',
        },
        {
          id: 14,
          warehouseName: '科学城科创大厦店仓库',
          product: '男士T恤衫',
          model: '圆领文化衫',
          totalStock: 2200,
          availableQuantity: 2200,
          lockedQuantity: 0,
          reportedQuantity: 0,
          status: '正常',
        },
        {
          id: 15,
          warehouseName: '科学城科创大厦店仓库',
          product: '男士T恤衫',
          model: '圆领文化衫',
          totalStock: 2200,
          availableQuantity: 2200,
          lockedQuantity: 0,
          reportedQuantity: 0,
          status: '正常',
        },
        {
          id: 16,
          warehouseName: '科学城科创大厦店仓库',
          product: '男士T恤衫',
          model: '圆领文化衫',
          totalStock: 2200,
          availableQuantity: 2200,
          lockedQuantity: 0,
          reportedQuantity: 0,
          status: '正常',
        },
        {
          id: 17,
          warehouseName: '科学城科创大厦店仓库',
          product: '男士T恤衫',
          model: '圆领文化衫',
          totalStock: 2200,
          availableQuantity: 2200,
          lockedQuantity: 0,
          reportedQuantity: 0,
          status: '正常',
        },
        {
          id: 18,
          warehouseName: '科学城科创大厦店仓库',
          product: '男士T恤衫',
          model: '圆领文化衫',
          totalStock: 2200,
          availableQuantity: 2200,
          lockedQuantity: 0,
          reportedQuantity: 0,
          status: '不正常',
        },
      ],
      total: 19,
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
  <Page
    auto-content-height
    :title="$t('page.warehouse.myPrivateWarehouse.management.warehouseType')"
    class="warehouse-type-page"
  >
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
