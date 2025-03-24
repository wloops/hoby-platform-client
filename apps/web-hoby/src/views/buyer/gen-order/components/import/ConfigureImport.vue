<script setup lang="ts">
import { computed } from 'vue';

interface FieldMapping {
  systemField: string;
  thirdPartyField: string;
  sampleValue: string;
}

interface ImportOptions {
  skipExisting: boolean;
  autoStatus: boolean;
  notifyCustomer: boolean;
}

const props = defineProps<{
  fieldMappings: FieldMapping[];
  importOptions: ImportOptions;
  thirdPartyFields: string[];
}>();

const emit = defineEmits<{
  complete: [];
  previous: [];
  'update:importOptions': [options: ImportOptions];
}>();

const localImportOptions = computed({
  get: () => props.importOptions,
  set: (value) => emit('update:importOptions', value),
});

const handlePrevious = () => {
  emit('previous');
};

const handleNext = () => {
  emit('complete');
};

// const updateImportOptions = (key: keyof ImportOptions, value: boolean) => {
//   emit('update:importOptions', { ...importOptions, [key]: value });
// };
</script>

<template>
  <div class="rounded-lg bg-white p-6 shadow">
    <h3 class="mb-4 text-lg font-medium text-gray-900">配置导入选项</h3>

    <div class="space-y-6">
      <div>
        <h4 class="mb-2 text-sm font-medium text-gray-900">字段映射</h4>
        <p class="mb-4 text-xs text-gray-500">
          请将第三方平台的字段与系统字段进行映射
        </p>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  系统字段
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  第三方字段
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  示例值
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="(field, index) in fieldMappings" :key="index">
                <td
                  class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900"
                >
                  {{ field.systemField }}
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <select
                    v-model="field.thirdPartyField"
                    class="focus-ring-primary-500 focus-border-primary-500 mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none sm:text-sm"
                  >
                    <option value="">请选择</option>
                    <option
                      v-for="option in thirdPartyFields"
                      :key="option"
                      :value="option"
                    >
                      {{ option }}
                    </option>
                  </select>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {{ field.sampleValue }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h4 class="mb-2 text-sm font-medium text-gray-900">导入选项</h4>
        <div class="space-y-4">
          <div class="flex items-start">
            <div class="flex h-5 items-center">
              <input
                id="skip-existing"
                name="skip-existing"
                type="checkbox"
                v-model="localImportOptions.skipExisting"
                class="focus-ring-primary-500 text-primary-600 h-4 w-4 rounded border-gray-300"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="skip-existing" class="font-medium text-gray-700"
                >跳过已存在的订单</label
              >
              <p class="text-gray-500">如果订单号已存在，则跳过该订单的导入</p>
            </div>
          </div>

          <div class="flex items-start">
            <div class="flex h-5 items-center">
              <input
                id="auto-status"
                name="auto-status"
                type="checkbox"
                v-model="localImportOptions.autoStatus"
                class="focus-ring-primary-500 text-primary-600 h-4 w-4 rounded border-gray-300"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="auto-status" class="font-medium text-gray-700"
                >自动设置订单状态</label
              >
              <p class="text-gray-500">
                根据第三方平台的订单状态自动设置系统中的订单状态
              </p>
            </div>
          </div>

          <div class="flex items-start">
            <div class="flex h-5 items-center">
              <input
                id="notify-customer"
                name="notify-customer"
                type="checkbox"
                v-model="localImportOptions.notifyCustomer"
                class="focus-ring-primary-500 text-primary-600 h-4 w-4 rounded border-gray-300"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="notify-customer" class="font-medium text-gray-700"
                >通知客户</label
              >
              <p class="text-gray-500">导入订单后自动向客户发送通知</p>
            </div>
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
        @click="handleNext"
      >
        下一步
      </button>
    </div>
  </div>
</template>
