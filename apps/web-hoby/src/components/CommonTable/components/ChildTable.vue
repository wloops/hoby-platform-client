<!--
 * @Author: AI Assistant
 * @Date: 2025-04-08 18:00:00
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-04-10 10:40:37
 * @Description: 子表组件，用于在展开行时显示
-->
<script lang="ts" setup>
import type { TableRecord } from '../types';

import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
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
loadData();

// 暴露刷新方法
defineExpose({
  refresh: loadData,
});
</script>

<template>
  <div class="child-table-container">
    <div v-if="error" class="error-message">加载失败: {{ error.message }}</div>
    <Grid v-else>
      <!-- 自定义单元格渲染的插槽 -->
      <template v-for="(_, name) in $slots" #[name]="slotProps">
        <slot :name="name" v-bind="slotProps"></slot>
      </template>

      <!-- 默认的空数据提示 -->
      <template #empty>
        <div class="no-data-tip">
          <span class="icon-[mdi--information-outline] mr-1 text-lg"></span>
          暂无数据
        </div>
      </template>
    </Grid>
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
