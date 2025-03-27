<script lang="ts" setup>
import type {
  ActionButtonProps,
  ButtonType,
  ColumnDefinition,
  TableRecord,
  VxeButtonType,
} from './types';

import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { computed, h, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { CloseOutlined } from '@ant-design/icons-vue';
// 按需导入 Ant Design Vue 组件
import { Button, Modal, Tag } from 'ant-design-vue';
import dayjs from 'dayjs';
// 导入 uuid 库
import { v4 as uuidv4 } from 'uuid';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { useEnums } from '#/composables';
import { useSetSchema } from '#/composables/table/useSetSchema';

import BatchAction from './components/BatchAction.vue';

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
});

// 定义事件
const emit = defineEmits(['selectionChange', 'batchAction']);

const { getEnumLabel, getEnumColor } = useEnums();

// 查找操作列
const actionColumn = computed(() => {
  return props.columns.find((col) => col.actions && col.actions.length > 0);
});

// 处理批量操作事件
function handleBatchAction(event: any) {
  emit('batchAction', event);
}

// 清除选择
function clearSelection() {
  const gridInstance = gridApi?.grid;
  if (gridInstance && gridInstance.clearCheckboxRow) {
    gridInstance.clearCheckboxRow();
  }
  selectedRecords.value = [];
  selectedRowKeys.value = [];
}

// 选中的记录
const selectedRecords = ref<TableRecord[]>([]);
const selectedRowKeys = ref<string[]>([]);

// 处理数据，确保每条记录都有唯一ID
const processedTableData = computed(() => {
  return props.tableData.map((item) => {
    // 如果记录没有ID属性，则添加一个UUID
    if (!item[props.rowKey]) {
      return {
        ...item,
        [props.rowKey]: uuidv4(),
      };
    }
    return item;
  });
});

// 使用自定义hooks转换列配置
const { generateSchema, generateColumns } = useSetSchema();

// 根据传入的列配置生成表单配置
const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  fieldMappingTime: [['date', ['start', 'end']]],
  schema:
    props.columns.length > 0
      ? generateSchema(props.columns)
      : [
          {
            component: 'Input',
            defaultValue: '1',
            fieldName: 'category',
            label: 'Category',
          },
          {
            component: 'Input',
            fieldName: 'productName',
            label: 'ProductName',
          },
          {
            component: 'Input',
            fieldName: 'price',
            label: 'Price',
          },
          {
            component: 'Select',
            componentProps: {
              allowClear: true,
              options: [
                {
                  label: 'Color1',
                  value: '1',
                },
                {
                  label: 'Color2',
                  value: '2',
                },
              ],
              placeholder: '请选择',
            },
            fieldName: 'color',
            label: 'Color',
          },
          {
            component: 'RangePicker',
            defaultValue: [dayjs().subtract(7, 'days'), dayjs()],
            fieldName: 'date',
            label: 'Date',
          },
        ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 是否在字段值改变时提交表单
  submitOnChange: true,
  // 按下回车时是否提交表单
  submitOnEnter: false,
};

// 处理选择变化事件
const handleSelectionChange = ({ records }: { records: TableRecord[] }) => {
  selectedRecords.value = records;
  selectedRowKeys.value = records.map((item) => item[props.rowKey] || '');
  emit('selectionChange', {
    records,
    keys: selectedRowKeys.value,
  });
};

// 生成表格列配置
const gridOptions: VxeTableGridOptions<TableRecord> = {
  checkboxConfig: props.showCheckbox
    ? {
        highlight: true,
        labelField: 'name',
        checkStrictly: false, // 是否严格模式
        checkField: 'checked', // 数据中标识选中的字段名
        showHeader: true, // 是否显示表头
      }
    : {
        highlight: true,
        labelField: 'name',
      },
  columns:
    props.columns.length > 0
      ? generateColumns(props.columns)
      : [
          { align: 'left', type: 'checkbox', width: 50 },
          { field: 'orderNo', title: '进货订单号' },
          { field: 'color', title: 'Color' },
          { field: 'productName', title: 'Product Name' },
          { field: 'price', title: 'Price' },
          { field: 'releaseDate', formatter: 'formatDateTime', title: 'Date' },
        ],
  exportConfig: {},
  height: 'auto',
  keepSource: true,
  rowConfig: {
    keyField: props.rowKey, // 设置行数据唯一标识的字段名
  },
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        // 将分页信息和表单值合并
        const formParams = {
          currentPage: page.currentPage,
          numOfPerPage: page.pageSize,
          ...formValues,
        };
        // 如果有自定义请求方法，则使用自定义请求方法
        if (props.requestApi) {
          return await props.requestApi(formParams);
        }

        // 否则使用处理过的静态数据（确保每条记录都有ID）
        return {
          items: processedTableData.value || [],
          total: processedTableData.value?.length || 0,
        };
      },
    },
  },
  toolbarConfig: {
    custom: true,
    export: true,
    refresh: true,
    resizable: true,
    search: true,
    zoom: true,
  },
};

// 显示或隐藏搜索表单
if (!props.showSearch) {
  gridOptions.formConfig = { enabled: false };
}

// 如果不需要显示复选框，则移除第一列
if (
  !props.showCheckbox &&
  gridOptions.columns &&
  gridOptions.columns[0]?.type === 'checkbox'
) {
  gridOptions.columns.shift();
}

// 如果用户提供的列中没有复选框列，且需要显示复选框，则添加
if (
  props.showCheckbox &&
  props.columns.length > 0 &&
  !props.columns.some((col) => col.type === 'checkbox')
) {
  // 使用 unshift 将复选框列添加到前面
  (gridOptions.columns as any[]).unshift({
    align: 'center',
    type: 'checkbox',
    width: 50,
  });
}

// 使用 VxeTableGridOptions 支持的方式创建 Grid
const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
  gridEvents: {
    checkboxChange: handleSelectionChange,
    checkboxAll: handleSelectionChange,
  },
});

// 处理操作按钮点击
function handleActionClick(action: ActionButtonProps, row: TableRecord): void {
  // 检查是否有onClick函数
  if (!action.onClick) return;

  // 如果需要确认，则显示确认对话框
  if (action.confirm) {
    let confirmText = '';

    // 根据confirm属性生成确认文本
    if (action.confirm === 'auto') {
      confirmText = `确定要对该记录执行${action.label || action.text || ''}操作吗？`;
    } else if (typeof action.confirm === 'string') {
      confirmText = action.confirm;
    } else {
      confirmText = '确认执行此操作？';
    }

    Modal.confirm({
      title: '确认操作',
      content: confirmText,
      onOk() {
        // 确认后执行操作
        if (action.onClick) {
          action.onClick(row);
        }
      },
    });
  } else {
    // 不需要确认，直接执行
    if (action.onClick) {
      action.onClick(row);
    }
  }
}

// 转换按钮类型
function convertButtonType(type?: VxeButtonType): ButtonType | undefined {
  if (!type) return undefined;

  const map: Record<VxeButtonType, ButtonType> = {
    default: 'default',
    error: 'primary',
    info: 'default',
    link: 'link',
    primary: 'primary',
    success: 'primary',
    warning: 'primary',
  };

  return map[type];
}
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <!-- 为每个操作列动态创建插槽 -->
      <template
        v-for="col in props.columns.filter(
          (c) => c.actions && c.actions.length > 0,
        )"
        :key="col.dataIndex"
        #[`action_${col.dataIndex}`]="{ row }"
      >
        <div class="action-buttons">
          <Button
            v-for="action in col.actions || []"
            :key="action.key || action.name || ''"
            :type="convertButtonType(action.type) || 'link'"
            :danger="action.danger"
            :disabled="
              typeof action.disabled === 'function'
                ? action.disabled(row)
                : action.disabled
            "
            v-show="
              typeof action.visible === 'function'
                ? action.visible(row)
                : action.visible !== false
            "
            @click="() => handleActionClick(action, row)"
          >
            {{ action.label || action.text }}
          </Button>
        </div>
      </template>

      <!-- 为自定义渲染列创建插槽 -->
      <template
        v-for="col in props.columns.filter((c) => c.render)"
        :key="col.dataIndex"
        #[`custom_${col.dataIndex}`]="{ row, rowIndex }"
      >
        <component
          :is="
            col.render ? col.render(row[col.dataIndex], row, rowIndex) : null
          "
        />
      </template>

      <!-- 批量操作工具栏 -->
      <template #toolbar-tools>
        <BatchAction
          :selected-records="selectedRecords"
          :batch-actions="props.batchActions"
          :column-actions="actionColumn?.actions || []"
          :min-selected="props.minSelected"
          :enable-batch-actions="props.enableBatchActions"
          :use-column-actions="props.useColumnActions"
          @action="handleBatchAction"
          @clear="clearSelection"
        />
      </template>

      <!-- 选中记录 -->
      <template #toolbar-actions>
        <div class="batch-action-info" v-if="selectedRecords.length > 0">
          <Button
            type="text"
            size="small"
            :icon="h(CloseOutlined)"
            @click="clearSelection"
          >
            已选 {{ selectedRecords.length || 0 }} /
            {{ props.tableData.length || 0 }}
          </Button>
        </div>
      </template>

      <template #tag="{ column, row }">
        <Tag
          :color="
            getEnumColor(
              `${column.params.enumName}|${column.field}`,
              row[column.field],
            ) || 'default'
          "
        >
          {{
            getEnumLabel(
              `${column.params.enumName}|${column.field}`,
              row[column.field],
            ) || row[column.field]
          }}
        </Tag>
      </template>
    </Grid>
  </Page>
</template>

<style scoped>
.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}
</style>
