<!--
 * @Author: AI Assistant
 * @Date: 2025-04-08 18:00:00
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-04-18 10:41:44
 * @Description: 子表组件，用于在展开行时显示
-->
<script lang="ts" setup>
import type { TableRecord } from '../types';

import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import type { CommonTableProps } from '#/components/CommonTable/types';

import { ref } from 'vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import CommonTable from '#/components/CommonTable/index.vue';
import { useMainGetData } from '#/composables';

const props = defineProps({
  // 父行数据
  row: {
    type: Object as () => TableRecord,
    required: true,
  },
  // 子表列配置
  columns: {
    type: Array,
    default: () => [],
  },
  // 子表页面ID
  pageID: {
    type: String,
    default: '',
  },
  // 子表数据分组ID
  pageDataGrpID: {
    type: String,
    default: '',
  },
  // 自定义参数
  customParams: {
    type: Object,
    default: () => ({}),
  },
});

// 根据pkFields获取主键键值对对象
const getPkValue = (row: TableRecord, pkFields: string[]) => {
  const pkValue: Record<string, any> = {};
  pkFields.forEach((field) => {
    pkValue[field] = row[field];
  });
  return pkValue;
};

// 子表数据
const tableData = ref<any[]>([]);
const error = ref<Error | null>(null);

// 使用vben的vxe-table封装
const gridOptions: VxeGridProps<any> = {
  columns: props.columns as any[],
  data: tableData.value,
  border: true,
  stripe: true,
  showOverflow: true,
  height: 'auto',
  pagerConfig: {
    enabled: false,
  },
  expandConfig: {
    mode: 'fixed',
  },
};

const gridEvents: VxeGridListeners<any> = {};

// const [Grid, gridApi] = useVbenVxeGrid({ gridOptions, gridEvents });
const [Grid, gridApi] = useVbenVxeGrid({ gridOptions, gridEvents });

// 加载数据
const loadData = async () => {
  gridApi.setLoading(true);
  error.value = null;
  if (props.row.childTableData) {
    tableData.value = props.row.childTableData;
    gridApi.setGridOptions({ data: tableData.value });
    gridApi.setLoading(false);
    return;
  }
  try {
    const params = {
      pageID: props.pageID,
      pageDataGrpID: props.pageDataGrpID,
      ...props.customParams,
    };

    const { data } = await useMainGetData(params);
    tableData.value = Array.isArray(data.value) ? data.value : [];
    gridApi.setGridOptions({ data: tableData.value });
  } catch (error_) {
    console.error('加载子表数据失败', error_);
    error.value = error_ as Error;
  } finally {
    gridApi.setLoading(false);
  }
};

// // 当父行数据或页面ID变化时重新加载数据
// watch(
//   () => [props.row, props.pageID, props.pageDataGrpID],
//   () => {
//     if (props.pageID) {
//       loadData();
//     }
//   },
//   { immediate: true },
// );

!props.customParams.isCommonTable && loadData();

const tableProps = ref<CommonTableProps>({
  // 基础配置(必填) CommonTableParams
  params: {
    pageID: props.pageID, // 页面ID
    showAddButton: false, // 是否显示新增按钮
    childTableQueryParams: getPkValue(props.row, props.customParams.pkFields),
  },
  // 表格列配置(必填) ColumnDefinition[]
  columns: [],
  tableFixedHeight: '300px',
  // 页面按钮列表（可选）ActionButtonProps[]
  pageButtons: [],
  // 表格数据（可选）TableRecord[]
  tableData: [],
  // 是否展示搜索表单（可选）
  showSearch: false,
  // 是否自动刷新（可选）
  autoRefresh: false,
  // 是否展示复选框列（可选）
  showCheckbox: false,
  // 是否展示序号列（可选）
  // showIndex: false,
  // 是否展示工具栏（可选)
  showToolbar: false,
  // 是否展示表格顶部（可选)
  showTableTop: false,
  // 行唯一标识（可选）
  rowKey: 'id',
  // 最小选中数量（可选）
  minSelected: 1,
  // 是否启用批量操作（可选）
  enableBatchActions: true,
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

// 暴露刷新方法
defineExpose({
  refresh: loadData,
});
</script>

<template>
  <div class="child-table-container">
    <div v-if="error" class="error-message">加载失败: {{ error.message }}</div>
    <div v-else>
      <CommonTable
        ref="tableRef"
        v-bind="tableProps"
        v-if="customParams.isCommonTable"
      />
      <Grid v-else>
        <template v-for="(_, name) in $slots" #[name]="slotProps">
          <slot :name="name" v-bind="slotProps"></slot>
        </template>

        <template #empty>
          <div class="no-data-tip">
            <span class="icon-[mdi--information-outline] mr-1 text-lg"></span>
            暂无数据
          </div>
        </template>
      </Grid>
      <!-- </div> -->
    </div>
  </div>
</template>

<style scoped>
.child-table-container {
  padding: 8px 16px;
  background-color: #fafafa;
  border-radius: 4px;
}

.error-message {
  padding: 16px;
  color: #ff4d4f;
}

.no-data-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  font-size: 14px;
  color: #999;
}
</style>
