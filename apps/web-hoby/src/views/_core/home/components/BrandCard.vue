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
    class="group overflow-hidden rounded-lg bg-white shadow transition-all hover:-translate-y-1 hover:shadow-md"
  >
    <div class="flex flex-col items-center p-4">
      <div
        class="mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-yellow-400 bg-white"
      >
        <template v-if="brand.logo">
          <img
            :src="brand.logo"
            :alt="brand.name"
            class="h-full w-full object-cover transition-transform group-hover:scale-110"
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
