<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Button,
  InputNumber,
  message,
  Modal,
  Pagination,
} from 'ant-design-vue';

import { mainServiceApi } from '#/api';
import { useMainGetData } from '#/composables';

// 购物车数据结构，改为店铺->商品的层级结构
const storeData = ref([]);

// 使用深度监听storeData中的quantity变化，实时更新总价
watch(
  storeData,
  () => {
    // 遍历所有店铺，更新总价和总数量
    storeData.value.forEach((store, storeIndex) => {
      updateTotals(storeIndex);
    });
  },
  { deep: true },
);

// 计算属性：是否全选
const isAllSelected = computed(() => {
  if (storeData.value.length === 0) return false;
  return storeData.value.every((store) => store.selected);
});

// 计算属性：选中的商品数量
const selectedProductsCount = computed(() => {
  let count = 0;
  storeData.value.forEach((store) => {
    store.products.forEach((product) => {
      if (product.selected) {
        count += product.quantity;
      }
    });
  });
  return count;
});

// 计算属性：选中的店铺数量
// const selectedStoresCount = computed(() => {
//   return storeData.value.filter((store) =>
//     store.products.some((product) => product.selected),
//   ).length;
// });

// 计算属性：总价
const totalPrice = computed(() => {
  let total = 0;
  storeData.value.forEach((store) => {
    store.products.forEach((product) => {
      if (product.selected) {
        total += product.price * product.quantity;
      }
    });
  });
  return total;
});

// 展开/收起店铺
const toggleStore = async (storeIndex) => {
  const store = storeData.value[storeIndex];
  store.isExpanded = !store.isExpanded;

  // 如果是展开操作且还没有加载商品列表
  if (store.isExpanded && (!store.products || store.products.length === 0)) {
    store.loading = true;
    try {
      await fetchProductList(store);
    } catch (error) {
      console.error('加载商品列表失败：', error);
      message.error('加载商品列表失败');
      store.isExpanded = false;
    } finally {
      store.loading = false;
    }
  }
};

// 切换全选状态
const toggleAllSelection = () => {
  const newState = !isAllSelected.value;
  storeData.value.forEach((store) => {
    store.selected = newState;
    store.products.forEach((product) => {
      product.selected = newState;
    });
  });
};

// 切换店铺选择状态
const toggleStoreSelection = (storeIndex) => {
  const store = storeData.value[storeIndex];
  store.selected = !store.selected;

  // 同步更新所有商品的选择状态
  store.products.forEach((product) => {
    product.selected = store.selected;
  });
};

// 切换商品选择状态
const toggleProductSelection = (storeIndex, productIndex) => {
  const product = storeData.value[storeIndex].products[productIndex];
  product.selected = !product.selected;

  // 更新店铺选择状态
  updateStoreSelectionState(storeIndex);
};

// 更新店铺选择状态
const updateStoreSelectionState = (storeIndex) => {
  const store = storeData.value[storeIndex];
  store.selected = store.products.every((product) => product.selected);
};

// 处理数量变化
const handleQuantityChange = (value, storeIndex, productIndex) => {
  const store = storeData.value[storeIndex];
  const product = store.products[productIndex];
  const params = {
    pageID: 'myCart-goods',
    pageButtonID: 'editPurchaseNum',
    actNo: store.record.actNo,
    saleCmpName: store.record.saleCmpName,
    wareName: store.record.wareName,
    prdNo: product.record.prdNo,
    purchaseCompanyName: store.record.purchaseCompanyName,
    tellerNo: store.record.tellerNo,
    prdNum: value,
  };

  mainServiceApi(params).then((res) => {
    if (res.rs === '1') {
      // 确保数量至少为1
      const quantity = Math.max(1, value);
      // 更新本地数据
      product.quantity = quantity;
      product.totalAmtAfterDiscount = product.price * quantity; // 更新折后总价
      updateTotals(storeIndex);
      // message.success('修改数量成功');
    } else {
      // message.error(res.msg || '修改数量失败');
    }
  });
};

// 移除商品
const removeProduct = (storeIndex, productIndex) => {
  const store = storeData.value[storeIndex];
  const product = store.products[productIndex];

  Modal.confirm({
    title: '提示',
    content: `确定要删除 "${product.name}" 吗？`,
    onOk: () => {
      const params = {
        pageID: 'myCart-goods',
        pageButtonID: 'deleteProduct',
        actNo: store.record.actNo,
        saleCmpName: store.record.saleCmpName,
        wareName: store.record.wareName,
        prdNo: product.record.prdNo,
        purchaseCompanyName: store.record.purchaseCompanyName,
        tellerNo: store.record.tellerNo,
      };
      // 调用删除商品的API
      mainServiceApi(params)
        .then((res) => {
          if (res.rs === '1') {
            // 删除商品成功
            store.products.splice(productIndex, 1);
            message.success('商品删除成功');

            if (store.products.length === 0) {
              storeData.value.splice(storeIndex, 1);
            } else {
              updateTotals(storeIndex);
            }
          } else {
            message.error(res.msg || '删除失败');
          }
        })
        .catch((error) => {
          message.error(`删除失败：${error.message || '服务器错误'}`);
        });
    },
  });
};

// 删除购物车
const removeCart = (store, storeIndex) => {
  Modal.confirm({
    title: '提示',
    content: `确定要删除 "${store.name}" 吗？`,
    onOk: () => {
      const params = {
        pageID: 'myCart-goods',
        pageButtonID: 'deleteCart',
        actNo: store.record.actNo,
        saleCmpName: store.record.saleCmpName,
        wareName: store.record.wareName,
        purchaseCompanyName: store.record.purchaseCompanyName,
        tellerNo: store.record.tellerNo,
      };
      // 调用删除购物车的API
      mainServiceApi(params)
        .then((res) => {
          if (res.rs === '1') {
            // 删除购物成功
            storeData.value.splice(storeIndex, 1);
            message.success('购物车删除成功');

            if (store.length === 0) {
              storeData.value.splice(storeIndex, 1);
            } else {
              updateTotals(storeIndex);
            }
          } else {
            message.error(res.msg || '删除失败');
          }
        })
        .catch((error) => {
          message.error(`删除失败：${error.message || '服务器错误'}`);
        });
    },
  });
};

// 更新店铺总价和总数量
const updateTotals = (storeIndex) => {
  const store = storeData.value[storeIndex];
  if (!store || !Array.isArray(store.products)) return;

  store.totalQuantity = store.products.reduce(
    (sum, product) => sum + (product.quantity || 0),
    0,
  );
  store.totalPrice = store.products.reduce(
    (sum, product) => sum + (product.price || 0) * (product.quantity || 0),
    0,
  );
};

// 删除选中的商品
const removeSelected = () => {
  if (selectedProductsCount.value === 0) {
    message.warning('请先选择要删除的商品');
    return;
  }

  Modal.confirm({
    title: '提示',
    content: `确定要删除选中的 ${selectedProductsCount.value} 件商品吗？`,
    onOk: () => {
      const deletePromises = [];
      const deletedItems = []; // 记录要删除的商品索引

      // 收集所有删除请求
      storeData.value.forEach((store, storeIndex) => {
        store.products.forEach((product, productIndex) => {
          if (product.selected) {
            const params = {
              pageID: 'myCart-goods',
              pageButtonID: 'deleteProduct',
              actNo: store.record.actNo,
              saleCmpName: store.record.saleCmpName,
              wareName: store.record.wareName,
              prdNo: product.record.prdNo,
              purchaseCompanyName: store.record.purchaseCompanyName,
              tellerNo: store.record.tellerNo,
            };
            deletePromises.push(
              mainServiceApi(params).then((res) => ({
                res,
                storeIndex,
                productIndex,
              })),
            );
            deletedItems.push({ storeIndex, productIndex });
          }
        });
      });

      // 批量调用API
      Promise.all(deletePromises)
        .then((results) => {
          const successCount = results.filter(
            (item) => item.res.rs === '1',
          ).length;
          if (successCount > 0) {
            message.success(`成功删除 ${successCount} 件商品`);

            // 从后往前删除，避免索引错乱
            deletedItems
              .sort(
                (a, b) =>
                  b.productIndex - a.productIndex ||
                  b.storeIndex - a.storeIndex,
              )
              .forEach(({ storeIndex, productIndex }) => {
                storeData.value[storeIndex].products.splice(productIndex, 1);

                // 如果店铺没有商品了，移除店铺
                if (storeData.value[storeIndex].products.length === 0) {
                  storeData.value.splice(storeIndex, 1);
                } else {
                  updateTotals(storeIndex);
                }
              });
          } else {
            message.error('删除失败，请稍后重试');
          }
        })
        .catch((error) => {
          message.error(`删除失败：${error.message || '服务器错误'}`);
        });
    },
  });
};

const generateOrderMainServiceApi = async (store) => {
  try {
    const data = {
      pageID: 'myCart-goods',
      pageButtonID: 'generatePurOrder',
      actNo: store.record.actNo,
      saleCmpName: store.record.saleCmpName,
      wareName: store.record.wareName,
      purchaseCompanyName: store.record.purchaseCompanyName,
      tellerNo: store.record.tellerNo,
    };
    const { rs: code } = await mainServiceApi(data);
    return code === '1';
  } catch (error) {
    console.error(error);
    return false;
  }
};

// 生成单个购物车的采购订单
const generateStoreOrder = async (storeIndex, store) => {
  const result = await generateOrderMainServiceApi(store);
  if (result) {
    message.success(`已为 ${store.name} 生成订单`);
  } else {
    message.error(`生成订单失败`);
  }
};

// 批量生成订单
// const batchGenerateOrders = async () => {
//   if (selectedStoresCount.value === 0) {
//     message.warning('请先选择要生成订单的购物车');
//     return;
//   }

//   const selectedStores = storeData.value.filter((store) =>
//     store.products.some((product) => product.selected),
//   );

//   Modal.confirm({
//     title: '提示',
//     content: `确定要为 ${selectedStores.length} 个购物车生成采购订单吗？`,
//     onOk: async () => {
//       const results = [];

//       // 改为顺序执行，避免并发问题
//       for (const store of selectedStores) {
//         try {
//           const result = await generateOrderMainServiceApi(store);
//           results.push(result);
//           if (result) {
//             message.success(`已为 ${store.name} 生成采购订单`);
//           }
//           // 添加短暂延迟，减轻服务器压力
//           await new Promise((resolve) => setTimeout(resolve, 500));
//         } catch (error) {
//           console.error(`为 ${store.name} 生成订单失败:`, error);
//           results.push(false);
//         }
//       }

//       const successCount = results.filter(Boolean).length;
//       if (successCount > 0) {
//         message.success(
//           `成功为 ${successCount}/${selectedStores.length} 个购物车生成采购订单`,
//         );
//       } else {
//         message.error('生成采购订单失败');
//       }

//       // 刷新购物车列表
//       fetchStoreList();
//     },
//   });
// };

// 分页相关数据
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `共 ${total} 条`,
});

// 处理页码改变
const handlePageChange = (page, pageSize) => {
  pagination.current = page;
  pagination.pageSize = pageSize;
  fetchStoreList();
};

// 在模板中添加加载状态
const loading = ref(true);
// 查询店铺列表
const fetchStoreList = async () => {
  loading.value = true;
  const userInfo = JSON.parse(
    window.sessionStorage.getItem('userInfo') || '{}',
  );
  try {
    const { current, pageSize } = pagination;
    const reqParams = {
      pageID: '',
      pageDataGrpID: 'hobyShopCartPreview',
      currentPage: current,
      numOfPerPage: pageSize,
      purchaseCompanyName: userInfo?.TELLERCOMPANY || '',
      tellerNo: userInfo?.tellerNo || '',
    };
    console.warn('发送请求参数:', reqParams); // 添加请求参数日志

    const response = await useMainGetData(reqParams, true);
    console.warn('完整响应:', response); // 添加完整响应日志

    const data = response.data;
    console.warn('响应数据:', data?.value); // 添加数据日志

    // 处理返回的数据结构
    const cartInfo = await data.value;
    console.warn('购物车信息:', cartInfo);

    // 确保 cartInfo 存在且有数据
    if (!cartInfo || cartInfo.length === 0) {
      message.info('购物车为空');
      storeData.value = [];
      pagination.total = 0;
      return;
    }

    storeData.value = cartInfo.map((item) => ({
      name: item.saleCmpName,
      wareName: item.wareName,
      selected: false,
      isExpanded: false,
      totalPrice: Number.parseFloat(item.totalAmtAfterDiscount) || 0,
      totalQuantity: Number.parseInt(item.prdNum) || 0,
      record: item, // 保存原始记录，用于后续操作
      products: (item.myCartGoodsInfo || []).map((goods) => ({
        id: goods.prdNo,
        selected: false,
        name: `${goods.providePrd || ''}-${goods.provideSrlID || ''}`,
        specs: [goods.wareAttrValueList || ''],
        price: Number.parseFloat(goods.priceAfterDiscount) || 0,
        totalAmtAfterDiscount:
          Number.parseFloat(goods.totalAmtAfterDiscount) || 0,
        quantity: Number.parseInt(goods.prdNum) || 0,
        record: goods, // 保存原始商品记录
      })),
      loading: false,
    }));

    console.warn('店铺数据:', storeData.value);
    // 默认展开第一个店铺
    storeData.value[0].isExpanded = true;
    // 更新分页信息
    pagination.total = cartInfo.length || 0;
  } catch (error) {
    console.error('获取店铺列表失败：', error);
    message.error('获取店铺列表失败');
  } finally {
    loading.value = false;
  }
};

// 根据店铺查询商品列表
const fetchProductList = async (store) => {
  try {
    // 直接从店铺的record中获取商品列表
    const products = store.record.myCartGoodsInfo || [];

    store.products = products.map((item) => ({
      id: item.prdNo,
      selected: false,
      name: `${item.providePrd || ''}-${item.provideSrlID || ''}`,
      specs: [item.wareAttrValueList || ''],
      price: Number.parseFloat(item.priceAfterDiscount) || 0,
      totalAmtAfterDiscount: Number.parseFloat(item.totalAmtAfterDiscount) || 0,
      quantity: Number.parseInt(item.prdNum) || 0,
      record: item, // 保存原始商品记录
    }));
    console.warn('商品列表:', store.products);
  } catch (error) {
    console.error('获取商品列表失败：', error);
    store.products = [];
    message.error('获取商品列表失败');
  }
};

// 页面加载时获取店铺列表
onMounted(() => {
  fetchStoreList();
});
</script>

<template>
  <Page auto-content-height>
    <div
      class="relative mx-auto h-full overflow-hidden rounded-md bg-white shadow-md"
    >
      <!-- 表头 -->
      <div
        class="grid grid-cols-12 border-b bg-gray-100 py-4 text-center font-medium text-gray-700"
      >
        <div class="col-span-4">商品信息</div>
        <div class="col-span-2">折后单价</div>
        <div class="col-span-2">数量</div>
        <div class="col-span-2">折后总价</div>
        <div class="col-span-2">操作</div>
      </div>

      <!-- 购物车内容 -->
      <div class="divide-y pb-20">
        <!-- 店铺区块 -->
        <div
          v-for="(store, storeIndex) in storeData"
          :key="storeIndex"
          class="mb-4 border-b"
        >
          <!-- 店铺标题 -->
          <div class="flex items-center bg-white px-4 py-2">
            <input
              type="checkbox"
              :checked="store.selected"
              @change="toggleStoreSelection(storeIndex)"
              class="mr-2 h-4 w-4 accent-blue-500"
            />
            <div class="text-sm text-gray-600">
              <span>卖家：{{ store.name }}</span>
              <span class="ml-8">店铺：{{ store.wareName }}</span>
              <span class="ml-8"
                >折后总价：¥ {{ store.totalPrice.toFixed(2) }}</span
              >
              <span class="ml-8">商品数量：{{ store.totalQuantity }}</span>
            </div>
            <div class="ml-auto flex items-center space-x-2">
              <Button
                size="small"
                class="rounded border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
                @click="removeCart(store, storeIndex)"
              >
                删除购物车
              </Button>
              <Button
                size="small"
                class="rounded border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
                @click="generateStoreOrder(storeIndex, store)"
              >
                生成订单
              </Button>
              <Button
                type="text"
                class="transform rounded border p-1 text-gray-500 transition-transform duration-200 focus:outline-none"
                :class="{ 'rotate-180': store.isExpanded }"
                @click="toggleStore(storeIndex)"
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
              </Button>
            </div>
          </div>

          <!-- 店铺商品列表（可展开/收起） -->
          <transition
            v-if="store.products && store.products.length > 0"
            enter-active-class="transition-all duration-300 ease-in-out"
            leave-active-class="transition-all duration-300 ease-in-out"
            enter-from-class="max-h-0 opacity-0"
            enter-to-class="max-h-[1000px] opacity-100"
            leave-from-class="max-h-[1000px] opacity-100"
            leave-to-class="max-h-0 opacity-0"
          >
            <div v-show="store.isExpanded" class="overflow-hidden">
              <!-- 加载状态 -->
              <div
                v-if="store.loading"
                class="flex items-center justify-center py-8"
              >
                <div class="text-center text-gray-500">
                  <div class="mb-2">加载中...</div>
                </div>
              </div>
              <!-- 空状态 -->
              <div
                v-else-if="!store.products || store.products.length === 0"
                class="py-8 text-center text-gray-500"
              >
                暂无商品数据
              </div>
              <!-- 商品列表 -->
              <template v-else>
                <div
                  v-for="(product, productIndex) in store.products"
                  :key="productIndex"
                  class="border-t"
                >
                  <div class="grid grid-cols-12 items-center px-4 py-4">
                    <!-- 商品信息 -->
                    <div class="col-span-4 flex">
                      <input
                        type="checkbox"
                        :checked="product.selected"
                        @change="
                          toggleProductSelection(storeIndex, productIndex)
                        "
                        class="mr-2 h-4 w-4 self-center accent-blue-500"
                      />
                      <div class="flex">
                        <div class="ml-4 flex flex-col justify-between py-1">
                          <div class="text-sm font-medium">
                            {{ product.name }}
                          </div>
                          <div
                            v-for="(spec, index) in product.specs"
                            :key="index"
                            class="text-xs text-gray-500"
                          >
                            {{ spec }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- 单价 -->
                    <div class="col-span-2 text-center">
                      <span class="text-red-500"
                        >¥ {{ product.price.toFixed(2) }}</span
                      >
                    </div>
                    <!-- 数量 -->
                    <div class="col-span-2 flex justify-center">
                      <InputNumber
                        v-model:value="product.quantity"
                        :min="1"
                        @change="
                          (value) =>
                            handleQuantityChange(
                              value,
                              storeIndex,
                              productIndex,
                            )
                        "
                        class="w-70"
                      />
                    </div>
                    <!-- 折后总价 -->
                    <div class="col-span-2 text-center">
                      <span class="text-red-500"
                        >¥ {{ product.totalAmtAfterDiscount.toFixed(2) }}</span
                      >
                    </div>
                    <!-- 操作 -->
                    <div class="col-span-2 text-center">
                      <button
                        @click="removeProduct(storeIndex, productIndex)"
                        class="text-gray-500 hover:text-red-500"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </transition>
        </div>
      </div>

      <!-- 底部操作栏 -->
      <div
        class="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between border-t bg-white px-6 py-4 shadow-md"
      >
        <div class="flex items-center">
          <input
            type="checkbox"
            :checked="isAllSelected"
            @change="toggleAllSelection"
            class="mr-2 h-4 w-4 accent-blue-500"
          />
          <span class="mr-4 text-sm">全选</span>
          <button
            @click="removeSelected"
            class="mr-4 text-sm text-gray-600 hover:text-red-500"
          >
            删除选中
          </button>
          <div class="ml-4 border-l pl-4">
            <Pagination
              v-model:current="pagination.current"
              v-model:page-size="pagination.pageSize"
              :total="pagination.total"
              :show-size-changer="pagination.showSizeChanger"
              :show-quick-jumper="pagination.showQuickJumper"
              :show-total="pagination.showTotal"
              @change="handlePageChange"
              size="small"
            />
          </div>
        </div>
        <div class="flex items-center">
          <div class="mr-6">
            <span class="text-sm text-gray-600"
              >已选商品
              <span class="font-medium text-red-500">{{
                selectedProductsCount
              }}</span>
              件</span
            >
            <span class="ml-4 text-sm text-gray-600"
              >合计：<span class="text-xl font-medium text-red-500"
                >¥ {{ totalPrice.toFixed(2) }}</span
              ></span
            >
          </div>
          <!-- <button
            @click="batchGenerateOrders"
            class="rounded bg-red-500 px-6 py-2 text-white transition-colors hover:bg-red-600"
            :disabled="selectedStoresCount === 0"
            :class="{
              'cursor-not-allowed opacity-50': selectedStoresCount === 0,
            }"
          >
            批量生成采购订单 ({{ selectedStoresCount }}笔)
          </button> -->
        </div>
      </div>
    </div>
  </Page>
</template>

<style scoped>
/* 可以添加额外的自定义样式 */
</style>
