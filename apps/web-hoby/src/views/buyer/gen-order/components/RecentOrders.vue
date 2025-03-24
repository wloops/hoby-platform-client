<script setup lang="ts">
import { ref } from 'vue';

interface ImportHistoryRecord {
  time: string;
  platform: string;
  fileName: string;
  count: number;
  status: string;
}
const importHistory = ref<ImportHistoryRecord[]>([
  {
    time: '2023-03-15 17:30:25',
    platform: '淘宝',
    fileName: 'taobao_orders_20230315.xlsx',
    count: 120,
    status: '成功',
  },
  {
    time: '2023-03-10 09:15:40',
    platform: '京东',
    fileName: 'jd_orders_20230310.xlsx',
    count: 85,
    status: '成功',
  },
  {
    time: '2023-03-05 14:20:10',
    platform: '拼多多',
    fileName: 'pdd_orders_20230305.xlsx',
    count: 64,
    status: '失败',
  },
]);
</script>

<template>
  <!-- Import History -->
  <div class="mt-8">
    <h3 class="mb-4 text-lg font-medium text-gray-900">最近导入记录</h3>
    <div class="overflow-x-auto rounded-lg border shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              导入时间
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              平台
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              文件名
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              导入数量
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
              操作
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr
            v-for="(record, index) in importHistory"
            :key="index"
            :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
          >
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
              {{ record.time }}
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
              {{ record.platform }}
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
              {{ record.fileName }}
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
              {{ record.count }}
            </td>
            <td class="whitespace-nowrap px-6 py-4">
              <span
                class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                :class="
                  record.status === '成功'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                "
              >
                {{ record.status }}
              </span>
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
              <button class="text-primary-600 hover:text-primary-900 mr-3">
                查看
              </button>
              <button class="text-red-600 hover:text-red-900">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped></style>
