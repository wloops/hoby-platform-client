<script setup>
import { computed, onMounted, ref } from 'vue';

import { useMainGetData } from '#/composables';

// 模拟规格标准数据
// const specs = ref([
//   { id: 1, name: '颜色', values: ['红色', '白色', '蓝色'] },
//   { id: 2, name: '尺寸', values: ['M', 'L', 'XL'] },
//   { id: 3, name: '材质', values: ['棉', '涤纶', '丝绸'] },
//   { id: 4, name: '重量', values: ['100g', '200g', '300g'] },
//   { id: 6, name: '风格', values: ['简约', '复古', '现代'] },
//   { id: 7, name: '品牌', values: ['A品牌', 'B品牌', 'C品牌'] },
//   { id: 8, name: '产地', values: ['中国', '美国', '日本'] },
//   { id: 9, name: '工艺', values: ['手工', '机器'] },
//   { id: 10, name: '包装', values: ['盒装', '袋装'] },
// ]);

// 规格类型数据
const specs = ref([]);
async function fetchSpecs() {
  // loading.value = true;
  try {
    // const { current, pageSize } = pagination.value;
    const reqParams = {
      pageID: 'specStandards',
      pageDataGrpID: 'querySpecCate',
      // currentPage: current,
      // numOfPerPage: pageSize,
    };
    const { data } = await useMainGetData(reqParams);
    specs.value = data.value.map((item, index) => ({
      id: `${111 + index}`,
      name: item.specCate,
      values: [],
    }));

    initializeCollapsedState();
  } catch (error) {
    console.error('Failed to fetch specs:', error);
  } finally {
    // loading.value = false;
  }
}
// 根据规格类型查询规格值
const fetchSpecValue = async (spec) => {
  console.warn('fetchSpecValue:specs', spec, specs.value);
  const reqParams = {
    pageID: 'specStandards',
    pageDataGrpID: 'querySpecValue',
    specCate: spec.name,
  };
  const { data } = await useMainGetData(reqParams);
  console.warn('fetchSpecValue:data', data.value);
  specs.value.forEach((item) => {
    if (item.id === spec.id) {
      item.values = data.value;
    }
  });
  const specValues = data.value.map((item) => ({
    values: item.specValue,
  }));
  return specValues;
};

// 初始加载
onMounted(async () => {
  fetchSpecs();
});

const collapsedState = ref({}); // 用于存储展开/折叠状态
const currentPage = ref(1); // 当前页码
const pageSize = ref(5); // 每页显示的规格数量

// 初始化 collapsedState，默认折叠所有规格类型
const initializeCollapsedState = () => {
  for (const spec of specs.value) {
    collapsedState.value[spec.id] = true; // true 表示折叠
  }
};

// 在组件挂载时初始化 collapsedState
// onMounted(() => {
//   initializeCollapsedState();
// });

// 计算总页数
const totalPages = computed(() =>
  Math.ceil(specs.value.length / pageSize.value),
);

// 计算当前页显示的规格数据
const paginatedSpecs = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return specs.value.slice(start, end);
});

// 切换展开/折叠状态
const toggleCollapse = (id, spec) => {
  collapsedState.value[id] = !collapsedState.value[id];
  fetchSpecValue(spec);
};

// 判断是否折叠
const isCollapsed = (id) => collapsedState.value[id];

// 删除规格类型
const deleteSpec = (id) => {
  specs.value = specs.value.filter((spec) => spec.id !== id);
  // 如果删除后当前页没有数据，则跳转到上一页
  if (paginatedSpecs.value.length === 0 && currentPage.value > 1) {
    currentPage.value--;
  }
};

// 删除规格值
const deleteSpecValue = (id, value) => {
  const spec = specs.value.find((spec) => spec.id === id);
  if (spec) {
    spec.values = spec.values.filter((v) => v !== value);
  }
};

// 上一页
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// 下一页
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// 重置页码
const resetPage = () => {
  currentPage.value = 1;
};
</script>

<template>
  <div class="flex h-screen flex-col p-4 md:p-6">
    <!-- 顶部搜索和创建按钮 -->
    <div class="mb-8 flex items-center justify-between">
      <h1 class="text-xl font-semibold text-gray-800 md:text-2xl">
        规格标准管理
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
        新增规格
      </button>
    </div>

    <!-- 规格标准列表 -->
    <div class="flex-1 overflow-y-auto">
      <div
        v-for="spec in paginatedSpecs"
        :key="spec.id"
        class="mb-4 rounded-lg border bg-white shadow-sm transition-all duration-200 hover:shadow-md"
      >
        <!-- 规格类型区域 -->
        <div class="flex items-center justify-between border-b px-6 py-4">
          <div class="text-lg font-medium text-gray-800">
            <span
              class="mr-2 inline-block h-2 w-2 flex-none rounded-full bg-green-500"
            ></span
            >规格：{{ spec.name }}
          </div>
          <div class="flex items-center space-x-2">
            <button
              class="btn-text-danger flex-none"
              @click="deleteSpec(spec.id)"
            >
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
              新增规格值
            </button>
            <svg
              class="h-6 w-6 transform cursor-pointer text-gray-600 transition-transform"
              :class="{ 'rotate-180': !collapsedState[spec.id] }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              @click="toggleCollapse(spec.id, spec)"
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

        <!-- 规格值区域 -->
        <div v-if="!isCollapsed(spec.id)" class="px-6 py-4">
          <div class="flex flex-wrap">
            <div
              v-for="value in spec.values"
              :key="value"
              class="mb-2 mr-4 flex items-center rounded-md border border-gray-200 bg-white px-3 py-1.5 pr-0 text-sm text-gray-700 shadow-sm"
            >
              <span>{{ value.specValue }}</span>
              <button
                class="btn-text-danger flex-none"
                @click="deleteSpecValue(spec.id, value)"
              >
                <svg
                  class="h-4 w-4"
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
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页组件 -->
    <div
      class="fixed bottom-0 right-0 justify-end border-t bg-white p-4 shadow-lg"
    >
      <div class="flex items-center justify-between">
        <div class="mr-3 text-sm text-gray-600">共 {{ specs.length }} 条</div>
        <div class="flex items-center space-x-4">
          <!-- 分页按钮 -->
          <div class="flex items-center space-x-2">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="rounded-l bg-blue-500 p-1 text-white disabled:bg-gray-300"
            >
              &lt;
            </button>
            <span class="bg-gray-200 p-2"
              >{{ currentPage }} / {{ totalPages }}</span
            >
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="rounded-r bg-blue-500 p-1 text-white disabled:bg-gray-300"
            >
              &gt;
            </button>
          </div>
          <!-- 每页条数选择 -->
          <select
            v-model="pageSize"
            @change="resetPage"
            class="rounded border p-2"
          >
            <option value="5">5 条/页</option>
            <option value="10">10 条/页</option>
            <option value="20">20 条/页</option>
          </select>
        </div>
      </div>
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
