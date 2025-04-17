import type { VxeGridPropTypes } from 'vxe-table';

import type {
  ActionButtonProps,
  ColumnDefinition,
  CommonTableParams,
} from '#/components/CommonTable/types';

import { mainGetViewFieldConfigApi } from '#/api';
import { FieldType } from '#/components/CommonTable/types';
import { useEnums, useSetButtons } from '#/composables';

export interface VxeSchemaItem {
  component: string;
  fieldName: string;
  label: string;
  defaultValue?: any;
  componentProps?: Record<string, any>;
  [key: string]: any;
}

// // 添加 cellRender 参数类型定义
// interface VxeCellParams {
//   row: any;
//   column: any;
//   [key: string]: any;
// }

// interface VxeButtonParams {
//   name: string;
//   [key: string]: any;
// }

export function useSetSchema() {
  /**
   * 将自定义列配置转换为 VxeTable 的 schema 格式
   * @param columnConfigs - 列配置数组
   * @returns VxeTable schema 配置
   */
  const generateSchema = (
    columnConfigs: ColumnDefinition[],
    queryPanelFldList: string,
  ): VxeSchemaItem[] => {
    const schema = columnConfigs
      .filter((config) => config.searchable === true)
      .map((config) => {
        // const { getEnumList } = useEnums(); // 避免顶层调用,改为在函数内部调用;
        const schemaItem: VxeSchemaItem = {
          fieldName: config.dataIndex,
          label: config.title,
          component: getComponentByType(config.type),
        };

        // 处理选项类组件
        if (config.options && config.options.length > 0) {
          schemaItem.componentProps = {
            options: config.options,
            allowClear: true,
            placeholder: '请选择',
          };
        }

        // 处理选项类组件 有enumName
        if (config.type === FieldType.SELECT && config.enumName) {
          schemaItem.componentProps = {
            options: config.options,
            allowClear: true,
            placeholder: '请选择',
          };
        }

        if (config.type === FieldType.DATE) {
          schemaItem.component === 'DatePicker';
          schemaItem.componentProps = {
            valueFormat: 'YYYYMMDD',
          };
        }

        if (config.type === FieldType.DATETIME) {
          schemaItem.component === 'DatePicker';
          schemaItem.componentProps = {
            showTime: true,
            format: 'YYYY-MM-DD HH:mm:ss',
            valueFormat: 'YYYYMMDDHHmmss',
          };
        }

        if (config.type === FieldType.TIME) {
          schemaItem.component === 'TimePicker';
          schemaItem.componentProps = {
            valueFormat: 'HHmmss',
          };
        }
        return schemaItem;
      });
    // 将 queryPanelFldList 转换为数组
    const queryPanelFields = queryPanelFldList
      ? queryPanelFldList.split(',')
      : [];
    // 将 schema 中的 fieldName 转换为 queryPanelFields 中的顺序
    schema.sort(
      (a, b) =>
        queryPanelFields.indexOf(a.fieldName) -
        queryPanelFields.indexOf(b.fieldName),
    );
    return schema;
  };

  /**
   * 将自定义列配置转换为 VxeTable 的 columns 格式
   * @param columnConfigs - 列配置数组
   * @returns VxeTable columns 配置
   */
  const generateColumns = (
    columnConfigs: ColumnDefinition[],
    displayFldList: string,
  ): VxeGridPropTypes.Columns => {
    const columns = columnConfigs
      .filter((config) => config.visible)
      .map((config) => {
        const { getEnumColor } = useEnums(); // 避免顶层调用,改为在函数内部调用;
        const column: any = {
          field: config.dataIndex,
          title: config.title,
          // minWidth: calculateColumnWidth(
          //   config.type as FieldType,
          //   config.title,
          // ), // 设置最小宽度
          showOverflow: config.ellipsis ? 'tooltip' : null, // 内容溢出显示tooltip
        };

        // 如果是固定宽度，则使用指定宽度
        if (config.width) {
          column.width = config.width;
        }
        if (
          config.type === 'operation' &&
          config.actions &&
          config.actions.length > 0
        ) {
          column.minWidth = `${calculateOperationColumnWidth(config.actions as any)}px`;
          column.showOverflow = false;
        }

        // 处理对齐方式
        if (config.align) {
          column.align = config.align;
        }

        // 处理固定列
        if (config.fixed) {
          column.fixed = config.fixed;
        }

        // 处理日期格式化
        if (config.type === FieldType.DATE) {
          column.formatter = 'formatDate';
        }
        if (config.type === FieldType.DATETIME) {
          column.formatter = 'formatDateTime';
        }

        // 处理select类型渲染为Tag
        if (config.type === FieldType.SELECT) {
          column.slots = getEnumColor(config.enumName as string)
            ? { default: 'tag' }
            : { default: 'shiftLabel' };

          column.params = {
            enumName: config.enumName,
          };
        }

        // 处理自定义渲染
        if (config.render) {
          column.slots = { default: `custom_${config.dataIndex}` };
        }

        // 处理操作列 - 使用插槽实现
        if (config.actions && config.actions.length > 0) {
          // 使用 slots 实现按钮组
          column.slots = {
            default: `action_${config.dataIndex}`,
          };

          // 应用操作列的属性
          if (config.actionColumnProps) {
            Object.assign(column, config.actionColumnProps);
          }
        }

        // 开启单元格编辑
        if (config.editable) {
          const editType = 'input';
          // switch (config.type) {
          //   case FieldType.NUMBER: {
          //     editType = '';
          //     break;
          //   }
          //   case FieldType.SELECT: {
          //     editType = 'select';
          //     break;
          //   }

          //   default: {
          //     break;
          //   }
          // }
          column.editRender = { name: editType };
        }

        return column;
      });
    // 将 displayFldList 转换为数组
    const displayFields = displayFldList ? displayFldList.split(',') : [];
    // 将 columns 中的 field 转换为 displayFields 中的顺序
    columns.sort(
      (a, b) => displayFields.indexOf(a.field) - displayFields.indexOf(b.field),
    );
    return columns;
  };

  /**
   * 根据字段类型获取对应的组件类型
   * @param type - 字段类型
   * @returns 组件类型
   */
  const getComponentByType = (type: FieldType | string): string => {
    const typeMap: Record<string, string> = {
      [FieldType.STRING]: 'Input',
      [FieldType.NUMBER]: 'InputNumber',
      [FieldType.SELECT]: 'Select',
      [FieldType.DATE]: 'DatePicker',
      [FieldType.DATETIME]: 'DatePicker',
      [FieldType.CHECKBOX]: 'Checkbox',
      [FieldType.SWITCH]: 'Switch',
      [FieldType.TIME]: 'TimePicker',
      // 添加其他需要的映射...
    };

    return typeMap[type] || 'Input';
  };

  /**
   * 请求获取列配置转换为 VxeTable 的 columns schema 格式
   * @param operationColumn - 操作列配置数组
   * @param pageID - 页面id
   * @returns ColumnDefinition[] 列配置数组
   */
  const getViewSchema = async (
    operationColumn: ColumnDefinition[],
    pageParams: CommonTableParams,
  ): Promise<{
    columns: ColumnDefinition[];
    DBDefaultActions: any[];
    displayFldList: string;
    pageButtons: ActionButtonProps[];
    queryPanelFldList: string;
  }> => {
    const pageID = pageParams.pageID;
    const { getEnumList } = useEnums(); // 避免顶层调用,改为在函数内部调用;
    const { setButtonParams } = useSetButtons();
    const {
      rs,
      fieldList,
      displayFldList,
      pkFldList,
      queryPanelFldList,
      DBRecAccBtnGrp,
      recBtnGrp,
      formBtnGrp,
    } = await mainGetViewFieldConfigApi({ pageID });

    if (rs !== '1' || !fieldList || !Array.isArray(fieldList)) {
      return {
        columns: operationColumn || [],
        displayFldList: '',
        pageButtons: [],
        queryPanelFldList: '',
        DBDefaultActions: [],
      };
    }

    // 将字符串转换为数组
    const displayFields = displayFldList ? displayFldList.split(',') : [];
    const pkFields = pkFldList ? pkFldList.split(',') : [];
    const queryPanelFields = queryPanelFldList
      ? queryPanelFldList.split(',')
      : [];

    // 将 fieldList 转换为 ColumnDefinition[]
    const columns: ColumnDefinition[] = fieldList.map((field) => {
      // 判断字段是否可见
      const visible = displayFields.includes(field.fieldName);
      // 判断字段是否在查询面板中
      const searchable = queryPanelFields.includes(field.fieldName);

      // 根据 value 确定字段类型
      let fieldType = FieldType.STRING;

      if (field.value) {
        if (field.value.startsWith('date::') || field.value.includes('^F^d^')) {
          fieldType = FieldType.DATE;
        } else if (
          field.value.startsWith('datetime::') ||
          field.value.includes('^F^dt^')
        ) {
          fieldType = FieldType.DATETIME;
        } else if (field.value.includes('^F^t^')) {
          fieldType = FieldType.TIME; // 时间类型
          // eslint-disable-next-line regexp/no-unused-capturing-group
        } else if (/\.?enum[.:]{1,2}([^,]+)/.test(field.value)) {
          fieldType = FieldType.SELECT;

          // 提取枚举名称
          // 匹配 `enum.xxx` 或 `enum::xxx` 格式
          const enumMatch = field.value.match(/\.?enum[.:]{1,2}([^,]+)/);

          if (enumMatch && enumMatch[1]) {
            (field as any).enumName = enumMatch[1].trim(); // 去除可能的空格;
          }
        } else if (field.value.startsWith('multirow::')) {
          fieldType = FieldType.STRING;
        } else if (field.fieldType === 2) {
          fieldType = FieldType.NUMBER;
        }
      }

      // 创建列定义
      const column: ColumnDefinition = {
        title: field.displayName,
        dataIndex: field.fieldName,
        visible,
        searchable, // 默认可搜索
        type: fieldType,
        ellipsis: true, // 默认开启省略
      };

      // 如果是主键字段，添加特殊标记
      if (pkFields.includes(field.fieldName)) {
        // column.isPrimaryKey = true;
      }

      // 如果有枚举名称，添加到列定义
      if ((field as any).enumName) {
        column.enumName = (field as any).enumName;
      }

      return column;
    });

    // 处理枚举选项
    for (const column of columns) {
      if (column.enumName) {
        column.options = await getEnumList(column.enumName);
      }
    }
    const DBDefaultActions: any = [];
    // 添加操作列
    if (operationColumn && operationColumn.length > 0 && operationColumn[0]) {
      // 添加按钮组
      let btnGroup: string[] = [];
      if (DBRecAccBtnGrp && DBRecAccBtnGrp.length > 0) {
        // eslint-disable-next-line array-callback-return
        btnGroup = DBRecAccBtnGrp.map((btn: any) => {
          DBDefaultActions.push(btn);
          if (btn.serviceID === 1) {
            pageParams.showAddButton = true;
            return null;
          }
          if (btn.serviceID === 2) return 'delete';
          if (btn.serviceID === 3) return 'edit';
          if (btn.serviceID === 48) return 'copy';
          if (btn.serviceID === 50) return 'view';
        });
        if (
          Array.isArray(btnGroup) &&
          btnGroup.length === 1 &&
          btnGroup[0] === null
        ) {
          operationColumn[0].visible = false;
        }

        operationColumn[0].defaultActions = btnGroup;
      } else {
        operationColumn[0].defaultActions = false;
        operationColumn[0].visible = false;
      }

      if (recBtnGrp && recBtnGrp.length > 0) {
        operationColumn[0].visible = true;
        operationColumn[0].actions = setButtonParams(recBtnGrp);
      }
      columns.push(...operationColumn);
    }

    let pageButtons: ActionButtonProps[] = [];
    if (formBtnGrp && formBtnGrp.length > 0) {
      pageButtons = setButtonParams(formBtnGrp);
    }

    return {
      columns,
      displayFldList,
      queryPanelFldList,
      pageButtons,
      DBDefaultActions,
    };
  };

  return {
    generateSchema,
    generateColumns,
    getViewSchema,
  };
}

/**
 * 计算操作列总宽度
 * @param actions - 列参数
 * @returns 计算后的列宽度
 */
// 计算操作列总宽度
function calculateOperationColumnWidth(
  actions: Array<{ text: string }>,
): number {
  if (!actions || actions.length === 0) return 0;
  const buttonMargin = 15; // 按钮间距
  return Math.trunc(
    actions.reduce((total, action) => {
      return total + getButtonWidth(action) + buttonMargin;
    }, 0) - buttonMargin,
  ); // 最后一个按钮不需要右边距
}
function calculateTextWidth(text: string, font = '14px Arial'): number {
  if (!text) return 0;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return 0;
  context.font = font;
  return context.measureText(text).width;
}

// 计算单个按钮宽度
function getButtonWidth(action: { text: string }): number {
  const textWidth = calculateTextWidth(action.text);
  const horizontalPadding = 15; // 左右各 8px
  const borderWidth = 2; // 左右边框各 1px
  return textWidth + horizontalPadding + borderWidth;
}
