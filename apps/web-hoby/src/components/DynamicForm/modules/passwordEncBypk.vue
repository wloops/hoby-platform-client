<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-04-09 14:14:59
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-04-10 13:39:01
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\components\DynamicForm\modules\passwordEncBypk.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { InputPassword } from 'ant-design-vue';

import { getPKApi } from '#/api';
// import { encryption } from '#/composables';

const modelValue = defineModel<string>({
  default: () => '',
});
const pkKey = ref('');
onMounted(async () => {
  const { pkkey: pk } = await getPKApi();
  pkKey.value = pk;
});
const showModelValue = ref('');
const handChange = async () => {
  // const encryptedPassword = encryption(pkKey.value, showModelValue.value);
  modelValue.value = showModelValue.value;
  // modelValue.value = processCipherText(encryptedPassword);
};
</script>

<template>
  <div>
    <InputPassword
      v-model:value="showModelValue"
      show-count
      allow-clear
      @change="handChange"
    />
  </div>
</template>

<style scoped></style>
