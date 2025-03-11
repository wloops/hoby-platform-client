<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-10 16:38:02
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-10 17:41:10
-->
<script setup lang="ts">
import type { UploadProps } from 'ant-design-vue';

import { UploadOutlined } from '@ant-design/icons-vue';
import { Button, Form, Input, Upload } from 'ant-design-vue';

type FormState = {
  businessAddress: string;
  businessLicense: string;
  businessScope: string;
  companyName: string;
  contactPhone: string;
  legalPerson: string;
};

const props = defineProps<{
  formState: FormState;
}>();

const emit = defineEmits(['next', 'update:formState']);

const updateFormState = (field: keyof FormState, value: string) => {
  emit('update:formState', { ...props.formState, [field]: value });
};

const formItems = [
  {
    field: 'companyName' as keyof FormState,
    label: '企业名称',
    component: Input,
    props: {
      placeholder: '请输入企业名称',
    },
  },
  {
    field: 'businessLicense' as keyof FormState,
    label: '营业执照',
    component: 'upload',
    props: {
      name: 'file',
      action: '/api/upload',
      headers: {
        authorization: 'authorization-text',
      },
      listType: 'picture' as UploadProps['listType'],
      onChange: (info: any) => {
        if (info.file.status !== 'uploading') {
          console.warn('上传中...', info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          console.warn(`${info.file.name} 文件上传成功`);
          updateFormState('businessLicense', info.file.response?.url || '');
        } else if (info.file.status === 'error') {
          console.warn(`${info.file.name} 文件上传失败`);
        }
      },
    },
  },
  {
    field: 'legalPerson' as keyof FormState,
    label: '法人姓名',
    component: Input,
    props: {
      placeholder: '请输入法人姓名',
    },
  },
  {
    field: 'contactPhone' as keyof FormState,
    label: '联系电话',
    component: Input,
    props: {
      placeholder: '请输入联系电话',
    },
  },
  {
    field: 'businessAddress' as keyof FormState,
    label: '经营地址',
    component: Input,
    props: {
      placeholder: '请输入经营地址',
    },
  },
  {
    field: 'businessScope' as keyof FormState,
    label: '经营范围',
    component: Input.TextArea,
    props: {
      placeholder: '请输入经营范围',
      rows: 4,
    },
  },
];
</script>

<template>
  <div class="step-content">
    <Form :model="formState" layout="vertical" class="company-form">
      <template v-for="item in formItems" :key="item.field">
        <Form.Item :label="item.label" required>
          <template v-if="item.component === 'upload'">
            <Upload v-bind="item.props">
              <Button> <UploadOutlined /> 上传营业执照 </Button>
            </Upload>
          </template>
          <component
            v-else
            :is="item.component"
            :value="formState[item.field]"
            @update:value="(val: string) => updateFormState(item.field, val)"
            v-bind="item.props"
          />
        </Form.Item>
      </template>

      <Form.Item>
        <div class="flex justify-end">
          <Button type="primary" @click="emit('next')"> 下一步 </Button>
        </div>
      </Form.Item>
    </Form>
  </div>
</template>

<style scoped>
.step-content {
  padding: 24px;
  background: #fff;
  border-radius: 8px;
}

.company-form {
  max-width: 100%;
}
</style>
