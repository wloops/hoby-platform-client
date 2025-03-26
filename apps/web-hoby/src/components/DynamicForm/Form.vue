<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-25 14:53:24
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-25 17:49:24
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\components\DynamicForm\Form.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script lang="ts" setup>
import type { VbenFormProps, VbenFormSchema } from '#/adapter/form';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';

const props = defineProps({
  formConfig: {
    default: () => ({
      layout: 'horizontal',
    }),
    type: Object as () => VbenFormProps,
  },
  schema: {
    default: () => [],
    type: Array as () => VbenFormSchema[],
  },
});

const [BaseForm, formApi] = useVbenForm({
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
  },
  // 提交函数
  handleSubmit: onSubmit,
  // 垂直布局，label和input在不同行，值为vertical
  // 水平布局，label和input在同一行
  layout: props.formConfig.layout,
  schema: props.schema,
  wrapperClass: 'grid-cols-1',
});

function onSubmit(values: Record<string, any>) {
  message.success({
    content: `form values: ${JSON.stringify(values)}`,
  });
  // formApi.validateAndSubmitForm();
}

const returnFormApi = () => {
  return formApi;
};

defineExpose({
  returnFormApi,
});
</script>

<template>
  <BaseForm />
</template>
