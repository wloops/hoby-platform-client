<script setup lang="ts">
import type { BasicUserInfo } from '@vben/types';

import { computed } from 'vue';
import { useRouter } from 'vue-router';

import { useAccessStore, useUserStore } from '@vben/stores';

import { checkLoginApi } from '#/api';

import CommonBanner from './components/CommonBanner.vue';
import LayoutFooter from './layout/Footer.vue';
import LayoutHeader from './layout/Header.vue';

const userStore = useUserStore();
const router = useRouter();
const accessStore = useAccessStore();

const navigationItems = [
  {
    title: '我要进货',
    icon: 'icon-[carbon--delivery-add]',
    link: '/buyer',
    authority: ['buyer'],
  },
  {
    title: '我的店铺',
    icon: 'icon-[lucide--store]',
    link: '/shop',
    authority: ['shop'],
    // link: '/seller',
    // authority: ['seller'],
  },
  {
    title: '我的仓库',
    icon: 'icon-[lucide--warehouse]',
    link: '/warehouse',
    authority: ['warehouse'],
  },
  {
    title: '我的产品',
    icon: 'icon-[lucide--blocks]',
    link: '/products',
    authority: ['products'],
  },
  {
    title: '去逛店铺',
    icon: 'icon-[lucide--shopping-cart]',
    link: '/shopping',
    authority: ['shopping'],
  },
];

const goToMainPage = async (page: any) => {
  accessStore.setIsAccessChecked(false);
  const access: string[] = page.authority;
  const userInfo = userStore.userInfo;
  const addRolesUserInfo = {
    ...userInfo,
    roles: access,
  };
  await userStore.setUserInfo(addRolesUserInfo as BasicUserInfo);
  sessionStorage.setItem('userInfo', JSON.stringify(addRolesUserInfo));
  await router.push(page.link);
};

const isLoginExpired = computed(() => accessStore.loginExpired);
console.warn('登录是否过期', isLoginExpired.value);

const checkLogin = async () => {
  const res = await checkLoginApi();
  console.warn('res', res);
  if (res.rs === '1') {
    accessStore.setLoginExpired(false);
  } else {
    accessStore.setLoginExpired(true);
  }
};
checkLogin();

// history.replaceState({}, '');
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
    <LayoutHeader :is-login-expired="isLoginExpired" />
    <!-- 主导航栏 -->
    <!-- <HomeMainNav /> -->

    <!-- 主横幅 -->
    <CommonBanner />

    <!-- 快捷导航 -->
    <div class="mx-auto max-w-7xl px-4 py-5">
      <div class="mb-8 flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-800">快捷导航</h2>
        <!-- <button class="flex items-center text-orange-600 space-x-1 hover:text-orange-700">
          <span>查看更多</span>
          <i class="i-lucide-arrow-right h-4 w-4" />
        </button> -->
      </div>
      <div class="grid grid-cols-5 gap-6">
        <div
          v-for="item in navigationItems"
          :key="item.title"
          class="group cursor-pointer"
          @click="goToMainPage(item)"
        >
          <div
            class="relative mb-3 flex h-40 items-center justify-center overflow-hidden rounded-xl bg-white/80"
          >
            <span
              :class="item.icon"
              class="text-6xl text-orange-300 transition-transform duration-500 group-hover:scale-110 group-hover:text-orange-500"
            ></span>
            <div
              class="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5"
            ></div>
          </div>
          <h3 class="text-center font-medium text-gray-700">
            {{ item.title }}
          </h3>
        </div>
      </div>
    </div>

    <!-- 热门商品 -->
    <!-- <div class="mx-auto max-w-7xl px-4 py-12">
      <div class="mb-8 flex items-center justify-between">
        <h2 class="text-2xl text-gray-800 font-bold">
          热门商品
        </h2>
        <button class="flex items-center text-orange-600 space-x-1 hover:text-orange-700">
          <span>查看更多</span>
          <i class="i-lucide-arrow-right h-4 w-4" />
        </button>
      </div>

      <div class="grid grid-cols-5 gap-6">
        <div
          v-for="i in 5" :key="i"
          class="group cursor-pointer"
        >
          <div class="overflow-hidden rounded-xl bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl">
            <div class="relative aspect-square">
              <img
                src=""
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="商品图片"
              >
              <button class="absolute bottom-3 right-3 h-10 w-10 flex items-center justify-center rounded-full bg-white/80 opacity-0 shadow-lg backdrop-blur-sm transition-opacity group-hover:opacity-100">
                <i class="i-lucide-heart h-5 w-5 text-gray-600" />
              </button>
            </div>

            <div class="p-4">
              <h3 class="line-clamp-2 mb-2 text-gray-800 font-medium transition-colors group-hover:text-orange-600">
                精选商品标题 {{ i }}
              </h3>
              <div class="flex items-baseline space-x-2">
                <span class="text-lg text-orange-600 font-bold">¥299</span>
                <span class="text-sm text-gray-400 line-through">¥399</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->

    <!-- 品牌精选 -->
    <!-- <div class="mx-auto max-w-7xl px-4 py-12">
      <h2 class="mb-8 text-2xl text-gray-800 font-bold">
        品牌精选
      </h2>
      <div class="grid grid-cols-6 gap-4">
        <div
          v-for="i in 6" :key="i"
          class="aspect-square flex items-center justify-center rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <img
            src=""
            class="h-full w-full object-contain opacity-60 transition-opacity hover:opacity-100"
            alt="品牌logo"
          >
        </div>
      </div>
    </div> -->

    <LayoutFooter />
  </div>
</template>
