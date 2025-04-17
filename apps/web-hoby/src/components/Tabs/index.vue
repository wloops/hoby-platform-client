<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-04-15 10:15:00
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-04-17 12:02:45
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\components\Tabs\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import type { TabOption } from '@vben/types';

import { computed, ref } from 'vue';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@vben-core/shadcn-ui';

interface Props {
  tabs: TabOption[];
  notContent?: boolean;
  defaultTab?: string;
}

defineOptions({
  name: 'CommonTabs',
});

const props = withDefaults(defineProps<Props>(), {
  tabs: () => [],
  notContent: false,
  defaultTab: '',
});

const emit = defineEmits(['change']);

const defaultValue = computed(() => {
  return props.defaultTab || props.tabs?.[0]?.value;
});

const currentValue = ref(defaultValue.value);

const handleTabChange = (value: string) => {
  if (currentValue.value === value) return;
  currentValue.value = value;
  emit('change', value);
};
</script>

<template>
  <!-- <div class="card-box w-full px-4 pb-5 pt-3"> -->
  <div class="w-full">
    <Tabs :default-value="defaultValue">
      <TabsList>
        <template v-for="tab in tabs" :key="tab.label">
          <TabsTrigger :value="tab.value" @click="handleTabChange(tab.value)">
            {{ tab.label }}
          </TabsTrigger>
        </template>
      </TabsList>
      <div v-if="notContent">
        <template v-for="tab in tabs" :key="tab.label">
          <TabsContent :value="tab.value" class="pt-4">
            <slot :name="tab.value"></slot>
          </TabsContent>
        </template>
      </div>
    </Tabs>
  </div>
</template>
