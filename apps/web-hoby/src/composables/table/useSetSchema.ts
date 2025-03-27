import type { VxeGridPropTypes } from 'vxe-table';

import type { ColumnDefinition } from '#/components/CommonTable/types';

import dayjs from 'dayjs';

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
    return columnConfigs
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

        // 根据字段类型设置默认值
        if (
          config.type === FieldType.DATE ||
          config.type === FieldType.DATETIME
        ) {
          // 对于日期范围，需要另外判断组件类型
          schemaItem.defaultValue =
            schemaItem.component === 'RangePicker'
              ? [dayjs().subtract(7, 'days'), dayjs()]
              : dayjs();
        }

        return schemaItem;
      });
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
      [FieldType.DATETIME]: 'DateTimePicker',
      [FieldType.CHECKBOX]: 'Checkbox',
      [FieldType.SWITCH]: 'Switch',
      // 添加其他需要的映射...
    };

    return typeMap[type] || 'Input';
  };

  return {
    generateSchema,
    generateColumns,
  };
}
