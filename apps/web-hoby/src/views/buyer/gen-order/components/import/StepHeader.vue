<script setup lang="ts">
defineProps<{
  currentStep: number;
  steps: string[];
}>();

const emit = defineEmits<{
  stepClick: [index: number];
}>();

const handleStepClick = (index: number) => {
  emit('stepClick', index);
};
</script>

<template>
  <div class="mb-8">
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <a
          v-for="(step, index) in steps"
          :key="index"
          href="#"
          class="flex items-center whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium"
          :class="[
            currentStep >= index
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
          ]"
          @click.prevent="handleStepClick(index)"
        >
          <span
            class="mr-2 flex h-6 w-6 items-center justify-center rounded-full"
            :class="[
              currentStep > index
                ? 'bg-primary-500'
                : currentStep === index
                  ? 'border-primary-500 text-primary-600 border-2'
                  : 'bg-gray-200 text-gray-500',
            ]"
          >
            <svg
              v-if="currentStep > index"
              class="h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
            <span v-else>{{ index + 1 }}</span>
          </span>
          {{ step }}
        </a>
      </nav>
    </div>
  </div>
</template>
