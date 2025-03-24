<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-18 11:26:16
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-24 12:04:01
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\views\shop\branch\sku.vue
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
import { useMainGetData, useServiceCall } from '#/composables';

const pageTitle = $t('page.shop.myBranchWarehouse.sku');

// 表格列配置
const columns: ColumnConfig[] = [
  {
    title: '授权厂商',
    dataIndex: 'actCmpName',
    visible: true,
    searchable: true,
    type: FieldType.STRING,
    width: 180,
  },
  {
    title: '仓库',
    dataIndex: 'wareName',
    visible: true,
    searchable: true,
    type: FieldType.STRING,
    width: 180,
  },
  {
    title: '产品',
    dataIndex: 'productName',
    visible: true,
    searchable: true,
    type: FieldType.STRING,
    width: 180,
  },
  {
    title: '型号',
    dataIndex: 'srlID',
    visible: true,
    searchable: true,
    type: FieldType.STRING,
    width: 180,
  },
  {
    title: '库存规格',
    dataIndex: 'wareAttrValueList',
    visible: true,
    searchable: true,
    type: FieldType.STRING,
    width: 180,
  },
  {
    title: '在售',
    dataIndex: 'onCateStatus',
    visible: true,
    searchable: true,
    type: FieldType.SELECT,
    width: 180,
    enumName: 'boolean',
  },
  {
    title: '库存总数',
    dataIndex: 'totalNum',
    visible: true,
    searchable: false,
    type: FieldType.NUMBER,
    width: 100,
  },
  {
    title: '可用数量',
    dataIndex: 'avaNum',
    visible: true,
    searchable: false,
    type: FieldType.NUMBER,
    width: 100,
  },
  {
    title: '锁住数量',
    dataIndex: 'lockedNum',
    visible: true,
    searchable: false,
    type: FieldType.NUMBER,
    width: 100,
  },
  {
    title: '报废数量',
    dataIndex: 'destoriedNum',
    visible: true,
    searchable: false,
    type: FieldType.NUMBER,
    width: 100,
  },
  {
    title: '单价',
    dataIndex: 'prdUnitPrc',
    visible: true,
    searchable: false,
    type: FieldType.NUMBER,
    width: 180,
    editable: true, // 设置此列可编辑
    editConfig: {
      type: 'input', // 编辑器类型
      rules: [{ required: true, message: '单价不能为空' }], // 校验规则
      onSave: async (record, value) => {
        // 保存操作的回调函数
        console.warn(`保存记录: ${value}`, record);
        // 可以在这里调用API更新数据
        // await api.updateName(record.id, value);
      },
    },
  },
  {
    title: '折扣',
    dataIndex: 'discount',
    visible: true,
    searchable: true,
    type: FieldType.NUMBER,
    width: 100,
    editable: true, // 设置此列可编辑
    editConfig: {
      type: 'input', // 编辑器类型
      rules: [{ required: true, message: '折扣不能为空' }], // 校验规则
      onSave: async (record, value) => {
        // 保存操作的回调函数
        console.warn(`保存记录: ${value}`, record);
        // 可以在这里调用API更新数据
        // await api.updateName(record.id, value);
      },
    },
  },
  {
    title: '折后单价',
    dataIndex: 'discountPrice',
    visible: true,
    searchable: false,
    type: FieldType.NUMBER,
    width: 100,
  },
  {
    title: '生产厂家',
    dataIndex: 'companyName',
    visible: true,
    searchable: false,
    type: FieldType.STRING,
    width: 100,
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
    width: 200,
    type: FieldType.OPERATION,
    actionColumnProps: {
      width: 200,
      fixed: 'right',
      align: 'center',
    },
    actions: [
      {
        text: '上架',
        type: 'link',
        onClick: (record) => {
          console.warn('上架', record);
          useServiceCall(
            {
              pageID: 'myPrivateWareShopSKUPage',
              pageButtonID: 'warehouseShopSKUOnSell',
              prdNo: record.prdNo,
              wareName: record.wareName,
            },
            {
              successMessage: '上架成功',
              errorMessage: '上架失败',
              refreshFunc: () => {
                refreshTable();
              },
            },
          );
        },
        confirm: 'auto',
        disabled: (record) => record.onCateStatus !== '0',
      },
      {
        text: '下架',
        type: 'link',
        danger: true,
        onClick: (record) => {
          console.warn('下架', record);
          useServiceCall(
            {
              pageID: 'myPrivateWareShopSKUPage',
              pageButtonID: 'warehouseShopSKUStopSell',
              prdNo: record.prdNo,
              wareName: record.wareName,
            },
            {
              successMessage: '下架成功',
              errorMessage: '下架失败',
              refreshFunc: () => {
                refreshTable();
              },
            },
          );
        },
        confirm: 'auto',
        disabled: (record) => record.onCateStatus !== '1',
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
    const params = {
      pageID: 'myBranchWareShopSKUPage',
      pageDataGrpID: 'myBranchWareShopSKU',
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
