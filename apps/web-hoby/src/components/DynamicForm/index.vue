<script setup lang="ts">
import type { Mode } from './types';

import type { VbenFormProps } from '#/adapter/form';

import { ref } from 'vue';

import { useVbenDrawer, useVbenModal } from '@vben/common-ui';

import { mainGetViewFieldConfigApi } from '#/api';
import { useSetFieldList } from '#/composables';

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
  pageId: {
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

const getSchema = async () => {
  const { convertToFormSchema } = useSetFieldList();
  // 假设从API获取的原始字段数据
  const res = await mainGetViewFieldConfigApi({
    pageID: props.pageId,
  });

  const originalFields = res.fieldList;

  // 转换为表单结构
  const formSchema = convertToFormSchema(originalFields);
  // console.log('formSchema', formSchema);
  schema.value = formSchema;
};

getSchema();

const confirm = () => {
  if (props.mode === 'drawer') {
    // console.log('onConfirm', drawerApi.getData().getValues());
    drawerApi.getData().validateAndSubmitForm();
  } else if (props.mode === 'modal') {
    modalApi.getData().validateAndSubmitForm();
  }
};

// 抽屉表单
const [Drawer, drawerApi] = useVbenDrawer({
  // 连接抽离的组件
  connectedComponent: DrawerForm,
  onConfirm: confirm,
});

const [Modal, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: ModalForm,
  onConfirm: confirm,
});

function open() {
  switch (props.mode) {
    case 'auto': {
      // 自动
      if (window.innerWidth < 768) {
        drawerApi.open();
      } else {
        modalApi.open();
      }

      break;
    }
    case 'drawer': {
      drawerApi.open();

      break;
    }
    case 'modal': {
      modalApi.open();

      break;
    }
    case 'use': {
      break;
    }
    default: {
      // 默认
      drawerApi.open();
    }
  }
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
