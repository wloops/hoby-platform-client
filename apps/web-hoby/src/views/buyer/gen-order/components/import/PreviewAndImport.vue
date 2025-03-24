<script setup lang="ts">
interface PreviewOrder {
  orderNumber: string;
  customer: string;
  product: string;
  amount: number;
  status: string;
  createdAt: string;
}

defineProps<{
  previewData: PreviewOrder[];
}>();

const emit = defineEmits<{
  previous: [];
  startImport: [];
}>();

const handlePrevious = () => {
  emit('previous');
};

const handleStartImport = () => {
  emit('startImport');
};
</script>

<template>
  <div class="rounded-lg bg-white p-6 shadow">
    <h3 class="mb-4 text-lg font-medium text-gray-900">预览并导入</h3>

    <div class="mb-6">
      <div class="mb-4 flex items-center justify-between">
        <h4 class="text-sm font-medium text-gray-900">数据预览</h4>
        <span class="text-sm text-gray-500"
          >共 {{ previewData.length }} 条记录</span
        >
      </div>

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
                客户
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                商品
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                金额
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                状态
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                创建时间
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr
              v-for="(order, index) in previewData"
              :key="index"
              :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
            >
              <td
                class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900"
              >
                {{ order.orderNumber }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {{ order.customer }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {{ order.product }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                ¥ {{ order.amount }}
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                <span
                  class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                  :class="
                    order.status === '已付款'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  "
                >
                  {{ order.status }}
                </span>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {{ order.createdAt }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="mb-6 border-l-4 border-yellow-400 bg-yellow-50 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg
            class="h-5 w-5 text-yellow-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-yellow-800">注意事项</h3>
          <div class="mt-2 text-sm text-yellow-700">
            <p>
              导入操作无法撤销，请确认数据无误后再进行导入。如有重复订单，将根据您的设置进行处理。
            </p>
          </div>
        </div>
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
        @click="handleStartImport"
      >
        开始导入
      </button>
    </div>
  </div>
</template>
