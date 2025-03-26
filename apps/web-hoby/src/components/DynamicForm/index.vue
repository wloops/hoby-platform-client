<script setup lang="ts">
import type { Mode } from './types';

import type { VbenFormProps, VbenFormSchema } from '#/adapter/form';

import { ref } from 'vue';

import { useVbenDrawer, useVbenModal } from '@vben/common-ui';

import { useSetFieldList } from '#/composables';

import DrawerForm from './DrawerForm.vue';
import ModalForm from './ModalForm.vue';

const props = defineProps({
  // 表单模式
  mode: {
    default: 'default',
    type: String as () => Mode,
  },
  title: {
    default: '',
    type: String,
  },
  // 表单配置
  formConfig: {
    default: () => ({
      mode: 'default',
      layout: 'horizontal',
    }),
    type: Object as () => VbenFormProps,
  },
});

const schema = ref<VbenFormSchema[]>([
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

const getSchema = () => {
  const { convertToFormSchema } = useSetFieldList();
  // 假设从API获取的原始字段数据
  const originalFields = [
    {
      valueFldName: 'actCmpName',
      help: '',
      size: '128',
      fldAlais: '总仓服务商',
      otherProperties: {
        otherCon: '',
        defaultValue: '测试仓商',
        operationID: '',
        textType: 'readOnly',
        checkClass: 'required ',
        correspond: '',
        relation: '',
      },
      valueConstraint: 'notnull',
      type: 'char',
      value: '测试仓商',
    },
    {
      valueFldName: 'actName',
      help: '',
      size: '128',
      fldAlais: '业务',
      otherProperties: {
        otherCon: '',
        operationID: '',
        textType: '',
        checkClass: 'required ',
      },
      valueConstraint: 'notnull',
      type: 'char',
      value: '',
    },
    {
      valueFldName: 'saleCmpName',
      help: 'this.companyName',
      size: '128',
      fldAlais: '仓商',
      otherProperties: {
        otherCon: '',
        defaultValue: '',
        operationID: '',
        textType: 'readOnly',
        checkClass: 'required ',
      },
      valueConstraint: 'notnull',
      type: 'char',
      value: '',
    },
    {
      valueFldName: 'companyName',
      help: '',
      size: '128',
      fldAlais: '产品厂商',
      otherProperties: {
        otherCon: '',
        defaultValue: '',
        operationID: '1052',
        suggestFld: '',
        textType: 'query',
        remarkFld: 'companyName',
        operationIDForSuggest: '1051',
        checkClass: 'required ',
        readFld: 'companyName',
        correspond: '',
        fldRemark: '',
        relation: '',
      },
      valueConstraint: 'notnull',
      type: 'char',
      value: '##::-1337962494_0::##',
    },
    {
      valueFldName: 'productNameList',
      help: '',
      size: '2048',
      fldAlais: '授权产品清单',
      otherProperties: {
        otherCon: '',
        defaultValue: '',
        '##::-435975350_0::##': '1486',
        operationID: '1055',
        textType: 'form',
        operationIDForSuggest: '1054',
        checkClass: 'required ',
        readFld: 'productName',
        correspond: '',
        fldRemark: '',
        relation: '',
      },
      valueConstraint: 'notnull',
      type: 'char',
      value: '##::1822268813_0::##',
    },
    {
      valueFldName: 'prdSrlIDList',
      help: '',
      size: '4192',
      fldAlais: '授权型号清单',
      otherProperties: {
        otherCon: '',
        defaultValue: '',
        '##::-435975350_0::##': '1487',
        operationID: '1055',
        productNameList: '',
        textType: 'form',
        operationIDForSuggest: '1054',
        checkClass: 'required ',
        readFld: 'srlID',
        correspond: '',
        fldRemark: '',
        relation: '',
      },
      valueConstraint: 'notnull',
      type: 'char',
      value: '##::1502245814_0::##',
    },
  ];

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
  if (props.mode === 'drawer') {
    drawerApi.open();
  } else if (props.mode === 'modal') {
    modalApi.open();
  } else {
    // 默认
  }
}

defineExpose({
  open,
});
</script>

<template>
  <div>
    <Drawer :form-config="formConfig" :schema="schema" :title="title" />
    <Modal :form-config="formConfig" :schema="schema" :title="title" />
  </div>
</template>

<style scoped></style>
