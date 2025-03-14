<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, InputNumber, message, Pagination } from 'ant-design-vue';

import { mainServiceApi } from '#/api';
import { useMainGetData } from '#/composables';

// 购物车数据结构重构，改为订单->店铺->商品的层级结构
const cartData = ref([]);

// 使用深度监听cartData中的quantity变化，实时更新总价
watch(
  cartData,
  () => {
    // 遍历所有订单和店铺，更新总价和总数量
    cartData.value.forEach((order, orderIndex) => {
      order.stores.forEach((store, storeIndex) => {
        updateTotals(orderIndex, storeIndex);
      });
    });
  },
  { deep: true },
);

// 计算属性：是否全选
const isAllSelected = computed(() => {
  if (cartData.value.length === 0) return false;
  return cartData.value.every((order) => order.selected);
});

// 计算属性：选中的商品数量
const selectedProductsCount = computed(() => {
  let count = 0;
  cartData.value.forEach((order) => {
    order.stores.forEach((store) => {
      store.products.forEach((product) => {
        if (product.selected) {
          count += product.quantity;
        }
      });
    });
  });
  return count;
});

// 计算属性：选中的订单数量
const selectedOrdersCount = computed(() => {
  let count = 0;
  cartData.value.forEach((order) => {
    // 检查订单是否有选中的商品
    const hasSelectedProducts = order.stores.some((store) =>
      store.products.some((product) => product.selected),
    );
    if (hasSelectedProducts) {
      count++;
    }
  });
  return count;
});

// 计算属性：总价
const totalPrice = computed(() => {
  let total = 0;
  cartData.value.forEach((order) => {
    order.stores.forEach((store) => {
      store.products.forEach((product) => {
        if (product.selected) {
          total += product.price * product.quantity;
        }
      });
    });
  });
  return total;
});

// 展开/收起订单
const toggleOrder = async (orderIndex) => {
  const order = cartData.value[orderIndex];
  order.isExpanded = !order.isExpanded;

  // 如果是展开操作且还没有加载店铺列表
  if (order.isExpanded && (!order.stores || order.stores.length === 0)) {
    order.loading = true; // 添加加载状态
    try {
      const stores = await fetchStoreList(order);
      if (Array.isArray(stores) && stores.length > 0) {
        cartData.value[orderIndex].stores = stores;
        // 如果是第一次加载，默认展开第一个店铺并加载商品
        if (stores[0]) {
          stores[0].isExpanded = true;
          stores[0].loading = true; // 添加商品加载状态
          await fetchProductList(stores[0]);
          stores[0].loading = false;
        }
      }
    } catch (error) {
      console.error('加载店铺列表失败：', error);
      message.error('加载店铺列表失败');
      order.isExpanded = false;
    } finally {
      order.loading = false;
    }
  }
};

// 展开/收起店铺
const toggleStore = async (orderIndex, storeIndex, store) => {
  store.isExpanded = !store.isExpanded;

  // 如果是展开操作且还没有加载商品列表
  if (store.isExpanded && (!store.products || store.products.length === 0)) {
    store.loading = true; // 添加加载状态
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
  cartData.value.forEach((order) => {
    order.selected = newState;
    order.stores.forEach((store) => {
      store.selected = newState;
      store.products.forEach((product) => {
        product.selected = newState;
      });
    });
  });
};

// 切换订单选择状态
const toggleOrderSelection = (orderIndex) => {
  const order = cartData.value[orderIndex];
  order.selected = !order.selected;

  // 同步更新所有店铺和商品的选择状态
  order.stores.forEach((store) => {
    store.selected = order.selected;
    store.products.forEach((product) => {
      product.selected = order.selected;
    });
  });
};

// 切换店铺选择状态
const toggleStoreSelection = (orderIndex, storeIndex) => {
  const store = cartData.value[orderIndex].stores[storeIndex];
  store.selected = !store.selected;

  // 同步更新所有商品的选择状态
  store.products.forEach((product) => {
    product.selected = store.selected;
  });

  // 检查是否所有店铺都被选中，更新订单选择状态
  updateOrderSelectionState(orderIndex);
};

// 切换商品选择状态
const toggleProductSelection = (orderIndex, storeIndex, productIndex) => {
  const product =
    cartData.value[orderIndex].stores[storeIndex].products[productIndex];
  product.selected = !product.selected;

  // 检查是否所有商品都被选中，更新店铺和订单选择状态
  updateStoreSelectionState(orderIndex, storeIndex);
  updateOrderSelectionState(orderIndex);
};

// 更新店铺选择状态
const updateStoreSelectionState = (orderIndex, storeIndex) => {
  const store = cartData.value[orderIndex].stores[storeIndex];
  store.selected = store.products.every((product) => product.selected);
};

// 更新订单选择状态
const updateOrderSelectionState = (orderIndex) => {
  const order = cartData.value[orderIndex];
  order.selected = order.stores.every((store) => store.selected);
};

// 处理数量变化
const handleQuantityChange = (value, orderIndex, storeIndex, productIndex) => {
  // 确保数量至少为1
  const quantity = Math.max(1, value);
  cartData.value[orderIndex].stores[storeIndex].products[
    productIndex
  ].quantity = quantity;
  updateTotals(orderIndex, storeIndex);
};

// 移除商品
const removeProduct = (orderIndex, storeIndex, productIndex) => {
  const store = cartData.value[orderIndex].stores[storeIndex];
  store.products.splice(productIndex, 1);

  // 如果店铺没有商品了，移除店铺
  if (store.products.length === 0) {
    cartData.value[orderIndex].stores.splice(storeIndex, 1);

    // 如果订单没有店铺了，移除订单
    if (cartData.value[orderIndex].stores.length === 0) {
      cartData.value.splice(orderIndex, 1);
    }
  } else {
    updateTotals(orderIndex, storeIndex);
  }
};

// 更新店铺总价和总数量
const updateTotals = (orderIndex, storeIndex) => {
  const store = cartData.value[orderIndex]?.stores[storeIndex];
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
  // 从后往前遍历，避免删除时索引变化
  for (let i = cartData.value.length - 1; i >= 0; i--) {
    const order = cartData.value[i];

    for (let j = order.stores.length - 1; j >= 0; j--) {
      const store = order.stores[j];

      for (let k = store.products.length - 1; k >= 0; k--) {
        if (store.products[k].selected) {
          store.products.splice(k, 1);
        }
      }

      // 如果店铺没有商品了，移除店铺
      if (store.products.length === 0) {
        order.stores.splice(j, 1);
      } else {
        updateTotals(i, j);
      }
    }

    // 如果订单没有店铺了，移除订单
    if (order.stores.length === 0) {
      cartData.value.splice(i, 1);
    }
  }
};

const generateOrderMainServiceApi = async (order) => {
  try {
    const data = {
      pageID: 'mySaleOrderRestockCartPage', // 页面ID
      pageButtonID: 'genRestockOrderForOneShopOfSaleOrder', // 按钮ID
      actNo: order.record.actNo,
      saleCmpName: order.record.saleCmpName,
      wareName: order.record.wareName,
      purchaseCompanyName: order.record.purchaseCompanyName,
      tellerNo: order.record.tellerNo,
      oriBillNo: order.record.tellerNo,
    };
    const { rs: code } = await mainServiceApi(data);
    return code === '1';
  } catch (error) {
    console.error(error);
    return false;
  }
};

// 生成单个订单的进货订单
const generateOrder = (orderIndex) => {
  const order = cartData.value[orderIndex];
  message.success(`已为销售订单 ${order.orderNumber} 生成进货订单`);
};

// 生成单个店铺的进货订单
const generateStoreOrder = async (orderIndex, storeIndex, store) => {
  const order = cartData.value[orderIndex];
  const result = await generateOrderMainServiceApi(store);
  if (result) {
    message.success(
      `已为销售订单 ${order.orderNumber} 的 ${store.name} 生成进货订单`,
    );
  } else {
    message.error(`生成进货订单失败`);
  }
};

// 批量生成订单
const batchGenerateOrders = () => {
  if (selectedOrdersCount.value === 0) return;

  const generatedOrders = [];

  cartData.value.forEach((order) => {
    // 检查订单是否有选中的商品
    const hasSelectedProducts = order.stores.some((store) =>
      store.products.some((product) => product.selected),
    );

    if (hasSelectedProducts) {
      generatedOrders.push({
        orderNumber: order.orderNumber,
      });
    }
  });

  // 这里可以添加批量生成订单的逻辑
  message.success(`已批量生成 ${generatedOrders.length} 笔进货订单`);
};

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
  // 这里调用获取数据的方法
  fetchOrderList();
};

// 查询订单列表
const fetchOrderList = async () => {
  try {
    const { current, pageSize } = pagination;
    const reqParams = {
      pageID: 'mySaleOrderRestockCartPage',
      pageDataGrpID: 'myRestockCartSaleOrderInfo',
      currentPage: current,
      numOfPerPage: pageSize,
    };
    const { data, total } = await useMainGetData(reqParams);
    console.warn('fetchOrderList:data', data.value);

    // 将原始数据转换为目标格式
    const orderList = (data.value || []).map((item) => ({
      orderNumber: item.billNo,
      selected: false,
      isExpanded: false,
      record: item,
      stores: [],
    }));
    cartData.value = orderList;

    // 默认展开第一个订单
    if (cartData.value.length > 0) {
      cartData.value[0].isExpanded = true;

      // 默认展开第一个店铺并加载其商品
      const stores = await fetchStoreList(orderList[0]);
      if (Array.isArray(stores) && stores.length > 0) {
        cartData.value[0].stores = stores;
        stores[0].isExpanded = true;
        await fetchProductList(stores[0]);
      }
    }

    // 更新分页信息
    pagination.total = total.value || 0;
  } catch (error) {
    console.error('获取订单列表失败：', error);
    message.error('获取订单列表失败');
  }
};

// 根据订单查询店铺列表
const fetchStoreList = async (order) => {
  const storeData = order.record;
  const userInfo = sessionStorage.getItem('userInfo');
  const userInfoData = JSON.parse(userInfo || '{}');
  const reqParams = {
    pageID: 'mySaleOrderRestockCartPage',
    pageDataGrpID: 'mySaleOrderRestockCartInfo',
    actNo: storeData.actNo,
    saleCmpName: storeData.saleCmpName,
    wareName: storeData.wareName,
    purchaseCompanyName: userInfoData.TELLERCOMPANY || '',
    billNo: storeData.billNo,
  };
  const { data } = await useMainGetData(reqParams);
  console.warn('fetchStoreList:data', data.value);
  const store = data.value.map((item) => ({
    name: item.saleCmpName || item.wareName,
    selected: false,
    isExpanded: false,
    totalPrice: item.totalPrice,
    totalQuantity: item.prdNum,
    record: item,
    products: [],
  }));
  return store;
};

// 根据店铺查询商品列表
const fetchProductList = async (store) => {
  try {
    const storeData = store.record;
    const userInfo = sessionStorage.getItem('userInfo');
    const userInfoData = JSON.parse(userInfo || '{}');
    const reqParams = {
      pageID: 'mySaleOrderRestockCartPage',
      pageDataGrpID: 'mySaleOrderRestockCartGoodsInfo',
      actNo: storeData.actNo,
      saleCmpName: storeData.saleCmpName,
      wareName: storeData.wareName,
      purchaseCompanyName: userInfoData.TELLERCOMPANY || '',
      tellerNo: storeData.tellerNo,
    };
    const { data } = await useMainGetData(reqParams);

    store.products = (data.value || []).map((item, index) => ({
      id: index + 1,
      selected: false,
      name: `${item.companyName || ''}-${item.providePrd || ''}-${item.provideSrlID || ''}`,
      specs: [`${item.wareAttrValueList || ''}`],
      price: Number.parseFloat(item.priceAfterDiscount) || 0,
      quantity: Number.parseInt(item.prdNum) || 0,
    }));
  } catch (error) {
    console.error('获取商品列表失败：', error);
    store.products = [];
    message.error('获取商品列表失败');
  }
};

// 页面加载时获取订单列表
onMounted(() => {
  fetchOrderList();
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
        <div class="col-span-6">商品信息</div>
        <div class="col-span-2">单价</div>
        <div class="col-span-2">数量</div>
        <div class="col-span-2">操作</div>
      </div>

      <!-- 购物车内容 -->
      <div class="divide-y pb-20">
        <!-- 订单区块 -->
        <div
          v-for="(order, orderIndex) in cartData"
          :key="orderIndex"
          class="pb-4"
        >
          <!-- 订单标题 -->
          <div
            class="flex items-center justify-between border-b bg-white px-4 py-3"
          >
            <div class="flex items-center">
              <input
                type="checkbox"
                :checked="order.selected"
                @change="toggleOrderSelection(orderIndex)"
                class="mr-2 h-4 w-4 accent-blue-500"
              />
              <div class="text-sm">
                <span class="font-medium"
                  >销售订单号：{{ order.orderNumber }}</span
                >
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <Button
                size="small"
                type="dashed"
                class="rounded border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
                @click="generateOrder(orderIndex, order)"
              >
                生成进货订单
              </Button>
              <Button
                type="text"
                class="transform rounded border p-1 text-gray-500 transition-transform duration-200 focus:outline-none"
                :class="{ 'rotate-180': order.isExpanded }"
                @click="toggleOrder(orderIndex)"
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

          <!-- 订单内容（可展开/收起） -->
          <transition
            enter-active-class="transition-all duration-300 ease-in-out"
            leave-active-class="transition-all duration-300 ease-in-out"
            enter-from-class="max-h-0 opacity-0"
            enter-to-class="max-h-[2000px] opacity-100"
            leave-from-class="max-h-[2000px] opacity-100"
            leave-to-class="max-h-0 opacity-0"
          >
            <div v-show="order.isExpanded" class="overflow-hidden">
              <!-- 店铺信息 -->
              <div
                v-for="(store, storeIndex) in order.stores"
                :key="storeIndex"
                class="border-b"
              >
                <div class="flex items-center bg-white px-4 py-2">
                  <input
                    type="checkbox"
                    :checked="store.selected"
                    @change="toggleStoreSelection(orderIndex, storeIndex)"
                    class="mr-2 h-4 w-4 accent-blue-500"
                  />
                  <div class="text-sm text-gray-600">
                    <span>{{ store.name }}</span>
                    <span class="ml-8"
                      >店铺进货总价：¥ {{ store.totalPrice.toFixed(2) }}</span
                    >
                    <span class="ml-8"
                      >店铺进货数量：{{ store.totalQuantity }}</span
                    >
                  </div>
                  <div class="ml-auto flex items-center space-x-2">
                    <Button
                      size="small"
                      class="rounded border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
                      @click="generateStoreOrder(orderIndex, storeIndex, store)"
                    >
                      生成进货订单
                    </Button>
                    <Button
                      type="text"
                      class="transform rounded border p-1 text-gray-500 transition-transform duration-200 focus:outline-none"
                      :class="{ 'rotate-180': store.isExpanded }"
                      @click="toggleStore(orderIndex, storeIndex, store)"
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
                          <div class="col-span-6 flex">
                            <input
                              type="checkbox"
                              :checked="product.selected"
                              @change="
                                toggleProductSelection(
                                  orderIndex,
                                  storeIndex,
                                  productIndex,
                                )
                              "
                              class="mr-2 h-4 w-4 self-center accent-blue-500"
                            />
                            <div class="flex">
                              <div
                                class="ml-4 flex flex-col justify-between py-1"
                              >
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
                                    orderIndex,
                                    storeIndex,
                                    productIndex,
                                  )
                              "
                              class="w-70"
                            />
                          </div>
                          <!-- 操作 -->
                          <div class="col-span-2 text-center">
                            <button
                              @click="
                                removeProduct(
                                  orderIndex,
                                  storeIndex,
                                  productIndex,
                                )
                              "
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
          </transition>
        </div>
      </div>

      <!-- 底部操作栏 - 固定在父盒子底部 -->
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
          <button
            @click="batchGenerateOrders"
            class="rounded bg-red-500 px-6 py-2 text-white transition-colors hover:bg-red-600"
            :disabled="selectedOrdersCount === 0"
            :class="{
              'cursor-not-allowed opacity-50': selectedOrdersCount === 0,
            }"
          >
            批量生成进货订单 ({{ selectedOrdersCount }}笔)
          </button>
        </div>
      </div>
    </div>
  </Page>
</template>

<style scoped>
/* 可以添加额外的自定义样式 */
</style>
