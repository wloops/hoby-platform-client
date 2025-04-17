<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-23 15:34:10
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-04-17 17:51:36
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\views\_core\home\layout\Footer.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%A
-->
<script setup lang="ts">
import { preferences } from '@vben/preferences';

import copyright from './copyright.vue';

interface Props {
  companyName: string;
  companySiteLink?: string;
  date: string;
  icp?: string;
  icpLink?: string;
}

const data: Props = {
  companyName: preferences.copyright.companyName,
  companySiteLink: preferences.copyright.companySiteLink,
  date: preferences.copyright.date,
  icp: preferences.copyright.icp,
  icpLink: preferences.copyright.icpLink,
};
</script>

<template>
  <!-- 底部信息 -->
  <footer class="mt-10 border-t py-8 text-center text-gray-500">
    <div class="mb-6 flex justify-center space-x-12">
      <a href="#" class="transition-colors hover:text-blue-500">关于我们</a>
      <a href="#" class="transition-colors hover:text-blue-500">帮助中心</a>
      <a href="#" class="transition-colors hover:text-blue-500">联系客服</a>
      <a href="#" class="transition-colors hover:text-blue-500">隐私政策</a>
    </div>
    <p>
      <copyright v-bind="data" />
    </p>
  </footer>
</template>
