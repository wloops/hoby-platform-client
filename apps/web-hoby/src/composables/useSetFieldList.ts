import type { VbenFormSchema } from '#/adapter/form';

import { markRaw } from 'vue';

import ApiSelectInput from '#/components/DynamicForm/modules/ApiSelect.vue';
import Transfer from '#/components/DynamicForm/modules/Transfer.vue';
/**
 * 用于将后端字段列表转换为表单结构的 hooks
 * @returns 提供字段列表转换功能的对象
 */
export function useSetFieldList() {
  /**
   * 将原始字段数据转换为表单结构
   * @param sourceData 原始数据数组
   * @returns 表单结构数组
   */
  const convertToFormSchema = (
    sourceData: any[],
    record: Record<string, any>,
  ): VbenFormSchema[] => {
    if (!sourceData || !Array.isArray(sourceData)) {
      return [];
    }

    return sourceData.map((item) => {
      const formItem: VbenFormSchema = {
        fieldName: item.fieldName,
        label: item.displayName,
        component: 'Input', // 默认组件类型
        componentProps: {
          placeholder: `请输入${item.displayName}`,
        },
      };

      // 添加验证规则
      if (
        item.valueConstraint === 'notnull'
        // ||
        // (item.otherProperties?.checkClass &&
        //   item.otherProperties.checkClass.includes('required'))
      ) {
        formItem.rules = 'required';
      }

      // 处理默认值
      if (record && record[item.fieldName]) {
        formItem.defaultValue = record[item.fieldName];
      }

      const fieldType = (item.value && item.value.split('::')[0]) || '';
      // 根据字段类型和属性设置相应的组件类型
      switch (fieldType) {
        case 'form': {
          formItem.component = markRaw(Transfer);

          break;
        }
        case 'query': {
          // formItem.component = 'ApiSelect'; // 假设有一个查询组件
          formItem.component = markRaw(ApiSelectInput); // 假设有一个查询组件
          formItem.componentProps = {
            placeholder: `请选择${item.displayName}`,
          };
          formItem.modelPropName = 'value';
          break;
        }
        case 'readOnly': {
          formItem.component = 'Input';
          formItem.componentProps = {
            ...formItem.componentProps,
            disabled: true,
          };

          break;
        }
        default: {
          // 根据数据类型设置不同的组件
          switch (item.type) {
            case 'boolean': {
              formItem.component = 'Switch';
              break;
            }
            case 'date': {
              formItem.component = 'DatePicker';
              break;
            }
            case 'datetime': {
              formItem.component = 'DatePicker';
              formItem.componentProps = {
                ...formItem.componentProps,
                showTime: true,
              };
              break;
            }
            case 'float':
            case 'int':
            case 'number': {
              formItem.component = 'InputNumber';
              break;
            }
            default: {
              formItem.component = 'Input';
            }
          }
        }
      }

      // 附加原始参数
      formItem.componentProps = {
        ...formItem.componentProps,
        sourceData: item,
        record,
      };

      return formItem;
    });
  };

  return {
    convertToFormSchema,
  };
}

export default useSetFieldList;
