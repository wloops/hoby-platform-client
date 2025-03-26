<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-25 14:36:54
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-26 11:54:59
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\components\DynamicForm\ModalForm.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script lang="ts" setup>
import type { VbenFormProps, VbenFormSchema } from '#/adapter/form';

import { onMounted, ref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import Form from './Form.vue';

const props = defineProps({
  title: {
    default: '',
    type: String,
  },
  formConfig: {
    default: () => ({
      layout: 'vertical',
      showDefaultActions: false,
    }),
    type: Object as () => VbenFormProps,
  },
  schema: {
    default: () => [],
    type: Array as () => VbenFormSchema[],
  },
});

const modalForm = ref<null | {
  returnFormApi: any;
}>(null);
const [Modal, modalApi] = useVbenModal();

onMounted(() => {
  watch(
    () => modalForm.value?.returnFormApi(),
    () => {
      modalApi.setData(modalForm.value?.returnFormApi());
    },
  );
});
</script>
<template>
  <Modal :title="props.title">
    <Form
      ref="modalForm"
      :form-config="props.formConfig"
      :schema="props.schema"
    />
  </Modal>
</template>
