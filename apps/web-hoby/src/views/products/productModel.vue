<script setup>
import { onMounted, ref } from 'vue';

import { useMainGetData } from '#/composables';

// 数据
// const productSearch = ref('');
// const modelSearch = ref('');
const activeTab = ref('introduction');
// 默认折叠
const expandedIndex = ref();
const expandedSpecs = ref([]);

// 切换产品型号展开状态
const toggleExpand = (index, product) => {
  expandedIndex.value = expandedIndex.value === index ? null : index;
  fetchSpecsList(product);
  fetchPricesList(product);
  // fetchImgsList(product);
  console.warn('产品型号', product);
};

const toggleSpecExpand = (specId, specType, product) => {
  if (expandedSpecs.value.includes(specId)) {
    expandedSpecs.value = expandedSpecs.value.filter((id) => id !== specId);
  } else {
    expandedSpecs.value.push(specId);
  }
  fetchSpecValueList(product, specType);
  console.warn('序号', specId, specType, product);
};

// 根据产品型号查询规格类型名称
const fetchSpecsList = async (product) => {
  console.warn('fetchSpecsList:product', product);

  const reqParams = {
    pageID: 'productModel',
    pageDataGrpID: 'queryProductModelSpecCate',
    productName: product.name,
    srlID: product.model,
    // currentPage: current,
    // numOfPerPage: pageSize,
  };
  const { data } = await useMainGetData(reqParams);
  console.warn('fetchSpecsList:data', data.value);
  products.value.forEach((item) => {
    if (item.name === product.name && item.model === product.model) {
      item.specifications = data.value.map((item, index) => ({
        id: index,
        name: item.specCate,
        values: [],
      }));
    }
  });
};
// 根据规格类型查询规格值
const fetchSpecValueList = async (spec, index) => {
  console.warn('fetchSpecValueList:', spec, index, spec.specifications[0].name);
  const reqParams = {
    pageID: 'productModel',
    pageDataGrpID: 'queryProductModelSpecValue',
    productName: spec.name,
    srlID: spec.model,
    specCate: spec.specifications[index].name,
  };
  const { data } = await useMainGetData(reqParams);
  console.warn('fetchSpecValueList:data', data.value, products.value, spec);
  spec.specifications.forEach((item) => {
    if (item.name === spec.specifications[index].name) {
      item.values = data.value.map((item) => ({
        title: item.specValue,
      }));
    }
  });
};
// 根据产品型号查询产品报价
const fetchPricesList = async (product) => {
  console.warn('fetchPricesList:product', product);

  const reqParams = {
    pageID: 'productModel',
    pageDataGrpID: 'queryProductQuotation',
    productName: product.name,
    srlID: product.model,
    // currentPage: current,
    // numOfPerPage: pageSize,
  };
  const { data } = await useMainGetData(reqParams);
  console.warn('fetchPricesList:data', data.value);
  products.value.forEach((item) => {
    if (item.name === product.name && item.model === product.model) {
      item.prices = data.value.map((item, index) => ({
        id: index,
        sellingPrice: item.salePriceID,
        quoteSpec: item.quotationsSpec,
        distributorPrice: item.distributorPrice,
        retailPrice: item.terminalPrice,
      }));
    }
  });
};
// 根据产品型号查询产品图片
// const fetchImgsList = async (product) => {
//   console.warn('fetchImgsList:product', product);

//   const reqParams = {
//     pageID: 'productModel',
//     pageDataGrpID: 'queryProductQuotation',
//     operObjectID: product.objectID,
//     // currentPage: current,
//     // numOfPerPage: pageSize,
//   };
//   const { data } = await useMainGetData(reqParams);
//   console.warn('fetchImgsList:data', data.value);
//   products.value.forEach((item) => {
//     if (item.name === product.name && item.model === product.model) {
//       item.images = data.value.map((item, index) => ({
//         id: index,
//         url: item.imgFile,
//       }));
//     }
//   });
// };
// 产品型号
const products = ref([]);
async function fetchProductsList() {
  try {
    const reqParams = {
      pageID: 'productModel',
      pageDataGrpID: 'queryProductModel',
      // currentPage: current,
      // numOfPerPage: pageSize,
    };
    const { data } = await useMainGetData(reqParams);
    products.value = data.value.map((item) => ({
      id: item.objectID,
      name: item.productName,
      model: item.srlID,
      logo: '',
      description: '',
      prices: [],
      specifications: [],
      images: [],
      objectID: item.objectID,
    }));
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
}
// 初始加载
onMounted(async () => {
  fetchProductsList();
});
// const products = ref([
//   {
//     id: 1,
//     name: '男士裤子',
//     model: '长裤',
//     logo: 'https://img2.baidu.com/it/u=2862876734,471387334&fm=253&fmt=auto&app=120&f=JPEG?w=475&h=475',
//     description:
//       '这是男士长裤的简介这是男士长裤的简介这是男士长裤的简介这是男士长裤的简介这是男士长裤的简介这是男士长裤的简介这是男士长裤的简介这是男士长裤的简介',
//     prices: [
//       {
//         id: 1,
//         sellingPrice: '1490-20241229084904-00008765-0001',
//         quoteSpec: '标准',
//         distributorPrice: '￥80.00',
//         retailPrice: '￥100.00',
//       },
//       {
//         id: 2,
//         sellingPrice: '1490-20241229084904-00008765-0002',
//         quoteSpec: '高级',
//         distributorPrice: '￥80.00',
//         retailPrice: '￥100.00',
//       },
//     ],
//     specifications: [
//       { id: 1, name: '颜色', values: ['白色', '灰色', '黑色', '蓝色'] },
//       { id: 2, name: '尺寸', values: ['M', 'L', 'XL', 'XXL'] },
//     ],
//     images: [
//       {
//         id: 1,
//         url: 'https://img0.baidu.com/it/u=430812883,221253080&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1069',
//       },
//       {
//         id: 2,
//         url: 'https://img0.baidu.com/it/u=430812883,221253080&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1069',
//       },
//       {
//         id: 3,
//         url: 'https://img0.baidu.com/it/u=430812883,221253080&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1069',
//       },
//     ],
//   },
//   {
//     id: 2,
//     name: '男士裤子',
//     model: '短裤',
//     logo: 'https://via.placeholder.com/150',
//     description: '这是男士短裤的简介这是男士短裤的简介这是男士短裤的简介',
//     prices: [
//       {
//         id: 1,
//         sellingPrice: '1490-20241229084904-00008765-0001',
//         quoteSpec: '标准',
//         distributorPrice: '￥80.00',
//         retailPrice: '￥100.00',
//       },
//       {
//         id: 2,
//         sellingPrice: '1490-20241229084904-00008765-0002',
//         quoteSpec: '高级',
//         distributorPrice: '￥80.00',
//         retailPrice: '￥100.00',
//       },
//     ],
//     specifications: [
//       { id: 1, name: '颜色', values: ['白色', '灰色', '黑色', '蓝色'] },
//       { id: 2, name: '尺寸', values: ['M', 'L', 'XL', 'XXL'] },
//     ],
//     images: [
//       { id: 1, url: 'https://via.placeholder.com/300' },
//       { id: 2, url: 'https://via.placeholder.com/300' },
//     ],
//   },
// ]);

// 计算属性
// const filteredProducts = computed(() => {
//   return products.value.filter((product) => {
//     return (
//       product.name.includes(productSearch.value) &&
//       product.model.includes(modelSearch.value)
//     );
//   });
// });

// 重置
// const resetSearch = () => {
//   productSearch.value = '';
//   modelSearch.value = '';
// };

// const editPrice = (price) => {};

// const deletePrice = (price) => {};

// const updateQuote = (price) => {};
</script>

<template>
  <div class="container mx-auto p-4">
    <!-- 搜索区域 -->
    <!-- <div class="mb-2 rounded-lg bg-white p-4 shadow-sm">
      <input
        v-model="productSearch"
        type="text"
        placeholder="搜索产品"
        class="flex-1 rounded border border-gray-300 p-2"
      />
      <input
        v-model="modelSearch"
        type="text"
        placeholder="搜索型号"
        class="flex-1 rounded border border-gray-300 p-2"
      />
      <button @click="resetSearch" class="rounded bg-gray-500 p-2 text-white">
        搜索
      </button>
      <button @click="resetSearch" class="rounded bg-gray-500 p-2 text-white">
        重置
      </button>
    </div> -->
    <!-- 产品区域 -->
    <div class="flex border-b-2 border-yellow-500">
      <!-- 选项卡区域 -->
      <div class="tabs flex-1">
        <button
          @click="activeTab = 'introduction'"
          :class="{ 'bg-yellow-500 text-white': activeTab === 'introduction' }"
          class="rounded-t-lg p-2 pl-4 pr-4"
        >
          产品介绍
        </button>
        <button
          @click="activeTab = 'specifications'"
          :class="{
            'bg-yellow-500 text-white': activeTab === 'specifications',
          }"
          class="rounded-t-lg p-2 pl-4 pr-4"
        >
          规格
        </button>
        <button
          @click="activeTab = 'images'"
          :class="{ 'bg-yellow-500 text-white': activeTab === 'images' }"
          class="rounded-t-lg p-2 pl-4 pr-4"
        >
          产品图片
        </button>
      </div>
      <div class="flex-none text-right">
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
          新增产品型号
        </button>
      </div>
    </div>
    <!-- 产品介绍选项卡 -->
    <div v-if="activeTab === 'introduction'" class="mt-4">
      <!-- 产品列表 -->
      <div
        v-for="(product, index) in products"
        :key="product.id"
        class="mb-4 rounded-lg shadow-sm hover:shadow-md"
      >
        <div
          class="flex items-center justify-between rounded-t-lg border bg-white p-4 text-lg font-medium text-gray-800"
        >
          <span class="mr-2 h-2 w-2 flex-none rounded-full bg-green-500"></span
          >产品：{{ product.name }}
          <span class="ml-10 flex-1">型号：{{ product.model }}</span>
          <button class="btn-text-danger flex-none">
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
          <svg
            class="h-6 w-6 transform cursor-pointer text-gray-600 transition-transform"
            :class="{ 'rotate-180': expandedIndex === index }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            @click="toggleExpand(index, product)"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        <div
          v-if="expandedIndex === index"
          class="rounded-b-lg border bg-white p-4"
        >
          <div class="mb-4 flex">
            <img
              :src="product.logo"
              alt="Product Logo"
              class="h-24 w-24 flex-none"
            />
            <p class="flex-1">{{ product.description }}</p>
          </div>
          <div class="">
            <table class="w-full border-collapse">
              <tr class="bg-gray-200">
                <th class="p-2 text-left font-medium">售价标识</th>
                <th class="p-2 text-left font-medium">报价规格</th>
                <th class="p-2 text-left font-medium">分销商价格</th>
                <th class="p-2 text-left font-medium">终端价格</th>
                <th class="p-2 text-left font-medium">操作</th>
              </tr>

              <tr
                v-for="price in product.prices"
                :key="price.id"
                class="border-b"
              >
                <td class="p-2">{{ price.sellingPrice }}</td>
                <td class="p-2 text-left">{{ price.quoteSpec }}</td>
                <td class="p-2 text-left">{{ price.distributorPrice }}</td>
                <td class="p-2 text-left">{{ price.retailPrice }}</td>
                <td class="p-2 text-left">
                  <button
                    @click="editPrice(price)"
                    class="rounded p-1 text-blue-500"
                  >
                    修改
                  </button>
                  <button
                    @click="deletePrice(price)"
                    class="rounded p-1 text-red-500"
                  >
                    删除
                  </button>
                  <button
                    @click="updateQuote(price)"
                    class="rounded p-1 text-green-500"
                  >
                    更新报价
                  </button>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- 产品规格选项卡 -->
    <div v-if="activeTab === 'specifications'" class="mt-4">
      <div
        v-for="(product, index) in products"
        :key="product.id"
        class="mb-4 shadow-sm hover:shadow-md"
      >
        <div
          class="flex items-center justify-between rounded-t-lg border bg-white p-4 text-lg font-medium text-gray-800"
        >
          <span class="mr-2 h-2 w-2 flex-none rounded-full bg-green-500"></span
          >产品：{{ product.name }}
          <span class="ml-10 flex-1">型号：{{ product.model }}</span>
          <button class="btn-text-danger flex-none">
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
          <button class="btn-text-primary">
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
          <svg
            class="h-6 w-6 transform cursor-pointer text-gray-600 transition-transform"
            :class="{ 'rotate-180': expandedIndex === index }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            @click="toggleExpand(index, product)"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        <div
          v-if="expandedIndex === index"
          class="rounded-b-lg border bg-white"
        >
          <div
            v-for="(spec, specType) in product.specifications"
            :key="specType"
            class="border-b border-gray-100 hover:bg-gray-50"
          >
            <div
              @click="toggleSpecExpand(spec.id, specType, product)"
              class="flex cursor-pointer items-center justify-between bg-white px-4 py-3"
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
                <span class="font-sm text-base text-gray-700"
                  >规格：{{ spec.name }}</span
                >
              </dt>
              <svg
                class="h-6 w-6 transform text-gray-600 transition-transform"
                :class="{
                  'rotate-180': expandedSpecs.includes(spec.id),
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
            <div
              v-if="expandedSpecs.includes(spec.id)"
              class="flex bg-white p-4"
            >
              <div
                v-for="value in spec.values"
                :key="value.id"
                class="mb-1 mr-4 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm"
              >
                {{ value.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 产品图片选项卡 -->
    <div v-if="activeTab === 'images'" class="mt-4">
      <div
        v-for="(product, index) in products"
        :key="product.id"
        class="mb-4 shadow-sm hover:shadow-md"
      >
        <div
          class="flex items-center justify-between rounded-t-lg border bg-white p-4 text-lg font-medium text-gray-800"
        >
          <span class="mr-2 h-2 w-2 flex-none rounded-full bg-green-500"></span
          >产品：{{ product.name }}
          <span class="ml-10 flex-1">型号：{{ product.model }}</span>
          <button class="btn-text-danger flex-none">
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
          <svg
            class="h-6 w-6 transform cursor-pointer text-gray-600 transition-transform"
            :class="{ 'rotate-180': expandedIndex === index }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            @click="toggleExpand(index, product)"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        <div
          v-if="expandedIndex === index"
          class="rounded-b-lg border bg-white p-4"
        >
          <div class="grid grid-cols-3 gap-4">
            <img
              v-for="image in product.images"
              :key="image.id"
              :src="image.url"
              alt="Product Image"
              class="h-40 w-full rounded-lg object-cover"
            />
          </div>
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
