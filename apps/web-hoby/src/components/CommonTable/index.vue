<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-04-01 13:23:33
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-04-16 17:34:13
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\components\CommonTable\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import type { PropType } from 'vue';

import type {
  ActionButtonProps,
  ChildTableProps,
  ColumnDefinition,
  CustomSchemaList,
  TableRecord,
} from './types';

import { onMounted, ref } from 'vue';

import DynamicForm from '#/components/DynamicForm/index.vue';
import { useSetSchema, useTabs } from '#/composables';

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
  // 基础配置
  params: {
    type: Object,
    default: () => {},
  },
  pageButtons: {
    type: Array as () => ActionButtonProps[],
    default: () => [],
  },
  // 展开子表参数
  childTables: {
    type: Object as () => ChildTableProps,
    default: () => ({}),
  },
  // 选中行变化事件
  onSelectionChange: {
    type: Function as PropType<
      (records: TableRecord[], keys: string[]) => void
    >,
    default: () => {},
  },
});

const loading = ref(true);
const runMode = ref<'drawer' | 'modal'>('drawer');

const dynamicFormRef = ref<null | {
  open: (
    params: { pageButtonID: string; pageID: string },
    record: Record<string, any>,
    type?: 'add' | 'default' | 'edit' | 'view',
    schema?: CustomSchemaList[],
    originParams?: Record<string, any>,
  ) => void;
}>(null);
const dynamicFormTitle = ref('');

const openDynamicForm = (params: {
  buttonTitle: string;
  mode?: 'drawer' | 'modal';
  originParams?: Record<string, any>;
  pageButtonID?: string;
  pageID?: string;
  record?: Record<string, any>;
  schema?: CustomSchemaList[];
  serviceParams?: Record<string, any>;
  type?: 'add' | 'default' | 'edit' | 'view';
}) => {
  runMode.value = params.mode || 'drawer';
  const formParams = {
    ...params.serviceParams,
    pageID: params.pageID || params.serviceParams?.pageID || '',
    pageButtonID:
      params.pageButtonID || params.serviceParams?.pageButtonID || '',
  };
  const type = params.type || 'default';
  dynamicFormRef.value?.open(
    formParams,
    params.record || {},
    type,
    params.schema,
    params.originParams || {},
  );
  dynamicFormTitle.value = params.buttonTitle || '';
};

const sendColumns = ref<ColumnDefinition[]>([]);
const fieldSort = ref({
  displayFldList: '',
  queryPanelFldList: '',
});

const pageParams = ref<any>(props.params);
const pageButtonsList = ref<ActionButtonProps[]>(props.pageButtons);
const dBDefaultActionsList = ref<any[]>([]);

const { getViewSchema } = useSetSchema();
const { getTabsList } = useTabs();
onMounted(async () => {
  // 判断是否为多标签页
  if (props.params?.isTabs) {
    // 获取tabs列表和默认tab
    const { tabs, defaultTab } = await getTabsList(props.params.pageID);
    pageParams.value.pageID = defaultTab?.pageID;
    pageParams.value.tabs = tabs;
  }
  // 获取视图配置
  const {
    columns,
    displayFldList,
    queryPanelFldList,
    pageButtons,
    DBDefaultActions,
  } = await getViewSchema(props.columns, pageParams.value);
  sendColumns.value = props.columns.length > 1 ? props.columns : columns;
  fieldSort.value.displayFldList = displayFldList;
  fieldSort.value.queryPanelFldList = queryPanelFldList;
  pageButtonsList.value = pageButtons;
  dBDefaultActionsList.value = DBDefaultActions;

  loading.value = false;
});

const tableRef = ref<null | {
  refresh: () => void;
}>(null);

const refresh = () => {
  tableRef.value?.refresh();
};

const handleTabChange = (value: string) => {
  pageParams.value.pageID = value;
  tableRef.value?.refresh();
};
</script>

<template>
  <div>
    <Table
      v-if="!loading"
      ref="tableRef"
      :columns="sendColumns"
      :params="pageParams"
      :field-sort="fieldSort"
      :tabs="pageParams.tabs"
      :child-tables="childTables"
      :page-buttons="pageButtonsList"
      :d-b-default-actions="dBDefaultActionsList"
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
      @selection-change="onSelectionChange"
      @tab-change="handleTabChange"
    />
    <DynamicForm
      ref="dynamicFormRef"
      :title="dynamicFormTitle"
      :mode="runMode"
      @refresh="refresh"
    />
  </div>
</template>

<style scoped></style>
