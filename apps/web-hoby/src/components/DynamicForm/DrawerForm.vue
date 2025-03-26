<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-25 14:31:58
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-25 17:47:32
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\components\DynamicForm\modalForm.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script lang="ts" setup>
import type { VbenFormProps, VbenFormSchema } from '#/adapter/form';

import { onMounted, ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

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
const drawerForm = ref<null | {
  returnFormApi: any;
}>(null);
const [Drawer, drawerApi] = useVbenDrawer();

onMounted(() => {
  watch(
    () => drawerForm.value?.returnFormApi(),
    () => {
      drawerApi.setData(drawerForm.value?.returnFormApi());
    },
  );
});
</script>
<template>
  <Drawer :title="props.title">
    <Form
      ref="drawerForm"
      :form-config="props.formConfig"
      :schema="props.schema"
    />
  </Drawer>
</template>
