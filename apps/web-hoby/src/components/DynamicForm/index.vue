<!-- eslint-disable array-callback-return -->
<script setup lang="ts">
import type { Mode } from './types';

import type { VbenFormProps } from '#/adapter/form';

import { ref } from 'vue';

import { useVbenDrawer, useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import {
  mainAddRecrdApi,
  mainGetViewFieldConfigApi,
  mainServiceApi,
  mainUpdateRecrdApi,
} from '#/api';
import {
  useSetButtons,
  useSetFieldList,
  useSetFieldRealValue,
} from '#/composables';

import DrawerForm from './DrawerForm.vue';
import Form from './Form.vue';
import ModalForm from './ModalForm.vue';

const props = defineProps({
  // 表单模式
  mode: {
    default: 'drawer',
    type: String as () => Mode,
  },
  title: {
    default: '',
    type: String,
  },
  // 表单配置
  formConfig: {
    default: () => ({
      layout: 'vertical', // 水平布局(horizontal)，label和input在同一行 垂直布局(vertical)，label和input在不同行
      showDefaultActions: false,
    }),
    type: Object as () => VbenFormProps,
  },
});

const emit = defineEmits(['refresh']);

const schema = ref<any>([
  {
    // 组件需要在 #/adapter.ts内注册，并加上类型
    component: 'Input',
    // 对应组件的参数
    componentProps: {
      placeholder: '请输入用户名',
    },
    // 字段名
    fieldName: 'username',
    // 界面显示的label
    label: '字符串',
  },
  {
    component: 'InputPassword',
    componentProps: {
      placeholder: '请输入密码',
    },
    fieldName: 'password',
    label: '密码',
  },
  {
    component: 'InputNumber',
    componentProps: {
      placeholder: '请输入',
    },
    fieldName: 'number',
    label: '数字(带后缀)',
    suffix: () => '¥',
    rules: 'required',
  },
  {
    component: 'Select',
    componentProps: {
      allowClear: true,
      filterOption: true,
      options: [
        {
          label: '选项1',
          value: '1',
        },
        {
          label: '选项2',
          value: '2',
        },
      ],
      placeholder: '请选择',
      showSearch: true,
    },
    fieldName: 'options',
    label: '下拉选',
  },
  {
    component: 'RadioGroup',
    componentProps: {
      options: [
        {
          label: '选项1',
          value: '1',
        },
        {
          label: '选项2',
          value: '2',
        },
      ],
    },
    fieldName: 'radioGroup',
    label: '单选组',
  },
  {
    component: 'Radio',
    fieldName: 'radio',
    label: '',
    renderComponentContent: () => {
      return {
        default: () => ['Radio'],
      };
    },
  },
  {
    component: 'CheckboxGroup',
    componentProps: {
      name: 'cname',
      options: [
        {
          label: '选项1',
          value: '1',
        },
        {
          label: '选项2',
          value: '2',
        },
      ],
    },
    fieldName: 'checkboxGroup',
    label: '多选组',
  },
  {
    component: 'Checkbox',
    fieldName: 'checkbox',
    label: '',
    renderComponentContent: () => {
      return {
        default: () => ['我已阅读并同意'],
      };
    },
  },
  {
    component: 'Mentions',
    componentProps: {
      options: [
        {
          label: 'afc163',
          value: 'afc163',
        },
        {
          label: 'zombieJ',
          value: 'zombieJ',
        },
      ],
      placeholder: '请输入',
    },
    fieldName: 'mentions',
    label: '提及',
  },
  {
    component: 'Rate',
    fieldName: 'rate',
    label: '评分',
  },
  {
    component: 'Switch',
    componentProps: {
      class: 'w-auto',
    },
    fieldName: 'switch',
    label: '开关',
  },
  {
    component: 'DatePicker',
    fieldName: 'datePicker',
    label: '日期选择框',
  },
  {
    component: 'RangePicker',
    fieldName: 'rangePicker',
    label: '范围选择器',
  },
  {
    component: 'TimePicker',
    fieldName: 'timePicker',
    label: '时间选择框',
  },
  {
    component: 'TreeSelect',
    componentProps: {
      allowClear: true,
      placeholder: '请选择',
      showSearch: true,
      treeData: [
        {
          label: 'root 1',
          value: 'root 1',
          children: [
            {
              label: 'parent 1',
              value: 'parent 1',
              children: [
                {
                  label: 'parent 1-0',
                  value: 'parent 1-0',
                  children: [
                    {
                      label: 'my leaf',
                      value: 'leaf1',
                    },
                    {
                      label: 'your leaf',
                      value: 'leaf2',
                    },
                  ],
                },
                {
                  label: 'parent 1-1',
                  value: 'parent 1-1',
                },
              ],
            },
            {
              label: 'parent 2',
              value: 'parent 2',
            },
          ],
        },
      ],
      treeNodeFilterProp: 'label',
    },
    fieldName: 'treeSelect',
    label: '树选择',
  },
]);

const getSchema = async (
  pageID: string,
  record?: Record<string, any>,
  mySchema?: any,
  originParams?: Record<string, any>,
) => {
  // console.log('drawerApi', drawerApi.getData().getValues());
  let pkFldList = '';
  let originalFields = [];
  if (mySchema && mySchema.length > 0) {
    originalFields = mySchema;
    pkFldList = mySchema
      .map((item: { fieldName: any; isPrimaryKey: any }) => {
        if (item.isPrimaryKey) {
          return item.fieldName;
        }
      })
      .join(',');
  } else {
    // 假设从API获取的原始字段数据
    const res = await mainGetViewFieldConfigApi({
      pageID,
    });

    originalFields = res.fieldList;
    pkFldList = res.pkFldList;
  }

  const { convertToFormSchema, addConfirmPasswordFields } = useSetFieldList();
  // 转换为表单结构
  const formSchema = convertToFormSchema(
    addConfirmPasswordFields(originalFields),
    submitType.value === 'add' ? ({} as any) : record,
    pkFldList,
    originParams || {},
  );
  schema.value = formSchema;
};

const confirm = async () => {
  let formAPi: any = drawerApi;
  if (props.mode === 'drawer') {
    formAPi = drawerApi;
  } else if (props.mode === 'modal') {
    formAPi = modalApi;
  }
  const form = await formAPi.getData().getValues();
  const { encryptionFormValues } = useSetFieldRealValue();
  const formValues = await encryptionFormValues(
    form,
    formAPi.getData().getState().schema,
  );
  formAPi
    .getData()
    .validate()
    .then(async (result: any) => {
      if (result.valid) {
        const code = await submitApi(formValues);
        if (code) {
          message.success('操作成功');
          formAPi.close();
          emit('refresh');
          return true;
        }
        message.error('操作失败');
      }
    });
  formAPi.getData().validateAndSubmitForm();
};

const submitApi = async (record: Record<string, any>) => {
  try {
    return await submitCommonButton(record);
  } catch (error) {
    console.error(error);
    return false;
  }
};

const submitCommonButton = async (record: Record<string, any>) => {
  try {
    if (submitType.value === 'add') {
      const addData = {
        INTERPAGEID: pageParams.value.pageID, // 页面ID
        INTERFORMDATA: JSON.stringify(record),
      };
      const { rs: code } = await mainAddRecrdApi(addData);
      return code === '1';
    } else if (submitType.value === 'edit') {
      const data = {
        INTERPAGEID: pageParams.value.pageID, // 页面ID
        INTERFORMDATA: JSON.stringify(record), // 表单数据
      };
      const { rs: code } = await mainUpdateRecrdApi(data);
      return code === '1';
    } else {
      let data = {
        ...pageParams.value,
        ...record,
      };
      if (buttonOriginParams.value) {
        data.pageID = buttonOriginParams.value.pageID;
        if (
          buttonOriginParams.value.interBtnReqVarValueGrp &&
          buttonOriginParams.value.interBtnReqVarValueGrp.length > 0
        ) {
          const { setButtonSubmitParams } = useSetButtons();
          const params = setButtonSubmitParams(
            buttonOriginParams.value.interBtnReqVarValueGrp,
            record,
            pageParams.value,
          );
          data = {
            pageID: buttonOriginParams.value.pageID,
            pageButtonID: buttonOriginParams.value.pageButtonID,
            ...params,
            ...record,
          };
        }
      }
      const { rs: code } = await mainServiceApi(data);
      return code === '1';
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

const submitType = ref<'add' | 'default' | 'edit' | 'view'>('default');
// 抽屉表单
const [Drawer, drawerApi] = useVbenDrawer({
  // 连接抽离的组件
  connectedComponent: DrawerForm,
  onConfirm: confirm,
  closeOnClickModal: false,
});

const [Modal, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: ModalForm,
  onConfirm: confirm,
  closeOnClickModal: false,
});

interface pageParam {
  pageID: string;
  pageButtonID: string;
}
const pageParams = ref<pageParam>({
  pageID: '',
  pageButtonID: '',
});
const buttonOriginParams = ref<Record<string, any> | undefined>({});

async function open(
  params: pageParam,
  record?: Record<string, any>,
  type?: 'add' | 'default' | 'edit' | 'view',
  schema?: any,
  originParams?: Record<string, any>,
) {
  pageParams.value = params;
  buttonOriginParams.value = originParams;
  submitType.value = type || 'default';
  await getSchema(params.pageID, record, schema, originParams);
  let formApi: any = drawerApi;
  switch (props.mode) {
    case 'auto': {
      // 自动
      formApi = window.innerWidth < 768 ? drawerApi : modalApi;
      break;
    }
    case 'drawer': {
      formApi.open();
      break;
    }
    case 'modal': {
      formApi = modalApi;
      break;
    }
    case 'use': {
      break;
    }
  }
  props.mode !== 'use' &&
    formApi.setState({ showConfirmButton: type !== 'view' }).open();
}

defineExpose({
  open,
});
</script>

<template>
  <div>
    <Form v-if="mode === 'use'" :form-config="formConfig" :schema="schema" />
    <Drawer
      v-if="mode === 'drawer'"
      :form-config="formConfig"
      :schema="schema"
      :title="title"
    />
    <Modal
      v-if="mode === 'modal'"
      :form-config="formConfig"
      :schema="schema"
      :title="title"
    />
  </div>
</template>

<style scoped></style>
