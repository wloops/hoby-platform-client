<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-04-09 14:14:59
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-04-09 20:48:47
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\components\DynamicForm\modules\passwordEncBypk.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { InputPassword } from 'ant-design-vue';

import { getPKApi } from '#/api';
import { encryption } from '#/composables';

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
  const encryptedPassword = encryption(pkKey.value, showModelValue.value);
  modelValue.value = processCipherText(encryptedPassword);
};

function decodeBase64(base64String: string): Uint8Array {
  const binaryString = atob(base64String);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    // eslint-disable-next-line unicorn/prefer-code-point
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function byte2hex(bytes: Uint8Array): string {
  let hexStr = '';
  for (const byte of bytes) {
    // eslint-disable-next-line unicorn/number-literal-case
    const hex = (byte & 0xff).toString(16);
    // Pad with leading zero if needed
    hexStr += hex.length === 1 ? `0${hex}` : hex;
  }
  return hexStr;
}

// 主函数 - 等同于 Java 的调用
function processCipherText(cipherText: string): string {
  const decodedBytes = decodeBase64(cipherText);
  return byte2hex(decodedBytes).toUpperCase();
}
</script>

<template>
  <div>
    <InputPassword
      v-model:model-value="showModelValue"
      show-count
      allow-clear
      @change="handChange"
    />
  </div>
</template>

<style scoped></style>
