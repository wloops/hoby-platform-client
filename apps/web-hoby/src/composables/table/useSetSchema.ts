import type { VxeGridPropTypes } from 'vxe-table';

import type { ColumnDefinition } from '#/components/CommonTable/types';

import { mainGetViewFieldConfigApi } from '#/api';
import { FieldType } from '#/components/CommonTable/types';
import { useEnums } from '#/composables';

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
  ): VxeSchemaItem[] => {
    const schema = columnConfigs
      .filter((config) => config.searchable === true)
      .map((config) => {
        const { getEnumList } = useEnums(); // 避免顶层调用,改为在函数内部调用;
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
        if (
          config.type === FieldType.SELECT &&
          config.enumName &&
          getEnumList(config.enumName)
        ) {
          schemaItem.componentProps = {
            options: getEnumList(config.enumName) as any[],
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

        return schemaItem;
      });
    return schema;
  };

  /**
   * 将自定义列配置转换为 VxeTable 的 columns 格式
   * @param columnConfigs - 列配置数组
   * @returns VxeTable columns 配置
   */
  const generateColumns = (
    columnConfigs: ColumnDefinition[],
  ): VxeGridPropTypes.Columns => {
    return columnConfigs
      .filter((config) => config.visible)
      .map((config) => {
        const column: any = {
          field: config.dataIndex,
          title: config.title,
        };

        // 处理宽度
        if (config.width) {
          column.width = config.width;
        }

        // 处理对齐方式
        if (config.align) {
          column.align = config.align;
        }

        // 处理固定列
        if (config.fixed) {
          column.fixed = config.fixed;
        }

        // 处理省略
        if (config.ellipsis) {
          column.showOverflow = 'ellipsis';
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
          column.slots = { default: 'tag' };

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
  };

  /**
   * 根据字段类型获取对应的组件类型
   * @param type - 字段类型
   * @returns 组件类型
   */
  const getComponentByType = (type: FieldType): string => {
    const typeMap: Record<string, string> = {
      [FieldType.STRING]: 'Input',
      [FieldType.NUMBER]: 'InputNumber',
      [FieldType.SELECT]: 'Select',
      [FieldType.DATE]: 'DatePicker',
      [FieldType.DATETIME]: 'DatePicker',
      [FieldType.CHECKBOX]: 'Checkbox',
      [FieldType.SWITCH]: 'Switch',
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
    pageID: string,
  ): Promise<ColumnDefinition[]> => {
    const { rs, fieldList, displayFldList, pkFldList } =
      await mainGetViewFieldConfigApi({ pageID });

    if (rs !== '1' || !fieldList || !Array.isArray(fieldList)) {
      return operationColumn || [];
    }

    // 将字符串转换为数组
    const displayFields = displayFldList ? displayFldList.split(',') : [];
    const pkFields = pkFldList ? pkFldList.split(',') : [];

    // 将 fieldList 转换为 ColumnDefinition[]
    const columns: ColumnDefinition[] = fieldList.map((field) => {
      // 判断字段是否可见
      const visible = displayFields.includes(field.fieldName);

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
          fieldType = FieldType.STRING; // 时间类型，如果没有特定的类型则使用字符串
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
        searchable: visible, // 默认可搜索
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

      // 根据字段类型设置其他属性
      if (fieldType === FieldType.DATE || fieldType === FieldType.DATETIME) {
        column.width = 180; // 日期类型宽度设置大一些
      } else if (fieldType === FieldType.NUMBER) {
        column.width = 100; // 数字类型宽度适中
        column.align = 'right'; // 数字类型右对齐
      }

      return column;
    });

    // 添加操作列
    if (operationColumn && operationColumn.length > 0) {
      columns.push(...operationColumn);
    }

    return columns;
  };

  return {
    generateSchema,
    generateColumns,
    getViewSchema,
  };
}
