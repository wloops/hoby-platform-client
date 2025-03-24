<script setup lang="ts">
interface ImportResult {
  success: number;
  skipped: number;
  failed: number;
  errors: Array<{
    orderNumber: string;
    reason: string;
  }>;
}

defineProps<{
  getPlatformName: (id: string) => string;
  importResult: ImportResult;
  selectedPlatform: string;
  uploadedFile: File | null;
}>();

const emit = defineEmits<{
  reset: [];
}>();

const handleReset = () => {
  emit('reset');
};
</script>

<template>
  <div class="rounded-lg bg-white p-6 shadow">
    <div class="mb-6 text-center">
      <div
        class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100"
      >
        <svg
          class="h-6 w-6 text-green-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h3 class="mt-3 text-lg font-medium text-gray-900">导入成功</h3>
      <p class="mt-2 text-sm text-gray-500">
        已成功导入 {{ importResult.success }} 条订单数据，跳过
        {{ importResult.skipped }} 条重复数据，失败
        {{ importResult.failed }} 条。
      </p>
    </div>

    <div class="mb-6 border-b border-t border-gray-200 py-4">
      <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
        <div class="sm:col-span-1">
          <dt class="text-sm font-medium text-gray-500">导入文件</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ uploadedFile?.name || '未知文件' }}
          </dd>
        </div>
        <div class="sm:col-span-1">
          <dt class="text-sm font-medium text-gray-500">导入平台</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ getPlatformName(selectedPlatform) }}
          </dd>
        </div>
        <div class="sm:col-span-1">
          <dt class="text-sm font-medium text-gray-500">导入时间</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {{ new Date().toLocaleString() }}
          </dd>
        </div>
      </dl>
    </div>

    <div v-if="importResult.failed > 0" class="mb-6">
      <h4 class="mb-2 text-sm font-medium text-gray-900">导入失败记录</h4>
      <div class="overflow-x-auto rounded-lg border">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                订单号
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                失败原因
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-for="(error, index) in importResult.errors" :key="index">
              <td
                class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900"
              >
                {{ error.orderNumber }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-red-500">
                {{ error.reason }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="mt-8 flex justify-center space-x-4">
      <button
        type="button"
        class="focus-ring-primary-500 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
        @click="handleReset"
      >
        继续导入
      </button>
      <button
        type="button"
        class="bg-primary-600 hover:bg-primary-700 focus-ring-primary-500 inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
      >
        查看订单列表
      </button>
    </div>
  </div>
</template>
