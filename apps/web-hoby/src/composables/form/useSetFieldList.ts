import type { VbenFormSchema } from '#/adapter/form';

import { markRaw, ref } from 'vue';

import { useUserStore } from '@vben/stores';

import { getAreaApi } from '#/api';
import passwordEncBypk from '#/components/DynamicForm/modules/passwordEncBypk.vue';
import Transfer from '#/components/DynamicForm/modules/Transfer.vue';
import { parseQueryString } from '#/components/DynamicForm/modules/utils';
import { useApiSelectProps } from '#/composables/form/useApiSelectProps';
import { useFormStore } from '#/store';

const recordRef = ref({});
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
    pkFldList: string,
  ): VbenFormSchema[] => {
    if (!sourceData || !Array.isArray(sourceData)) {
      return [];
    }
    const pkFields = pkFldList ? pkFldList.split(',') : [];
    // 如果record为空
    let isAdd = false;
    if (Object.keys(record).length === 0) {
      isAdd = true;
    }
    sourceData.forEach((item) => {
      if (!record[item.fieldName]) {
        record[item.fieldName] = '';
      }
    });

    const formStore = useFormStore();
    recordRef.value = record;
    const afterSourceData = sourceData.map((item) => {
      const { selectApi, extractName, params, afterFetch } = useApiSelectProps(
        item,
        record,
      );

      const condition = parseQueryString(item.value, ['default']);

      const formItem: VbenFormSchema = {
        fieldName: item.fieldName,
        label: item.displayName,
        component: 'Input', // 默认组件类型
        componentProps: {
          placeholder: `请输入${item.displayName}`,
        },
      };

      // 附加默认占位符
      formItem.componentProps = {
        ...formItem.componentProps,
        placeholder: item.value.includes('auto')
          ? ' '
          : `请输入${item.displayName}`,
      };

      // 添加验证规则
      if (
        item.valueConstraint === 'notnull' ||
        (!isAdd && pkFields.includes(item.fieldName))
        // (item.otherProperties?.checkClass &&
        //   item.otherProperties.checkClass.includes('required'))
      ) {
        formItem.rules = 'required';
      }

      // 处理默认值 start
      // item.value 里面有this.xxx 默认值就取record[xxx],然后设置为不可修改
      if (item.value.includes('this.')) {
        const field = item.value.split('this.')[1].split(',')[0];
        formItem.defaultValue = record[field] || '';
      }
      if (item.value.includes('active.')) {
        const userStore = useUserStore();
        const actionMap: any = {
          tellerName: userStore.userInfo?.TELLERNAME,
          tellerNo: userStore.userInfo?.memberID,
          tellerCompanyName: userStore.userInfo?.TELLERCOMPANY,
        };
        const field = item.value.split('active.')[1].split(',')[0];

        formItem.defaultValue = actionMap[field] || '';
      }
      if (isAdd) {
        if (item.value.includes('auto') || item.visible) {
          formItem.dependencies = {
            show: () => false,
            triggerFields: Object.keys(record),
          };
        }
        // 新增窗口表单域自动赋缺省值
        if (condition?.default) {
          formItem.defaultValue = condition.default;
        }
        if (item?.default) {
          formItem.defaultValue = item.default;
        }
      } else {
        // 记录带入的默认值优先级最高
        if (record[item.fieldName]) {
          formItem.defaultValue = record[item.fieldName] || '';
        }
      }
      // 处理默认值 end

      // const fieldType = (item.value && item.value.split('::')[0]) || '';
      const fieldType = item.useType ?? getFieldType(item.value);

      // 根据字段类型和属性设置相应的组件类型
      switch (fieldType) {
        // case 'boolean': {
        //   formItem.component = 'Switch';
        //   break;
        // }
        case 'date': {
          formItem.component = 'DatePicker';
          formItem.componentProps = {
            ...formItem.componentProps,
            valueFormat: 'YYYYMMDD',
          };
          break;
        }
        case 'datetime': {
          formItem.component = 'DatePicker';
          formItem.componentProps = {
            ...formItem.componentProps,
            showTime: true,
            format: 'YYYY-MM-DD HH:mm:ss',
            valueFormat: 'YYYYMMDDHHmmss',
          };
          break;
        }
        case 'enum': {
          formItem.component = 'ApiSelect';
          formItem.componentProps = {
            placeholder: `请选择${item.displayName}`,
            api: selectApi,
            params,
            afterFetch: (data: any) => {
              return data.data.enumValues;
            },
          };
          break;
        }
        case 'form': {
          formItem.component = markRaw(Transfer);
          // formItem.component = 'ApiTransfer';
          formItem.componentProps = {
            placeholder: `请选择${item.displayName}`,
            api: selectApi,
            params,
            beforeFetch: (params: any) => {
              return (params = {
                ...params,
                ...recordRef.value,
              });
              // console.log(recordRef.value, params);
            },
            afterFetch: (data: any) => {
              return afterFetch(
                'form',
                data,
                extractName,
                record[item.fieldName],
              );
            },
            alwaysLoad: true,
          };
          formItem.dependencies = {
            triggerFields: formStore.setTriggerFields(record),
            // trigger(values, form) {
            trigger(values) {
              formStore.setFormValues(values);
              recordRef.value = values;
            },
          };

          break;
        }
        case 'passwordEncBypk': {
          // formItem.component = 'InputPassword';
          formItem.component = markRaw(passwordEncBypk);
          break;
        }
        case 'query': {
          formItem.component = 'ApiSelect'; // 假设有一个查询组件
          // formItem.component = markRaw(ApiSelectInput); // 假设有一个查询组件
          formItem.componentProps = {
            placeholder: `请选择${item.displayName}`,
            api: selectApi,
            params,
            beforeFetch: (params: any) => {
              return (params = {
                ...params,
                ...recordRef.value,
              });
            },
            afterFetch: (data: any) => {
              return afterFetch('query', data, extractName);
            },
            alwaysLoad: true,
          };
          formItem.dependencies = {
            triggerFields: Object.keys(record),
            // trigger(values, form) {
            trigger(values) {
              recordRef.value = values;
            },
          };
          formItem.modelPropName = 'value';
          break;
        }
        case 'queryArea': {
          formItem.component = 'ApiSelect';
          formItem.componentProps = {
            placeholder: `请选择${item.displayName}`,
            api: getAreaApi,
            params: {
              condition: item.value,
            },
            beforeFetch: (params: any) => {
              return (params = {
                ...params,
                ...recordRef.value,
              });
            },
            afterFetch: (data: { code: string; name: string }[]) => {
              return data.map((item: any) => ({
                label: item.name,
                value: item.name,
              }));
            },
            alwaysLoad: true,
          };
          formItem.dependencies = {
            triggerFields: Object.keys(record),
            // trigger(values, form) {
            trigger(values) {
              recordRef.value = values;
            },
          };
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
        case 'time': {
          formItem.component = 'TimePicker';
          formItem.componentProps = {
            ...formItem.componentProps,
            valueFormat: 'HHmmss',
          };
          break;
        }

        default: {
          formItem.component = 'Input';
        }
      }

      // 附加原始参数
      formItem.componentProps = {
        ...formItem.componentProps,
        disabled:
          formItem.componentProps.disabled ??
          (item.value.includes('auto') ||
            item.value.includes('this.') ||
            item.value.includes('active.') ||
            (!isAdd && pkFields.includes(item.fieldName))),
        placeholder: item.value.includes('auto')
          ? ' '
          : `请输入${item.displayName}`,
        sourceData: item,
        record: recordRef.value,
      };

      return formItem;
    });
    // 添加一个默认隐藏域
    // const hideFieldByForm: VbenFormSchema = {
    //   fieldName: 'hideFieldByForm',
    //   label: 'hideFieldByForm',
    //   component: 'Input',
    //   dependencies: {
    //     triggerFields: Object.keys(record),
    //     trigger(values, form) {
    //       console.log(values, form);
    //     },
    //     show(values) {
    //       return false;
    //     },
    //   },
    // };
    // afterSourceData.push(hideFieldByForm);

    return afterSourceData;
  };

  return {
    convertToFormSchema,
  };
}

function getFieldType(value: string) {
  let fieldType = '';
  if (value) {
    if (value.startsWith('date::') || value.includes('^F^d^')) {
      fieldType = 'date';
    } else if (value.startsWith('datetime::') || value.includes('^F^dt^')) {
      fieldType = 'datetime';
    } else if (value.includes('^F^t^')) {
      fieldType = 'time'; // 时间类型，如果没有特定的类型则使用字符串
      // eslint-disable-next-line regexp/no-unused-capturing-group
    } else if (/\.?enum[.:]{1,2}([^,]+)/.test(value)) {
      fieldType = 'enum';

      // // 提取枚举名称
      // // 匹配 `enum.xxx` 或 `enum::xxx` 格式
      // const enumMatch = value.match(/\.?enum[.:]{1,2}([^,]+)/);

      // if (enumMatch && enumMatch[1]) {
      //   (field as any).enumName = enumMatch[1].trim(); // 去除可能的空格;
      // }
    } else if (value.startsWith('multirow::')) {
      fieldType = 'input';
    } else if (value.startsWith('query::')) {
      fieldType = 'query';
    } else if (value.startsWith('form::')) {
      fieldType = 'form';
    } else if (value.startsWith('readOnly::')) {
      fieldType = 'readOnly';
    } else if (value.startsWith('queryArea::')) {
      fieldType = 'queryArea';
    }
  }
  return fieldType;
}

export default useSetFieldList;
