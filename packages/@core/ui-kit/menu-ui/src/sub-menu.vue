<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-03 21:58:41
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-04-17 13:46:15
 * @FilePath: \hoby-platform-client\packages\@core\ui-kit\menu-ui\src\sub-menu.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import type { MenuRecordRaw } from '@vben-core/typings';

import { computed } from 'vue';

// @ts-ignore
// eslint-disable-next-line no-restricted-imports
import { useRefresh } from '@vben/hooks';

import { MenuBadge, MenuItem, SubMenu as SubMenuComp } from './components';
// eslint-disable-next-line import/no-self-import
import SubMenu from './sub-menu.vue';

interface Props {
  /**
   * 菜单项
   */
  menu: MenuRecordRaw;
}

defineOptions({
  name: 'SubMenuUi',
});

const props = withDefaults(defineProps<Props>(), {});
const { refresh } = useRefresh();
/**
 * 判断是否有子节点，动态渲染 menu-item/sub-menu-item
 */
const hasChildren = computed(() => {
  const { menu } = props;
  return (
    Reflect.has(menu, 'children') && !!menu.children && menu.children.length > 0
  );
});
function handClickItem(_item: any) {
  // 刷新当前路由
  refresh();
}
</script>

<template>
  <MenuItem
    v-if="!hasChildren"
    :key="menu.path"
    :active-icon="menu.activeIcon"
    :badge="menu.badge"
    :badge-type="menu.badgeType"
    :badge-variants="menu.badgeVariants"
    :icon="menu.icon"
    :path="menu.path"
    @click="handClickItem"
  >
    <template #title>
      <span>{{ menu.name }}</span>
    </template>
  </MenuItem>
  <SubMenuComp
    v-else
    :key="`${menu.path}_sub`"
    :active-icon="menu.activeIcon"
    :icon="menu.icon"
    :path="menu.path"
  >
    <template #content>
      <MenuBadge
        :badge="menu.badge"
        :badge-type="menu.badgeType"
        :badge-variants="menu.badgeVariants"
        class="right-6"
      />
    </template>
    <template #title>
      <span>{{ menu.name }}</span>
    </template>
    <template v-for="childItem in menu.children || []" :key="childItem.path">
      <SubMenu :menu="childItem" />
    </template>
  </SubMenuComp>
</template>
