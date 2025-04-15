<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-04-16 00:00:33
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-04-16 00:01:24
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\views\_core\home\components\ServiceCard.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script lang="ts" setup>
import {
  BankOutlined,
  CarOutlined,
  ShoppingOutlined,
} from '@ant-design/icons-vue';

const props = defineProps<{
  service: {
    desc: string;
    icon: string;
    id: number;
    name: string;
  };
}>();

const getIcon = (iconName: string) => {
  const iconMap = {
    'bank-outlined': BankOutlined,
    'car-outlined': CarOutlined,
    'shopping-outlined': ShoppingOutlined,
  };
  return iconMap[iconName as keyof typeof iconMap];
};
</script>

<template>
  <div
    class="group flex-1 cursor-pointer overflow-hidden rounded-lg transition-all hover:-translate-y-1"
  >
    <div
      class="relative h-[180px] w-full overflow-hidden bg-gradient-to-br p-6"
      :class="[
        service.id === 1 ? 'from-blue-400 to-blue-600' : '',
        service.id === 2 ? 'from-cyan-400 to-cyan-600' : '',
        service.id === 3 ? 'from-teal-400 to-teal-600' : '',
      ]"
    >
      <!-- 背景装饰 -->
      <div class="absolute -right-8 -top-8 h-32 w-32 rotate-12 opacity-10">
        <component
          :is="getIcon(props.service.icon)"
          class="h-full w-full text-white"
        />
      </div>

      <!-- 内容 -->
      <div class="relative z-10">
        <component
          :is="getIcon(service.icon)"
          class="mb-4 text-4xl text-white"
        />
        <h3 class="mb-2 text-2xl font-bold text-white">{{ service.name }}</h3>
        <p class="text-sm text-white/90">{{ service.desc }}</p>
      </div>

      <!-- 悬停时显示的箭头 -->
      <div
        class="absolute bottom-4 right-4 translate-x-8 transform opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
      >
        <span class="text-xl text-white">→</span>
      </div>
    </div>
  </div>
</template>
