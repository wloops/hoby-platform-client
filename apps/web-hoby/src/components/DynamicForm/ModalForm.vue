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
      layout: 'horizontal',
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
