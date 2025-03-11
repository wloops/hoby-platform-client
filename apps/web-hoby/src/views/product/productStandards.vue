<script setup>
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

// 搜索条件
const searchForm = ref({
  product: '',
  srlID: '',
  skuvalue: '',
});

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    product: '',
    srlID: '',
    skuvalue: '',
  };
  handleSearch();
};

// 搜索
const handleSearch = () => {
  // 重置到第一页
  if (gridApi?.grid) {
    gridApi.grid.commitProxy('query', { page: { currentPage: 1 } });
  }
};

// 产品规格
const productData = ref([
  {
    name: '男士内衣',
    isExpanded: true,
    orders: [
      {
        isExpanded: true,
        spec: '颜色',
        specValues: [
          {
            id: 1,
            name: '白色',
          },
          {
            id: 2,
            name: '红色',
          },
        ],
      },
      {
        isExpanded: true,
        spec: '尺寸',
        specValues: [
          {
            id: 1,
            name: 'S',
          },
          {
            id: 2,
            name: 'M',
          },
        ],
      },
    ],
  },
]);

// 展开/收起产品
const toggleStore = (storeIndex) => {
  cartData.value[storeIndex].isExpanded =
    !cartData.value[storeIndex].isExpanded;
};

// 展开/收起规格
const toggleOrder = (storeIndex, orderIndex) => {
  cartData.value[storeIndex].orders[orderIndex].isExpanded =
    !cartData.value[storeIndex].orders[orderIndex].isExpanded;
};
</script>

<template>
  <Page auto-content-height>
    <div
      class="bg-grey relative mx-auto h-full overflow-hidden rounded-md shadow-md"
    >
      <!-- 搜索区域 -->
      <div class="mb-4 rounded-lg bg-white p-4 shadow-sm">
        <div class="grid grid-cols-3 gap-4">
          <div class="flex items-center gap-2">
            <span class="w-24 text-gray-600">产品</span>
            <input
              v-model="searchForm.product"
              type="text"
              class="flex-1 rounded-md border border-gray-300 px-3 py-1.5 focus:border-blue-500 focus:outline-none"
              placeholder="请输入产品名称"
            />
          </div>
          <div class="flex items-center gap-2">
            <span class="w-24 text-gray-600">型号</span>
            <input
              v-model="searchForm.srlID"
              type="text"
              class="flex-1 rounded-md border border-gray-300 px-3 py-1.5 focus:border-blue-500 focus:outline-none"
              placeholder="请输入产品型号"
            />
          </div>
          <div class="flex items-center gap-2">
            <span class="w-24 text-gray-600">SKU值</span>
            <input
              v-model="searchForm.srlID"
              type="text"
              class="flex-1 rounded-md border border-gray-300 px-3 py-1.5 focus:border-blue-500 focus:outline-none"
              placeholder="请输入产品SKU值"
            />
          </div>
        </div>
        <div class="mt-4 flex justify-end gap-3">
          <button
            class="rounded-md bg-blue-500 px-4 py-1.5 text-white transition-colors hover:bg-blue-600"
            @click="handleSearch"
          >
            搜索
          </button>
          <button
            class="rounded-md border border-gray-300 px-4 py-1.5 text-gray-600 transition-colors hover:bg-gray-50"
            @click="resetSearch"
          >
            重置
          </button>
        </div>
      </div>
      <div class="space-x-2 bg-white p-3 text-right">
        <button
          class="rounded border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
          @click="generateOrder(storeIndex, orderIndex)"
        >
          创建产品
        </button>
      </div>
      <!-- 表头 -->
      <div
        class="bg-gray-180 grid grid-cols-12 border-b py-4 text-center font-medium text-gray-700"
      >
        <div class="col-span-6">规格值</div>
        <div class="col-span-6">操作</div>
      </div>

      <!-- 产品规格区域 -->
      <div class="divide-y pb-20">
        <!-- 产品区域 -->
        <div
          v-for="(store, storeIndex) in productData"
          :key="storeIndex"
          class="pb-2"
        >
          <!-- 产品名称 -->
          <div
            class="flex items-center justify-between border-b border-gray-300 bg-white px-4 py-3"
          >
            <div class="flex items-center">
              <span class="text-base font-medium">{{ store.name }}</span>
            </div>
            <div class="ml-auto flex items-center space-x-2">
              <button
                @click="removeProduct(storeIndex, orderIndex, productIndex)"
                class="px-3 text-gray-500 hover:text-red-500"
              >
                删除
              </button>
              <button
                class="rounded border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
                @click="generateOrder(storeIndex, orderIndex)"
              >
                编辑产品规格
              </button>
              <button
                class="rounded border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
                @click="generateOrder(storeIndex, orderIndex)"
              >
                创建产品型号
              </button>
              <button
                class="transform p-2 text-gray-500 transition-transform duration-200 focus:outline-none"
                :class="{ 'rotate-180': store.isExpanded }"
                @click="toggleStore(storeIndex)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- 规格（可展开/收起） -->
          <transition
            enter-active-class="transition-all duration-300 ease-in-out"
            leave-active-class="transition-all duration-300 ease-in-out"
            enter-from-class="max-h-0 opacity-0"
            enter-to-class="max-h-[2000px] opacity-100"
            leave-from-class="max-h-[2000px] opacity-100"
            leave-to-class="max-h-0 opacity-0"
          >
            <div v-show="store.isExpanded" class="overflow-hidden">
              <!-- 单个规格 -->
              <div
                v-for="(order, orderIndex) in store.orders"
                :key="orderIndex"
                class="mb-2 bg-white"
              >
                <div
                  class="flex items-center border-b border-dashed border-gray-400 bg-white px-4 py-2"
                >
                  <div class="text-sm font-bold text-gray-600">
                    <span>规格：{{ order.spec }}</span>
                  </div>
                  <div class="ml-auto flex items-center space-x-2">
                    <button
                      class="transform rounded border p-1 text-gray-500 transition-transform duration-200 focus:outline-none"
                      :class="{ 'rotate-180': order.isExpanded }"
                      @click="toggleOrder(storeIndex, orderIndex)"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- 规格值列表（可展开/收起） -->
                <transition
                  enter-active-class="transition-all duration-300 ease-in-out"
                  leave-active-class="transition-all duration-300 ease-in-out"
                  enter-from-class="max-h-0 opacity-0"
                  enter-to-class="max-h-[1000px] opacity-100"
                  leave-from-class="max-h-[1000px] opacity-100"
                  leave-to-class="max-h-0 opacity-0"
                >
                  <div v-show="order.isExpanded" class="overflow-hidden">
                    <div
                      v-for="(specValue, specValueIndex) in order.specValues"
                      :key="specValueIndex"
                      class="border-b"
                    >
                      <div class="grid grid-cols-12 items-center px-4 py-4">
                        <!-- 规格值 -->
                        <div class="col-span-6 flex">
                          {{ specValue.name }}
                        </div>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- 分页 -->
    </div>
  </Page>
</template>

<style scoped>
/* 可以添加额外的自定义样式 */
</style>
