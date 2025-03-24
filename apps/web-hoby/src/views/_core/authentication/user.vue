<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { PageHeader } from 'ant-design-vue';

const router = useRouter();
interface CreditRecord {
  date: string;
  type: string;
  amount: number;
  status: string;
}

interface Transaction {
  time: string;
  type: string;
  amount: number;
  status: string;
}

const creditRecords = ref<CreditRecord[]>([
  {
    date: '2023-03-15',
    type: '信用额度调整',
    amount: 10_000,
    status: '已完成',
  },
  {
    date: '2023-02-20',
    type: '按时还款奖励',
    amount: 5000,
    status: '已完成',
  },
  {
    date: '2023-01-10',
    type: '初始信用额度',
    amount: 35_000,
    status: '已完成',
  },
]);

const transactions = ref<Transaction[]>([
  {
    time: '2023-03-20 14:30:25',
    type: '充值',
    amount: 5000,
    status: '成功',
  },
  {
    time: '2023-03-15 09:45:12',
    type: '提现',
    amount: -2000,
    status: '成功',
  },
  {
    time: '2023-03-10 16:20:45',
    type: '充值',
    amount: 10_000,
    status: '成功',
  },
  {
    time: '2023-03-05 11:15:30',
    type: '提现',
    amount: -1500,
    status: '成功',
  },
]);
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <PageHeader title="我的账户信息" @back="() => router.back()" />
    <!-- Main Content -->
    <main class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- <h2 class="mb-4 text-lg font-medium text-gray-900">我的账户信息</h2> -->

        <!-- Credit Records Section -->
        <div class="mb-6 rounded-lg bg-white shadow">
          <div class="border-b border-gray-200 px-4 py-5 sm:px-6">
            <h3 class="text-lg font-medium leading-6 text-gray-900">
              信用记录
            </h3>
          </div>
          <div class="px-4 py-5 sm:p-6">
            <div class="mb-4 flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">当前信用额度</p>
                <p class="text-2xl font-bold text-green-600">¥ 50,000.00</p>
              </div>
              <div class="rounded-full bg-green-100 px-3 py-1">
                <span class="text-sm text-green-800">信用良好</span>
              </div>
            </div>

            <div class="mt-6">
              <h4 class="mb-2 text-sm font-medium text-gray-900">
                信用记录历史
              </h4>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        日期
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        类型
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        变动额度
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        状态
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 bg-white">
                    <tr v-for="(record, index) in creditRecords" :key="index">
                      <td
                        class="whitespace-nowrap px-6 py-4 text-sm text-gray-900"
                      >
                        {{ record.date }}
                      </td>
                      <td
                        class="whitespace-nowrap px-6 py-4 text-sm text-gray-900"
                      >
                        {{ record.type }}
                      </td>
                      <td
                        class="whitespace-nowrap px-6 py-4 text-sm"
                        :class="
                          record.amount > 0 ? 'text-green-600' : 'text-red-600'
                        "
                      >
                        {{ record.amount > 0 ? '+' : '' }}{{ record.amount }}
                      </td>
                      <td class="whitespace-nowrap px-6 py-4">
                        <span
                          class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                          :class="
                            record.status === '已完成'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          "
                        >
                          {{ record.status }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Fund Account Section -->
        <div class="rounded-lg bg-white shadow">
          <div class="border-b border-gray-200 px-4 py-5 sm:px-6">
            <h3 class="text-lg font-medium leading-6 text-gray-900">
              资金账户
            </h3>
          </div>
          <div class="px-4 py-5 sm:p-6">
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div class="rounded-lg bg-gray-50 p-4">
                <p class="text-sm text-gray-500">可用余额</p>
                <p class="text-2xl font-bold text-gray-900">¥ 12,345.67</p>
              </div>
              <div class="rounded-lg bg-gray-50 p-4">
                <p class="text-sm text-gray-500">冻结金额</p>
                <p class="text-2xl font-bold text-gray-900">¥ 0.00</p>
              </div>
              <div class="rounded-lg bg-gray-50 p-4">
                <p class="text-sm text-gray-500">总资产</p>
                <p class="text-2xl font-bold text-gray-900">¥ 12,345.67</p>
              </div>
            </div>

            <div class="mt-6">
              <div class="mb-4 flex items-center justify-between">
                <h4 class="text-sm font-medium text-gray-900">资金流水</h4>
                <div class="flex space-x-2">
                  <button
                    class="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    充值
                  </button>
                  <button
                    class="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    提现
                  </button>
                </div>
              </div>

              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        交易时间
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        交易类型
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        交易金额
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        交易状态
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 bg-white">
                    <tr
                      v-for="(transaction, index) in transactions"
                      :key="index"
                    >
                      <td
                        class="whitespace-nowrap px-6 py-4 text-sm text-gray-900"
                      >
                        {{ transaction.time }}
                      </td>
                      <td
                        class="whitespace-nowrap px-6 py-4 text-sm text-gray-900"
                      >
                        {{ transaction.type }}
                      </td>
                      <td
                        class="whitespace-nowrap px-6 py-4 text-sm"
                        :class="
                          transaction.amount > 0
                            ? 'text-green-600'
                            : 'text-red-600'
                        "
                      >
                        {{ transaction.amount > 0 ? '+' : ''
                        }}{{ transaction.amount }}
                      </td>
                      <td class="whitespace-nowrap px-6 py-4">
                        <span
                          class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                          :class="
                            transaction.status === '成功'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          "
                        >
                          {{ transaction.status }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
