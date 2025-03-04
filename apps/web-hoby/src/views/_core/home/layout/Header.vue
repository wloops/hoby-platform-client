<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-02-27 16:17:55
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-04 12:13:17
 * @FilePath: \HOBY-platform\app\components\layout\Header.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import { useRouter } from 'vue-router';

import hobyLogo from '#/assets/hoby_logo.png';

const router = useRouter();

const toLogin = () => {
  router.push('/auth/login');
};

const toRegister = () => {
  router.push('/auth/register');
};
</script>

<template>
  <header class="bg-white/80 shadow-sm backdrop-blur-sm">
    <div class="mx-auto flex h-16 items-center justify-between px-4">
      <!-- Logo -->
      <div class="flex items-center">
        <img :src="hobyLogo" alt="Hoby Logo" class="h-8 w-auto" />
      </div>

      <!-- 右侧按钮 -->
      <div class="flex items-center space-x-3">
        <button
          class="rounded-full px-4 py-1.5 text-sm font-medium text-orange-500 hover:text-orange-600"
          @click="toLogin"
        >
          请登录
        </button>
        <button
          class="rounded-xl bg-orange-500 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-orange-600"
          @click="toRegister"
        >
          免费注册
        </button>
      </div>
    </div>
  </header>
</template>
