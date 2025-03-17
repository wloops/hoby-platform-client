<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-02-27 16:17:55
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-17 11:41:36
 * @FilePath: \HOBY-platform\app\components\layout\Header.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import { useRouter } from 'vue-router';

import { UserDropdown } from '@vben/layouts';
import { preferences } from '@vben/preferences';
import { useUserStore } from '@vben/stores';

import hobyLogo from '#/assets/hoby_logo.png';
import { useAuthStore } from '#/store';

const props = defineProps<{
  isLoginExpired: boolean;
}>();
const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();

// const sessionStorageUserInfo = sessionStorage.getItem('userInfo')
//   ? JSON.parse(sessionStorage.getItem('userInfo')!)
//   : null;
// const userInfo = ref(userStore.userInfo || null);
console.warn('userStore.userInfo', userStore.userInfo);

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
        <div v-if="!props.isLoginExpired">
          <UserDropdown
            :avatar="
              userStore.userInfo?.avatar ?? preferences.app.defaultAvatar
            "
            :text="userStore.userInfo?.realName"
            :description="userStore.userInfo?.companyName"
            :tag-text="userStore.userInfo?.tellerNo"
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
