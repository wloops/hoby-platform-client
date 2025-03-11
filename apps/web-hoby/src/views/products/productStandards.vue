<script setup>
import { reactive, ref } from 'vue';

import EditSpecificationModal from './components/EditSpecificationModal.vue';

// 产品展开状态
const expandedProducts = reactive({
  1: true, // 默认展开第一个产品
});

// 规格展开状态
const expandedSpecs = reactive({});

// 切换产品展开状态
const toggleProduct = (productId) => {
  expandedProducts[productId] = !expandedProducts[productId];
};

// 切换规格展开状态
const toggleSpec = (productId, specType) => {
  const key = `${productId}-${specType}`;
  expandedSpecs[key] = !expandedSpecs[key];
};

// 检查规格是否展开
const isSpecExpanded = (productId, specType) => {
  const key = `${productId}-${specType}`;
  return expandedSpecs[key] || false; // 默认收起
};

// 获取规格类型名称
const getSpecTypeName = (specType) => {
  const names = {
    colors: '颜色',
    sizes: '尺寸',
    materials: '材质',
  };
  return names[specType] || specType;
};

// 编辑模态框状态
const isEditModalOpen = ref(false);
const currentEditingProduct = ref(null);

// 打开编辑模态框
const openEditModal = (product) => {
  currentEditingProduct.value = product;
  isEditModalOpen.value = true;
};

// 关闭编辑模态框
const closeEditModal = () => {
  isEditModalOpen.value = false;
  currentEditingProduct.value = null;
};

// 获取颜色对应的CSS颜色值
const getColorValue = (color) => {
  const colorMap = {
    白色: '#ffffff',
    红色: '#f5222d',
    黑色: '#000000',
    紫色: '#722ed1',
    蓝色: '#1890ff',
  };
  return colorMap[color] || '#cccccc';
};

// 获取规格值显示文本
const getSpecValue = (specType, item) => {
  if (typeof item === 'string') return item;
  if (specType === 'colors') return `${item.name} - ${item.description}`;
  if (specType === 'sizes') return `${item.label} - ${item.description}`;
  if (specType === 'materials') return `${item.name} - ${item.description}`;
  return JSON.stringify(item);
};

// 示例数据
const products = ref([
  {
    id: 1,
    name: '男士内衣',
    type: '服装',
    status: '上架',
    createdAt: '2023-05-15 10:30:00',
    specifications: {
      colors: ['白色', '红色', '黑色', '紫色'],
      sizes: ['M', 'L', 'XL'],
      materials: ['纯棉', '莫代尔'],
    },
  },
  {
    id: 2,
    name: '女士连衣裙',
    type: '服装',
    status: '上架',
    createdAt: '2023-06-20 14:15:00',
    specifications: {
      colors: ['白色', '黑色', '蓝色'],
      sizes: ['S', 'M', 'L'],
      materials: ['棉麻混纺', '真丝'],
    },
  },
]);
</script>

<template>
  <div class="mx-auto max-w-7xl p-4 md:p-6">
    <!-- 顶部搜索和创建按钮 -->
    <div class="mb-8 flex items-center justify-between">
      <h1 class="text-xl font-semibold text-gray-800 md:text-2xl">
        产品标准管理
      </h1>
      <button class="btn-primary">
        <svg
          class="mr-2 h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        创建产品
      </button>
    </div>

    <EditSpecificationModal
      :is-open="isEditModalOpen"
      :product-id="currentEditingProduct?.id"
      :specifications="currentEditingProduct?.specifications"
      @close="closeEditModal"
      @save="handleSaveSpecifications"
    />

    <!-- 产品列表 -->
    <div class="space-y-6">
      <div
        v-for="product in products"
        :key="product.id"
        class="overflow-hidden rounded-lg border bg-white shadow-sm transition-all duration-200 hover:shadow-md"
      >
        <!-- 产品标题栏 -->
        <div class="flex items-center justify-between border-b px-6 py-4">
          <h3 class="flex items-center text-lg font-medium text-gray-800">
            <span
              class="mr-2 h-2 w-2 rounded-full bg-green-500"
              v-if="product.status === '上架'"
            ></span>
            <span class="mr-2 h-2 w-2 rounded-full bg-gray-400" v-else></span>
            {{ product.name }}
          </h3>
          <div class="flex items-center gap-4">
            <button class="btn-text-danger">
              <svg
                class="mr-1 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              删除
            </button>
            <button class="btn-text-primary" @click="openEditModal(product)">
              <svg
                class="mr-1 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              编辑产品规格
            </button>
            <button class="btn-text-secondary">
              <svg
                class="mr-1 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              创建产品型号
            </button>
            <svg
              class="ml-1 h-5 w-5 transform cursor-pointer transition-transform duration-200"
              :class="{
                'rotate-180': expandedProducts[product.id],
              }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              @click="toggleProduct(product.id)"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        <!-- 产品详情 -->
        <div
          v-show="expandedProducts[product.id]"
          class="transition-all duration-300"
        >
          <dl class="divide-y divide-gray-100">
            <!-- <div
              class="grid grid-cols-12 transition-colors duration-150 hover:bg-gray-50"
            >
              <dt
                class="col-span-2 px-6 py-4 text-sm font-medium text-gray-600"
              >
                产品类型
              </dt>
              <dd class="col-span-4 px-4 py-4 text-sm text-gray-800">
                {{ product.type }}
              </dd>
              <dt
                class="col-span-2 px-6 py-4 text-sm font-medium text-gray-600"
              >
                创建时间
              </dt>
              <dd class="col-span-4 px-4 py-4 text-sm text-gray-800">
                {{ product.createdAt }}
              </dd>
            </div> -->

            <!-- <div
              class="grid grid-cols-12 transition-colors duration-150 hover:bg-gray-50"
            >
              <dt
                class="col-span-2 px-6 py-4 text-sm font-medium text-gray-600"
              >
                状态
              </dt>
              <dd class="col-span-10 px-4 py-4 text-sm text-gray-800">
                <div class="flex items-center">
                  <span
                    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                    :class="
                      product.status === '上架'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    "
                  >
                    {{ product.status }}
                  </span>
                </div>
              </dd>
            </div> -->

            <!-- 规格部分 -->
            <div
              v-for="(spec, specType) in product.specifications"
              :key="specType"
              class="transition-colors duration-150 hover:bg-gray-50"
            >
              <div
                class="flex cursor-pointer items-center justify-between px-6 py-4"
                @click="toggleSpec(product.id, specType)"
              >
                <dt class="flex items-center text-sm font-medium text-gray-700">
                  <svg
                    class="mr-2 h-4 w-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                    />
                  </svg>
                  规格：{{ getSpecTypeName(specType) }}
                </dt>
                <div class="flex items-center">
                  <span class="mr-2 text-sm text-gray-500"
                    >{{ spec.length }}个选项</span
                  >
                  <svg
                    class="h-5 w-5 transform text-gray-500 transition-transform duration-200"
                    :class="{
                      'rotate-180': isSpecExpanded(product.id, specType),
                    }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              <dd
                v-show="isSpecExpanded(product.id, specType)"
                class="border-t border-gray-100 bg-gray-50 transition-all duration-300"
              >
                <div class="flex flex-wrap gap-3 p-4">
                  <div
                    v-for="(item, index) in spec"
                    :key="index"
                    class="flex items-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm"
                  >
                    <div
                      v-if="specType === 'colors'"
                      class="mr-2 h-4 w-4 rounded-full border"
                      :style="{ backgroundColor: getColorValue(item) }"
                    ></div>
                    {{ getSpecValue(specType, item) }}
                  </div>
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="mt-8 flex justify-center gap-1">
      <button class="pagination-btn">
        <svg
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button class="pagination-btn pagination-active">1</button>
      <button class="pagination-btn">2</button>
      <button class="pagination-btn">3</button>
      <button class="pagination-btn">4</button>
      <button class="pagination-btn">5</button>
      <button class="pagination-btn">
        <svg
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 主按钮 */
.btn-primary {
  @apply flex items-center rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
}

/* 文本按钮 - 主要 */
.btn-text-primary {
  @apply flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors duration-200 hover:bg-blue-50;
}

/* 文本按钮 - 次要 */
.btn-text-secondary {
  @apply flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors duration-200 hover:bg-gray-50;
}

/* 文本按钮 - 危险 */
.btn-text-danger {
  @apply flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-red-600 transition-colors duration-200 hover:bg-red-50;
}

/* 分页按钮 */
.pagination-btn {
  @apply flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 text-sm font-medium text-gray-700 transition-colors duration-150 hover:bg-gray-50;
}

.pagination-active {
  @apply border-blue-600 bg-blue-600 text-white hover:bg-blue-700;
}

.rotate-180 {
  transform: rotate(180deg);
}
</style>
