<script setup>
import { computed, onMounted, ref } from 'vue';

import { useMainGetData } from '#/composables';

import EditProductModel from './components/EditProductModel.vue';

// 数据
// const productSearch = ref('');
// const modelSearch = ref('');
// const activeTab = ref('introduction');
// 默认折叠
// const expandedIndex = ref();
// const expandedSpecs = ref([]);

// 切换产品型号展开状态
// const toggleExpand = (index, product) => {
//   expandedIndex.value = expandedIndex.value === index ? null : index;
//   fetchSpecsList(product);
//   fetchPricesList(product);
//   // fetchImgsList(product);
//   console.warn('产品型号', product);
// };

// const toggleSpecExpand = (specId, specType, product) => {
//   if (expandedSpecs.value.includes(specId)) {
//     expandedSpecs.value = expandedSpecs.value.filter((id) => id !== specId);
//   } else {
//     expandedSpecs.value.push(specId);
//   }
//   fetchSpecValueList(product, specType);
//   console.warn('序号', specId, specType, product);
// };

// 根据产品型号查询规格类型名称
// const fetchSpecsList = async (product) => {
//   console.warn('fetchSpecsList:product', product);

//   const reqParams = {
//     pageID: 'productModel',
//     pageDataGrpID: 'queryProductModelSpecCate',
//     productName: product.name,
//     srlID: product.model,
//     // currentPage: current,
//     // numOfPerPage: pageSize,
//   };
//   const { data } = await useMainGetData(reqParams);
//   console.warn('fetchSpecsList:data', data.value);
//   products.value.forEach((item) => {
//     if (item.name === product.name && item.model === product.model) {
//       item.specifications = data.value.map((item, index) => ({
//         id: index,
//         name: item.specCate,
//         values: [],
//       }));
//     }
//   });
// };
// 根据规格类型查询规格值
// const fetchSpecValueList = async (spec, index) => {
//   console.warn('fetchSpecValueList:', spec, index, spec.specifications[0].name);
//   const reqParams = {
//     pageID: 'productModel',
//     pageDataGrpID: 'queryProductModelSpecValue',
//     productName: spec.name,
//     srlID: spec.model,
//     specCate: spec.specifications[index].name,
//   };
//   const { data } = await useMainGetData(reqParams);
//   console.warn('fetchSpecValueList:data', data.value, products.value, spec);
//   spec.specifications.forEach((item) => {
//     if (item.name === spec.specifications[index].name) {
//       item.values = data.value.map((item) => ({
//         title: item.specValue,
//       }));
//     }
//   });
// };
// 根据产品型号查询产品报价
// const fetchPricesList = async (product) => {
//   console.warn('fetchPricesList:product', product);

//   const reqParams = {
//     pageID: 'productModel',
//     pageDataGrpID: 'queryProductQuotation',
//     productName: product.name,
//     srlID: product.model,
//     // currentPage: current,
//     // numOfPerPage: pageSize,
//   };
//   const { data } = await useMainGetData(reqParams);
//   console.warn('fetchPricesList:data', data.value);
//   products.value.forEach((item) => {
//     if (item.name === product.name && item.model === product.model) {
//       item.prices = data.value.map((item, index) => ({
//         id: index,
//         sellingPrice: item.salePriceID,
//         quoteSpec: item.quotationsSpec,
//         distributorPrice: item.distributorPrice,
//         retailPrice: item.terminalPrice,
//       }));
//     }
//   });
// };
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
      specAttrCateListForWare: item.specAttrCateListForWare,
      specAttrCateListForPrice: item.specAttrCateListForPrice,
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
// 编辑模态框状态
// const isEditModalOpen = ref(false);
const currentEditingProduct = ref(null);
const editProductModelRef = ref(null);

// 打开编辑模态框
const openEditModal = (product) => {
  // console.log('openEditModal:product', product);

  currentEditingProduct.value = product;
  // isEditModalOpen.value = true;
  editProductModelRef.value.open(product);
};
const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页显示的规格数量
// 计算总页数
const totalPages = computed(() =>
  Math.ceil(products.value.length / pageSize.value),
);
const productQuery = ref(''); // 搜索关键词
// 搜索功能
const search = () => {
  // 根据 productQuery过滤数据
};

// 重置功能
const reset = () => {
  productQuery.value = '';
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
// 跳转到指定页
const goToPage = (page) => {
  currentPage.value = page;
};
// 重置页码
const resetPage = () => {
  currentPage.value = 1;
};
</script>

<template>
  <div class="absolute inset-0 w-full p-4">
    <div class="mx-auto flex h-screen flex-col">
      <!-- 顶部搜索区域 -->
      <div
        class="flex-shrink-0 rounded-lg border-b border-gray-200 bg-white p-4"
      >
        <div class="flex space-x-4">
          <div class="flex-1">
            <label>产品：</label>
            <input
              v-model="productQuery"
              type="text"
              placeholder="请输入产品"
              class="rounded-lg border px-3 py-1 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200"
              @keyup.enter="search"
            />
          </div>
          <div class="flex-1">
            <label>型号：</label>
            <input
              v-model="srlIDQuery"
              type="text"
              placeholder="请输入型号"
              class="rounded-lg border px-3 py-1 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200"
              @keyup.enter="search"
            />
          </div>
          <div class="flex-none">
            <button
              @click="search"
              class="rounded-lg bg-blue-600 px-4 py-1 text-white"
              style="letter-spacing: 4px"
            >
              搜索
            </button>
            <button
              @click="reset"
              class="ml-2 rounded-lg border border-gray-200 bg-white px-4 py-1"
              style="letter-spacing: 4px"
            >
              重置
            </button>
          </div>
        </div>
      </div>
      <!-- 新增产品型号按钮 -->
      <div class="my-4 ml-auto flex-shrink-0 text-right">
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
          新增产品型号
        </button>
      </div>
      <!-- 产品介绍选项卡 -->
      <div class="mb-4 flex-grow overflow-y-auto pb-28">
        <!-- 产品列表 -->
        <div
          v-for="product in products"
          :key="product.id"
          class="mb-4 rounded-lg shadow-sm hover:shadow-md"
        >
          <div
            class="flex items-center justify-between rounded-t-lg border bg-white p-4 text-lg font-medium text-gray-800"
          >
            <span
              class="mr-2 h-2 w-2 flex-none rounded-full bg-green-500"
            ></span
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
              编辑产品型号
            </button>
          </div>
        </div>
      </div>
      <!-- 分页 -->
      <div
        class="fixed bottom-0 right-0 mt-2 w-full flex-shrink-0 justify-end border border-t-gray-200 bg-white px-4 py-2 shadow-lg"
      >
        <div class="flex items-center justify-between">
          <div class="mr-3 flex-1 text-right text-sm text-gray-600">
            共 {{ products.length }} 条
          </div>
          <div class="flex flex-none items-center space-x-4">
            <!-- 分页按钮 -->
            <div class="flex items-center space-x-2">
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="rounded-l bg-white p-2 text-lg text-gray-900 disabled:text-gray-400"
              >
                &lt;
              </button>
              <!-- <span class="bg-gray-200 p-2"
                >{{ currentPage }} / {{ totalPages }}</span
              > -->
              <button
                v-for="page in totalPages"
                :key="page"
                @click="goToPage(page)"
                :class="{
                  'border border-blue-500 font-medium text-blue-950':
                    currentPage === page,
                  'bg-white': currentPage !== page,
                }"
                class="rounded-lg px-3 py-1"
              >
                {{ page }}
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="rounded-r bg-white p-2 text-lg text-gray-900 disabled:text-gray-400"
              >
                &gt;
              </button>
            </div>
            <!-- 每页条数选择 -->
            <select
              v-model="pageSize"
              @change="resetPage"
              class="rounded-lg border p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200"
            >
              <option value="10">10 条/页</option>
              <option value="20">20 条/页</option>
              <option value="50">50 条/页</option>
              <option value="100">100 条/页</option>
            </select>
          </div>
        </div>
      </div>
      <!-- 编辑产品型号 -->
      <EditProductModel ref="editProductModelRef" />
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
