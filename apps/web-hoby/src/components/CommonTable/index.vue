<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-04-01 13:23:33
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-04-02 13:45:42
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\components\CommonTable\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import type { ActionButtonProps, ColumnDefinition, TableRecord } from './types';

import { onMounted, ref } from 'vue';

import DynamicForm from '#/components/DynamicForm/index.vue';
import { useSetSchema } from '#/composables';

import Table from './Table.vue';
// 定义组件接收的属性
const props = defineProps({
  // 表格列配置
  columns: {
    type: Array as () => ColumnDefinition[],
    default: () => [],
  },
  // 表格数据
  tableData: {
    type: Array as () => TableRecord[],
    default: () => [],
  },
  // 是否自动刷新
  autoRefresh: {
    type: Boolean,
    default: false,
  },
  // 是否展示搜索表单
  showSearch: {
    type: Boolean,
    default: true,
  },
  // 自定义请求方法
  requestApi: {
    type: Function,
    default: null,
  },
  // 是否显示复选框列
  showCheckbox: {
    type: Boolean,
    default: true,
  },
  // 唯一标识字段名
  rowKey: {
    type: String,
    default: 'id',
  },
  // 批量操作按钮
  batchActions: {
    type: Array as () => ActionButtonProps[],
    default: () => [],
  },
  // 批量操作最小选择数量
  minSelected: {
    type: Number,
    default: 1,
  },
  // 是否启用批量操作
  enableBatchActions: {
    type: Boolean,
    default: true,
  },
  // 使用操作列中的按钮作为批量操作按钮
  useColumnActions: {
    type: Boolean,
    default: true,
  },
  // 参数
  params: {
    type: Object,
    default: () => {},
  },
});

const loading = ref(true);

const dynamicFormRef = ref<null | {
  open: (
    params: { pageButtonID: string; pageID: string },
    record: Record<string, any>,
  ) => void;
}>(null);
const dynamicFormTitle = ref('');

const openDynamicForm = (
  params: { buttonTitle: string; pageButtonID?: string; pageID: string },
  record?: Record<string, any>,
) => {
  const formParams = {
    pageID: params.pageID,
    pageButtonID: params?.pageButtonID || '',
  };
  dynamicFormRef.value?.open(formParams, record || {});
  dynamicFormTitle.value = params.buttonTitle || '';
};

const sendColumns = ref<ColumnDefinition[]>([]);
const { getViewSchema } = useSetSchema();
onMounted(async () => {
  sendColumns.value =
    props.columns.length > 1
      ? props.columns
      : await getViewSchema(props.columns, props.params.pageID);
  // 处理枚举值
  loading.value = false;
});
</script>

<template>
  <div>
    <Table
      v-if="!loading"
      :columns="sendColumns"
      :params="params"
      :table-data="tableData"
      :auto-refresh="autoRefresh"
      :show-search="showSearch"
      :request-api="requestApi"
      :show-checkbox="showCheckbox"
      :row-key="rowKey"
      :batch-actions="batchActions"
      :min-selected="minSelected"
      :enable-batch-actions="enableBatchActions"
      :use-column-actions="useColumnActions"
      @open-dynamic-form="openDynamicForm"
    />
    <DynamicForm ref="dynamicFormRef" :title="dynamicFormTitle" />
  </div>
</template>

<style scoped></style>
