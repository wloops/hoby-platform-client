<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-03 21:58:41
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-11 17:59:11
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\views\_core\test\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script lang="ts" setup>
import { Button } from 'ant-design-vue';

import { getCommonData } from '#/api/core/main';

defineOptions({ name: 'Test' });
const data = {
  pageID: 'mySaleOrderForRestockingPage',
  pageDataGrpID: 'mySaleOrderForRestocking',
  TELLERCOMPANY: '测试仓商',
};
const handleClick = () => {
  getCommonData(data).then((res) => {
    console.warn(res);
  });
};
</script>

<template>
  <!-- <About /> -->
  <div>
    <h1>测试页面</h1>
    <div class="mt-10 flex justify-center">
      <Button type="primary" @click="handleClick">send</Button>
    </div>
  </div>
</template>
