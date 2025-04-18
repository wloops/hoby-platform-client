import type { VbenFormSchema } from '#/adapter/form';

import { markRaw, ref } from 'vue';

import { z } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { getAreaApi } from '#/api';
import Transfer from '#/components/DynamicForm/modules/Transfer.vue';
import { parseQueryString } from '#/components/DynamicForm/modules/utils';
import { useApiSelectProps, useMacroValue } from '#/composables';
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
    originParams: Record<string, any>,
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
        // if (record[field]) {
        formItem.componentProps.disabled = true;
        // }
      }
      if (item.value.includes('active.')) {
        const userStore = useUserStore();
        const actionMap: any = {
          tellerName: userStore.userInfo?.TELLERNAME,
          tellerNo: userStore.userInfo?.memberID,
          tellerCompanyName: userStore.userInfo?.TELLERCOMPANY,
        };
        const field = item.value.split('active.')[1].split(',')[0];

        formItem.defaultValue =
          userStore?.userInfo?.[field] ?? (actionMap[field] || '');
        formItem.componentProps.disabled = true;
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

      // 按钮定义的默认取值
      const { getValueByMacro } = useMacroValue({
        currentFormData: recordRef.value,
        entryRecordData: record,
      });
      // 查找当前宏定义的值
      const currentParams = originParams.interBtnReqVarValueGrp
        ? originParams.interBtnReqVarValueGrp.find(
            (field: any) => field.fieldName === item.fieldName,
          )
        : null;
      if (currentParams) {
        const macroValue = getValueByMacro(
          currentParams.methodID,
          currentParams.fieldName,
          currentParams.methodVar,
        );
        formItem.defaultValue = macroValue;
        formItem.componentProps.disabled = true;
      }

      if (item.value.includes('default::')) {
        formItem.defaultValue = item.value.split('::')[1].split(',')[0];
      }
      // 处理默认值 end

      // const fieldType = (item.value && item.value.split('::')[0]) || '';
      const fieldType = item.useType ?? getFieldType(item.value);
      if (fieldType) formItem.componentProps.fieldType = fieldType;
      // 根据字段类型和属性设置相应的组件类型
      switch (fieldType) {
        case 'confirmPassword': {
          formItem.component = 'InputPassword';
          formItem.dependencies = {
            rules(values) {
              const password = values[item.value];
              return z
                .string({ required_error: '请输入确认密码' })
                .min(1, { message: '请输入确认密码' })
                .refine((value) => value === password, {
                  message: '两次输入的密码不一致',
                });
            },
            triggerFields: [item.value],
          };

          break;
        }
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
        case 'oldPassword': {
          formItem.component = 'InputPassword';
          // formItem.component = markRaw(passwordEncBypk);
          break;
        }
        case 'passwordEncBypk': {
          formItem.component = 'InputPassword';
          // formItem.component = markRaw(passwordEncBypk);
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
            //   item.value.includes('this.') ||
            //   item.value.includes('active.') ||
            //   (!isAdd && pkFields.includes(item.fieldName))),
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
    addConfirmPasswordFields,
  };
}

function getFieldType(value: string) {
  let fieldType = '';
  // 默认
  if (value.includes('::')) {
    fieldType = value.split('::')[0] ?? '';
  }
  // 特殊处理类型
  if (value) {
    if (value.includes('^F^d^')) {
      fieldType = 'date';
    } else if (value.includes('^F^dt^')) {
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
    }
  }
  return fieldType;
}

interface FieldItem {
  fieldName: string;
  displayName: string;
  useType: string;
  value: string;
  [key: string]: any; // 其他可能的属性
}

function addConfirmPasswordFields(fields: FieldItem[]): FieldItem[] {
  const result: FieldItem[] = [];

  for (const field of fields) {
    result.push(field);

    // 检查是否需要添加确认密码
    if (
      field.useType === 'passwordEncBypk' ||
      (field.value && field.value.includes('passwordEncBypk::'))
    ) {
      const confirmField: FieldItem = {
        fieldName: `${field.fieldName}_confirm`,
        displayName: `确认${field.displayName}`,
        useType: 'confirmPassword',
        value: field.fieldName,
        valueConstraint: 'confirmPassword',
      };

      // 复制其他属性（如 valueConstraint）
      for (const key in field) {
        if (
          key !== 'fieldName' &&
          key !== 'displayName' &&
          !Object.prototype.hasOwnProperty.call(confirmField, key)
        ) {
          confirmField[key] = field[key];
        }
      }

      result.push(confirmField);
    }
  }

  return result;
}

export default useSetFieldList;
