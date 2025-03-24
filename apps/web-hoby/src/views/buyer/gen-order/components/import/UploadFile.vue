<script setup lang="ts">
defineProps<{
  uploadedFile: File | null;
}>();

// 使用驼峰命名法定义事件
const emit = defineEmits<{
  complete: [];
  deleteFile: [];
  fileUpload: [event: Event];
  previous: [];
}>();

const handleFileUpload = (event: Event) => {
  emit('fileUpload', event);
};

const handleDeleteFile = () => {
  emit('deleteFile');
};

const handlePrevious = () => {
  emit('previous');
};

const handleNext = () => {
  emit('complete');
};
</script>

<template>
  <div class="rounded-lg bg-white p-6 shadow">
    <h3 class="mb-4 text-lg font-medium text-gray-900">上传订单文件</h3>

    <div
      class="mt-2 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5"
    >
      <div class="space-y-1 text-center">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <div class="flex text-sm text-gray-600">
          <label
            for="file-upload"
            class="text-primary-600 hover:text-primary-500 focus-within:ring-primary-500 relative cursor-pointer rounded-md bg-white font-medium focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2"
          >
            <span>上传文件</span>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              class="sr-only"
              @change="handleFileUpload"
            />
          </label>
          <p class="pl-1">或拖拽文件到这里</p>
        </div>
        <p class="text-xs text-gray-500">支持 Excel, CSV 格式文件，最大 10MB</p>
      </div>
    </div>

    <div v-if="uploadedFile" class="mt-4 rounded-md bg-gray-50 p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <svg
            class="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="ml-2 text-sm text-gray-900">{{
            uploadedFile.name
          }}</span>
        </div>
        <button
          type="button"
          class="text-sm text-red-600 hover:text-red-900"
          @click="handleDeleteFile"
        >
          删除
        </button>
      </div>
    </div>

    <div class="mt-8 flex justify-between">
      <button
        type="button"
        class="focus-ring-primary-500 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
        @click="handlePrevious"
      >
        上一步
      </button>
      <button
        type="button"
        class="bg-primary-600 hover:bg-primary-700 focus-ring-primary-500 inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
        :disabled="!uploadedFile"
        @click="handleNext"
      >
        下一步
      </button>
    </div>
  </div>
</template>
