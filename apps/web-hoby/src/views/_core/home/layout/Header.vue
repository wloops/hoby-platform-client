<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-02-27 16:17:55
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-11 10:49:11
 * @FilePath: \HOBY-platform\app\components\layout\Header.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import { UserDropdown } from '@vben/layouts';
import { preferences } from '@vben/preferences';
import { useUserStore } from '@vben/stores';

import hobyLogo from '#/assets/hoby_logo.png';
import { useAuthStore } from '#/store';

const router = useRouter();
const userInfo = sessionStorage.getItem('userInfo')
  ? JSON.parse(sessionStorage.getItem('userInfo')!)
  : null;

const userStore = useUserStore();
const authStore = useAuthStore();

const avatar = computed(() => {
  return userInfo?.avatar ?? preferences.app.defaultAvatar;
});
const realName = computed(() => {
  return userInfo?.realName;
});
const company = computed(() => {
  return userInfo?.TELLERCOMPANY;
});
const userName = computed(() => {
  return userInfo?.tellerNo;
});
const toLogin = () => {
  router.push('/auth/login');
};

const toRegister = () => {
  router.push('/auth/register');
};

async function handleLogout() {
  await authStore.logout(true);
}
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
        <div v-if="userStore.userInfo">
          <UserDropdown
            :avatar
            :text="realName"
            :description="company"
            :tag-text="userName"
            @logout="handleLogout"
          />
        </div>
        <div v-else>
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
    </div>
  </header>
</template>
