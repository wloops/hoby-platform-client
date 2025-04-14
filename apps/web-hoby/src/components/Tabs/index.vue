<script setup lang="ts">
import type { TabOption } from '@vben/types';

import { computed, ref } from 'vue';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@vben-core/shadcn-ui';

interface Props {
  tabs: TabOption[];
  notContent?: boolean;
}

defineOptions({
  name: 'CommonTabs',
});

const props = withDefaults(defineProps<Props>(), {
  tabs: () => [],
  notContent: false,
});

const emit = defineEmits(['change']);

const defaultValue = computed(() => {
  return props.tabs?.[0]?.value;
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
