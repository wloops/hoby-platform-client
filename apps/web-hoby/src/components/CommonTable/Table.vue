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

import { computed, ref } from 'vue';

import { Page } from '@vben/common-ui';

// 按需导入 Ant Design Vue 组件
import { Button, Modal, Tag } from 'ant-design-vue';
// 导入 uuid 库
import { v4 as uuidv4 } from 'uuid';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  mainDeleteRecrdApi,
  mainGetViewDataApi,
  mainGetViewSearchDataApi,
} from '#/api';
import { useEnums, useServiceCall } from '#/composables';
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
  // 参数
  params: {
    type: Object,
    default: () => {},
  },
});

// 定义事件
const emit = defineEmits([
  'selectionChange',
  'batchAction',
  'refresh',
  'openDynamicForm',
]);
const { getEnumLabel, getEnumColor } = useEnums();

// 查找操作列
const actionColumn = computed(() => {
  return props.columns.find((col) => col.actions && col.actions.length > 0);
});

// 添加刷新方法
function refreshTable() {
  const gridInstance = gridApi?.grid;
  if (gridInstance && gridInstance.commitProxy) {
    gridInstance.commitProxy('query');
  }
  emit('refresh');
}

// 暴露刷新方法给父组件
defineExpose({
  refresh: refreshTable,
});

// 添加泛型类型定义，处理 Promise 判断的类型问题
type PromiseOrValue<T> = Promise<T> | T;

// 封装通用的操作执行函数
async function executeAction<T>(
  action: ActionButtonProps,
  _params: any,
  callback?: () => PromiseOrValue<T>,
): Promise<void> {
  if (!callback) return;

  try {
    // 执行回调函数
    const result = callback();

    // 检查是否为 Promise
    if (result && typeof (result as Promise<T>).then === 'function') {
      await result;
    }

    // 操作完成后，如果需要自动刷新，则刷新表格
    if (action.autoRefresh !== false) {
      refreshTable();
    }
  } catch (error) {
    console.error('操作执行失败:', error);
  }
}

// 封装通用的服务操作方法，处理 API 调用和自动刷新
async function executeServiceAction(
  action: ActionButtonProps,
  record: TableRecord,
): Promise<void> {
  if (!action) return;

  try {
    // 获取服务参数
    let serviceParams: Record<string, any> = {};

    // 如果配置了自定义 params 函数，则调用它来获取参数
    if (typeof action.params === 'function') {
      serviceParams = action.params(record);
    }
    // 如果配置了静态 params 对象，则使用它
    else if (action.params && typeof action.params === 'object') {
      serviceParams = { ...action.params };
    }

    // 如果同时配置了 fields 字段，则将记录中的这些字段值添加到 params 中
    if (Array.isArray(action.fields) && action.fields.length > 0) {
      // 传递了指定字段
      action.fields.forEach((field) => {
        if (record[field] !== undefined) {
          serviceParams[field] = record[field];
        }
      });
    }
    // 空数组则不提取任何字段
    else {
      // 默认关键字段列表
      const defaultFields = ['id', 'code', 'name', props.rowKey];
      defaultFields.forEach((field) => {
        if (record[field] !== undefined) {
          serviceParams[field] = record[field];
        }
      });
    }
    // 如果配置了 api 方法，则调用它
    if (action.api) {
      const result = await action.api(serviceParams);

      // 如果需要自动刷新，则刷新表格
      if (action.autoRefresh !== false) {
        refreshTable();
      }

      return result;
    }
    // 否则使用通用的 useServiceCall 方法
    else {
      return await useServiceCall(serviceParams, {
        successMessage:
          action.successMsg || `${action.label || action.text || '操作'}成功`,
        errorMessage:
          action.errorMsg || `${action.label || action.text || '操作'}失败`,
        refreshFunc: action.autoRefresh === false ? undefined : refreshTable,
      });
    }
  } catch (error) {
    console.error('服务操作执行失败:', error);
  }
}

// 处理操作按钮点击，修改现有方法
function handleActionClick(action: ActionButtonProps, row: TableRecord): void {
  // 如果既没有 onClick 也没有 api，则不处理
  if (!action.onClick && !action.api && !action.params) return;

  // 确认操作的通用处理
  const handleConfirm = () => {
    // 根据 runMode 决定执行方式
    if (action.runMode === 'modal' || action.runMode === 'drawer') {
      // 打开弹窗
      emit('openDynamicForm', {
        buttonTitle: action.label || action.text,
        pageID: props.params?.pageID || '',
        mode: action.runMode || 'drawer',
        record: row,
      });
    } else {
      // 默认执行方式
      if (action.api || action.params) {
        // 如果配置了 API 或参数，则调用服务操作方法
        executeServiceAction(action, row);
      } else if (action.onClick) {
        // 否则执行原有的 onClick 回调
        executeAction(action, row, () => action.onClick?.(row));
      }
    }
  };

  // 如果需要确认，则显示确认对话框
  if (action.confirm && (!action.runMode || action.runMode === 'default')) {
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
        return handleConfirm();
      },
    });
  } else {
    // 不需要确认，直接执行
    handleConfirm();
  }
}

// 处理批量操作事件，更新现有方法
async function handleBatchAction(event: any) {
  emit('batchAction', event);

  // 如果事件包含操作对象
  if (event.action) {
    const action = event.action;

    // 如果配置了 API 或参数，且有选中记录
    if (
      (action.api || action.params) &&
      event.records &&
      event.records.length > 0
    ) {
      try {
        // 获取服务参数
        let serviceParams: Record<string, any> = {};

        // 如果配置了自定义 batchParams 函数，则调用它来获取批量参数
        if (typeof action.batchParams === 'function') {
          serviceParams = action.batchParams(event.records);
        }
        // 如果配置了静态 params 对象，则使用它
        else if (action.params && typeof action.params === 'object') {
          serviceParams = { ...action.params };
        }

        // 添加记录 ID 列表到参数中
        if (props.rowKey && event.records.length > 0) {
          serviceParams.ids = event.records.map(
            (record: TableRecord) => record[props.rowKey],
          );
        }

        // 如果配置了 api 方法，则调用它
        if (action.api) {
          await action.api(serviceParams);

          // 如果需要自动刷新，则刷新表格
          if (action.autoRefresh !== false) {
            refreshTable();
          }
        }
        // 否则使用通用的 useServiceCall 方法
        else {
          await useServiceCall(serviceParams, {
            successMessage:
              action.successMsg ||
              `批量${action.label || action.text || '操作'}成功`,
            errorMessage:
              action.errorMsg ||
              `批量${action.label || action.text || '操作'}失败`,
            refreshFunc:
              action.autoRefresh === false ? undefined : refreshTable,
          });
        }
      } catch (error) {
        console.error('批量服务操作执行失败:', error);
      }
    }
    // 使用原有的 onClick 回调处理批量操作
    else if (typeof action.onClick === 'function' && event.records) {
      await executeAction(action, event.records, () =>
        action.onClick?.(event.records),
      );
    }
  } else if (event.autoRefresh !== false) {
    // 如果没有操作对象但需要刷新，则直接刷新
    refreshTable();
  }
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
  collapsed: true,
  // fieldMappingTime: [['date', ['start', 'end']]],
  schema: props.columns.length > 0 ? generateSchema(props.columns) : [],

  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 是否在字段值改变时提交表单
  submitOnChange: false,
  // 按下回车时是否提交表单
  submitOnEnter: true,
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
        trigger: 'row', // 触发方式
        range: true, // 是否支持范围选择
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
  editConfig: {
    mode: 'cell',
    trigger: 'click',
  },
  exportConfig: {},
  height: 'auto',
  keepSource: true,
  rowConfig: {
    keyField: props.rowKey, // 设置行数据唯一标识的字段名
    isCurrent: true,
    isHover: true,
  },
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        // 将searchForm中的字段转换为;连接的字符串
        const searchFormString = Object.entries(formValues)
          .map(([key, value]) => `${key}=${value ?? ''}`)
          .join(';');
        // 将分页信息和表单值合并
        const formParams = {
          currentPage: page.currentPage,
          numOfPerPage: page.pageSize,
        };
        // 如果有自定义请求方法，则使用自定义请求方法
        if (props.requestApi) {
          return await props.requestApi(formParams);
        }

        // 如果提供了pageID，使用mainGetViewDataApi获取数据
        if (props.params && props.params.pageID) {
          const hasValue = Object.values(formValues).some(
            (value) => value !== undefined,
          ); // 至少有一个字段有值
          try {
            const params = {
              INTERPAGEID: props.params.pageID,
              INTERCURPAGENO: page.currentPage,
              [hasValue ? 'INTERRECNUMPERPAGE' : 'INTERPAGESIZE']:
                page.pageSize,
            };
            const api = hasValue
              ? mainGetViewSearchDataApi
              : mainGetViewDataApi;
            if (hasValue) {
              params.queryConditions = searchFormString;
            }
            const { rs, records, recNumOfCurPage: total } = await api(params);

            if (rs === '1' && Array.isArray(records)) {
              return {
                items: records || [],
                total: Number.parseInt(total || '0', 10),
              };
            }
          } catch (error) {
            console.error('获取表格数据失败:', error);
          }
        }

        // 无API或API调用失败时使用静态数据
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
  showSearchForm: formOptions?.schema && formOptions?.schema?.length > 0,
  formOptions,
  gridOptions,
  gridEvents: {
    checkboxChange: handleSelectionChange,
    checkboxAll: handleSelectionChange,
  },
});

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
// 添加默认操作按钮配置
const getDefaultActions = (pageID: string): ActionButtonProps[] => {
  return [
    {
      key: 'view',
      label: '查看',
      type: 'link',
      batchable: false,
      onClick: (row: TableRecord) => {
        emit('openDynamicForm', {
          buttonTitle: '查看',
          pageID,
          mode: 'modal',
          record: row,
          type: 'view',
        });
      },
    },
    {
      key: 'edit',
      label: '编辑',
      type: 'link',
      batchable: false,
      onClick: (row: TableRecord) => {
        emit('openDynamicForm', {
          buttonTitle: '编辑',
          pageID,
          mode: 'modal',
          record: row,
          type: 'edit',
        });
      },
    },
    {
      key: 'delete',
      label: '删除',
      type: 'link',
      danger: true,
      confirm: '确定要删除此记录吗？',
      api: mainDeleteRecrdApi,
      params: (row: TableRecord) => ({
        INTERPAGEID: pageID,
        INTERFORMDATA: JSON.stringify(row),
      }),
    },
  ];
};

// 处理操作列配置
const processColumnActions = () => {
  // 找到操作列
  const actionCol = props.columns.find(
    (col) =>
      (col.actions && col.actions.length > 0) ||
      col.dataIndex === 'action' ||
      col.type === 'operation',
  );

  // 如果没找到操作列，不处理
  if (!actionCol) return;

  // 如果没有配置actions，则创建空数组
  if (!actionCol.actions) {
    actionCol.actions = [];
  }

  // 如果操作列中有特殊标记，则添加默认操作按钮
  if (actionCol.defaultActions !== false && props.params?.pageID) {
    const defaultActions = getDefaultActions(props.params.pageID);

    // 如果指定了要显示哪些默认按钮
    if (Array.isArray(actionCol.defaultActions)) {
      const showActionKeys = actionCol.defaultActions;
      const filteredActions = defaultActions.filter((action) =>
        showActionKeys.includes(action.key as string),
      );

      // 将筛选后的默认操作按钮添加到actions数组
      actionCol.actions = [...actionCol.actions, ...filteredActions];
    } else {
      // 添加所有默认操作按钮
      actionCol.actions = [...actionCol.actions, ...defaultActions];
    }
  }
};

// 在生成列配置前调用此函数
// 在现有的代码中找到适当的位置添加这个调用
// 例如在 generateColumns 调用前
if (props.columns.length > 0) {
  processColumnActions();
}

// 在表格顶部添加工具栏按钮
// 1. 首先添加一个计算属性决定是否显示新增按钮
const showAddButton = computed(() => {
  // 检查是否在参数中指定了显示新增按钮
  return props.params?.showAddButton !== false; // 默认显示，除非明确设置为false
});

// 2. 处理新增按钮点击事件
const handleAddClick = () => {
  if (props.params?.onAdd && typeof props.params.onAdd === 'function') {
    // 调用用户自定义的onAdd方法
    props.params.onAdd();
  } else if (props.params?.pageID) {
    // 默认跳转到新增页面或打开新增对话框
    // 可以根据实际需求实现
    console.warn('添加新记录，页面ID:', props.params.pageID);
    // 这里可以实现默认的新增逻辑
    // 打开对话框
    emit('openDynamicForm', {
      buttonTitle: '新增',
      pageID: props.params.pageID,
      type: 'add',
    });
  }
};

// 在 ColumnDefinition 类型定义中添加 defaultActions 属性
// 可以添加到 types.ts 文件中
// defaultActions?: boolean | string[]; // true表示全部显示，字符串数组表示显示指定的按钮，false表示不显示默认按钮
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
        <div class="flex items-center gap-1">
          <div class="batch-action-info" v-if="selectedRecords.length > 0">
            <Button type="text" @click="clearSelection">
              <div class="stems-center flex items-center justify-center gap-1">
                <span class="icon-[mdi--arrow-u-left-top] text-lg"></span>
                <span class="selection-info">
                  已选
                  <span class="selected-count">{{
                    selectedRecords.length
                  }}</span>
                  条
                </span>
              </div>
            </Button>
          </div>

          <Button v-if="showAddButton" type="primary" @click="handleAddClick">
            新增
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

.selection-info {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.selected-count {
  margin: 0 4px;
  font-weight: bold;
  color: #1890ff;
}
</style>
