<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-23 15:35:37
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-24 09:47:35
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\layouts\auth.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import { AuthPageLayout } from '@vben/layouts';
import { preferences } from '@vben/preferences';

import { $t } from '#/locales';

const appName = computed(() => preferences.app.name);
const logo = computed(() => preferences.logo.source);
const router = useRouter();
const toHome = () => {
  router.push('/');
};
</script>

<template>
  <AuthPageLayout
    :app-name="appName"
    :logo="logo"
    :toolbar="false"
    :copyright="false"
    :page-description="$t('authentication.pageDesc')"
    :page-title="$t('authentication.pageTitle')"
    :click-logo="toHome"
  >
    <!-- 自定义工具栏 -->
    <!-- <template #toolbar></template> -->
  </AuthPageLayout>
</template>
