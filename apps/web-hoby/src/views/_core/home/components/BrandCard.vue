<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-04-16 00:02:41
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-04-16 15:56:48
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\views\_core\home\components\BrandCard.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script lang="ts" setup>
import { ShopOutlined } from '@ant-design/icons-vue';

defineProps<{
  brand: {
    id: number;
    logo: string;
    name: string;
  };
}>();
</script>

<template>
  <div
    class="group cursor-pointer overflow-hidden rounded-lg bg-white transition-all hover:-translate-y-1 hover:shadow-md"
  >
    <div class="flex flex-col items-center p-4">
      <div
        class="mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 bg-white"
      >
        <template v-if="brand.logo">
          <img
            :src="brand.logo"
            :alt="brand.name"
            class="h-full w-full scale-105 object-cover transition-transform group-hover:scale-110"
          />
        </template>
        <template v-else>
          <div class="flex items-center justify-center text-gray-300">
            <ShopOutlined style="font-size: 1.5rem" />
          </div>
        </template>
      </div>
      <div class="text-center">
        <div class="font-medium text-gray-800">{{ brand.name }}</div>
      </div>
    </div>
  </div>
</template>
