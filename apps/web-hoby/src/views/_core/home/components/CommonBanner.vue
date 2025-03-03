<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-02-28 10:29:19
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-03 10:10:19
 * @FilePath: \HOBY-platform\app\components\common\Banner.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup>
import { ref } from 'vue';

const bannerList = ref([
  {
    title: '夏季新品上市',
    description: '精选全球时尚单品，为您的夏日搭配增添独特魅力',
    image: '/images/banner1.jpg',
  },
  {
    title: '品质生活',
    description: '用心挑选每一件商品，让生活更有品质',
    image: '/images/banner2.jpg',
  },
  {
    title: '限时特惠',
    description: '多重优惠等你来，心动不如行动',
    image: '/images/banner3.jpg',
  },
]);
</script>

<template>
  <div class="mb-0 mt-6 h-[280px] w-full">
    <div class="mx-auto max-w-5xl px-6">
      <a-carousel class="h-[280px] overflow-hidden rounded-2xl" autoplay>
        <template v-for="item in bannerList" :key="item.title">
          <div class="group relative h-[280px] overflow-hidden rounded-2xl">
            <!-- <div class="absolute inset-0">
              <img :src="item.image" class="h-full w-full object-cover" :alt="item.title">
            </div> -->
            <div
              class="absolute inset-0 flex items-center bg-gradient-to-r from-purple-900/50 to-transparent"
            >
              <div class="space-y-4 px-12">
                <h1 class="text-4xl font-bold text-white">
                  {{ item.title }}
                </h1>
                <p class="max-w-md text-gray-200">
                  {{ item.description }}
                </p>
                <button
                  class="rounded-full bg-white px-6 py-3 font-medium text-purple-600 transition-colors hover:bg-purple-600 hover:text-white"
                >
                  立即探索
                </button>
              </div>
            </div>
          </div>
        </template>
      </a-carousel>
    </div>
  </div>
</template>
