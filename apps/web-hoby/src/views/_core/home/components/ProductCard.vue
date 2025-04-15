<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-04-14 16:35:23
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-04-14 16:56:10
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\views\_core\home\components\ProductCard.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script lang="ts" setup>
import {
  EyeOutlined,
  HeartOutlined,
  PictureOutlined,
} from '@ant-design/icons-vue';
import { Button, Tag } from 'ant-design-vue';

defineProps<{
  product: {
    id: number;
    image: string;
    name: string;
    price?: string;
    tag?: string;
  };
}>();

const getTagColor = (tag: string) => {
  const colorMap: Record<string, string> = {
    热销: 'red',
    新品: 'green',
    促销: 'orange',
    限时: 'blue',
  };

  return colorMap[tag] || 'blue';
};
</script>

<template>
  <div
    class="group relative overflow-hidden rounded-lg bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
  >
    <div class="absolute right-0 top-0 z-10 m-2">
      <Tag v-if="product.tag" :color="getTagColor(product.tag)">
        {{ product.tag }}
      </Tag>
    </div>
    <div class="relative p-3">
      <div
        class="mb-2 flex h-36 items-center justify-center overflow-hidden rounded-lg bg-gray-100"
      >
        <template v-if="product.image">
          <img
            :src="product.image"
            :alt="product.name"
            class="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </template>
        <template v-else>
          <div class="flex flex-col items-center justify-center text-gray-300">
            <PictureOutlined style="font-size: 2rem" />
            <span class="mt-2 text-xs">暂无图片</span>
          </div>
        </template>
      </div>
      <div class="text-center">
        <div class="truncate text-sm font-medium text-gray-800">
          {{ product.name }}
        </div>

        <!-- 操作按钮 - 仅在悬停时显示 -->
        <div
          class="mt-2 flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100"
        >
          <Button type="primary" size="small" shape="circle">
            <EyeOutlined />
          </Button>
          <Button size="small" shape="circle">
            <HeartOutlined />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
