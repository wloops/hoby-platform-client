<script setup>
import { computed, reactive, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { message, Pagination } from 'ant-design-vue';
// 购物车数据结构重构，增加展开/收起状态
const cartData = ref([
  {
    name: '美的货比旗舰店',
    selected: true,
    isExpanded: true,
    orders: [
      {
        selected: true,
        isExpanded: true,
        orderNumber: '14752408131123201140',
        totalPrice: 2800,
        totalQuantity: 3,
        products: [
          {
            id: 1,
            selected: true,
            name: '厂商+产品+型号',
            specs: ['规格：规格值', '规格：规格值', '规格：规格值'],
            price: 800,
            quantity: 2,
          },
          {
            id: 2,
            selected: true,
            name: '厂商+产品+型号',
            specs: ['规格：规格值', '规格：规格值', '规格：规格值'],
            price: 1200,
            quantity: 1,
          },
        ],
      },
    ],
  },
  {
    name: '格力货比旗舰店',
    selected: false,
    isExpanded: false,
    orders: [
      {
        selected: false,
        isExpanded: false,
        orderNumber: '14752408131123201140',
        totalPrice: 3200,
        totalQuantity: 2,
        products: [
          {
            id: 3,
            selected: false,
            name: '厂商+产品+型号',
            specs: ['规格：规格值', '规格：规格值', '规格：规格值'],
            price: 1600,
            quantity: 2,
          },
        ],
      },
    ],
  },
]);

// 计算属性：是否全选
const isAllSelected = computed(() => {
  if (cartData.value.length === 0) return false;
  return cartData.value.every((store) => store.selected);
});

// 计算属性：选中的商品数量
const selectedProductsCount = computed(() => {
  let count = 0;
  cartData.value.forEach((store) => {
    store.orders.forEach((order) => {
      order.products.forEach((product) => {
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
  cartData.value.forEach((store) => {
    store.orders.forEach((order) => {
      // 检查订单是否有选中的商品
      const hasSelectedProducts = order.products.some(
        (product) => product.selected,
      );
      if (hasSelectedProducts) {
        count++;
      }
    });
  });
  return count;
});

// 计算属性：总价
const totalPrice = computed(() => {
  let total = 0;
  cartData.value.forEach((store) => {
    store.orders.forEach((order) => {
      order.products.forEach((product) => {
        if (product.selected) {
          total += product.price * product.quantity;
        }
      });
    });
  });
  return total;
});

// 展开/收起店铺
const toggleStore = (storeIndex) => {
  cartData.value[storeIndex].isExpanded =
    !cartData.value[storeIndex].isExpanded;
};

// 展开/收起订单
const toggleOrder = (storeIndex, orderIndex) => {
  cartData.value[storeIndex].orders[orderIndex].isExpanded =
    !cartData.value[storeIndex].orders[orderIndex].isExpanded;
};

// 切换全选状态
const toggleAllSelection = () => {
  const newState = !isAllSelected.value;
  cartData.value.forEach((store) => {
    store.selected = newState;
    store.orders.forEach((order) => {
      order.selected = newState;
      order.products.forEach((product) => {
        product.selected = newState;
      });
    });
  });
};

// 切换店铺选择状态
const toggleStoreSelection = (storeIndex) => {
  const store = cartData.value[storeIndex];
  store.selected = !store.selected;

  // 同步更新订单和所有商品的选择状态
  store.orders.forEach((order) => {
    order.selected = store.selected;
    order.products.forEach((product) => {
      product.selected = store.selected;
    });
  });
};

// 切换订单选择状态
const toggleOrderSelection = (storeIndex, orderIndex) => {
  const order = cartData.value[storeIndex].orders[orderIndex];
  order.selected = !order.selected;

  // 同步更新所有商品的选择状态
  order.products.forEach((product) => {
    product.selected = order.selected;
  });

  // 检查是否所有订单都被选中，更新店铺选择状态
  updateStoreSelectionState(storeIndex);
};

// 切换商品选择状态
const toggleProductSelection = (storeIndex, orderIndex, productIndex) => {
  const product =
    cartData.value[storeIndex].orders[orderIndex].products[productIndex];
  product.selected = !product.selected;

  // 检查是否所有商品都被选中，更新订单和店铺选择状态
  updateOrderSelectionState(storeIndex, orderIndex);
  updateStoreSelectionState(storeIndex);
};

// 更新订单选择状态
const updateOrderSelectionState = (storeIndex, orderIndex) => {
  const order = cartData.value[storeIndex].orders[orderIndex];
  order.selected = order.products.every((product) => product.selected);
};

// 更新店铺选择状态
const updateStoreSelectionState = (storeIndex) => {
  const store = cartData.value[storeIndex];
  store.selected = store.orders.every((order) => order.selected);
};

// 增加商品数量
const increaseQuantity = (storeIndex, orderIndex, productIndex) => {
  cartData.value[storeIndex].orders[orderIndex].products[productIndex]
    .quantity++;
  updateTotals(storeIndex, orderIndex);
};

// 减少商品数量
const decreaseQuantity = (storeIndex, orderIndex, productIndex) => {
  const product =
    cartData.value[storeIndex].orders[orderIndex].products[productIndex];
  if (product.quantity > 1) {
    product.quantity--;
    updateTotals(storeIndex, orderIndex);
  }
};

// 移除商品
const removeProduct = (storeIndex, orderIndex, productIndex) => {
  const order = cartData.value[storeIndex].orders[orderIndex];
  order.products.splice(productIndex, 1);

  // 如果订单没有商品了，移除订单
  if (order.products.length === 0) {
    cartData.value[storeIndex].orders.splice(orderIndex, 1);

    // 如果店铺没有订单了，移除店铺
    if (cartData.value[storeIndex].orders.length === 0) {
      cartData.value.splice(storeIndex, 1);
    }
  } else {
    updateTotals(storeIndex, orderIndex);
  }
};

// 更新订单总价和总数量
const updateTotals = (storeIndex, orderIndex) => {
  const order = cartData.value[storeIndex].orders[orderIndex];
  order.totalQuantity = order.products.reduce(
    (sum, product) => sum + product.quantity,
    0,
  );
  order.totalPrice = order.products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0,
  );
};

// 删除选中的商品
const removeSelected = () => {
  // 从后往前遍历，避免删除时索引变化
  for (let i = cartData.value.length - 1; i >= 0; i--) {
    const store = cartData.value[i];

    for (let j = store.orders.length - 1; j >= 0; j--) {
      const order = store.orders[j];

      for (let k = order.products.length - 1; k >= 0; k--) {
        if (order.products[k].selected) {
          order.products.splice(k, 1);
        }
      }

      // 如果订单没有商品了，移除订单
      if (order.products.length === 0) {
        store.orders.splice(j, 1);
      } else {
        updateTotals(i, j);
      }
    }

    // 如果店铺没有订单了，移除店铺
    if (store.orders.length === 0) {
      cartData.value.splice(i, 1);
    }
  }
};

// 生成单个订单
const generateOrder = (storeIndex, orderIndex) => {
  const store = cartData.value[storeIndex];
  const order = store.orders[orderIndex];

  // 这里可以添加生成订单的逻辑
  message.success(
    `已为 ${store.name} 的订单 ${order.orderNumber} 生成进货订单`,
  );
};

// 批量生成订单
const batchGenerateOrders = () => {
  if (selectedOrdersCount.value === 0) return;

  const generatedOrders = [];

  cartData.value.forEach((store) => {
    store.orders.forEach((order) => {
      // 检查订单是否有选中的商品
      const hasSelectedProducts = order.products.some(
        (product) => product.selected,
      );

      if (hasSelectedProducts) {
        generatedOrders.push({
          storeName: store.name,
          orderNumber: order.orderNumber,
        });
      }
    });
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
  fetchData();
};

// 获取数据的方法
const fetchData = async () => {
  try {
    // 这里调用接口获取数据
    const { data, total } = await fetchOrderList({
      page: pagination.current,
      pageSize: pagination.pageSize,
    });
    // 更新数据和总数
    orderList.value = data;
    pagination.total = total;
  } catch (error) {
    console.error('获取数据失败：', error);
  }
};
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
        <!-- 店铺区块 -->
        <div
          v-for="(store, storeIndex) in cartData"
          :key="storeIndex"
          class="pb-4"
        >
          <!-- 店铺标题 -->
          <div
            class="flex items-center justify-between border-b bg-white px-4 py-3"
          >
            <div class="flex items-center">
              <input
                type="checkbox"
                :checked="store.selected"
                @change="toggleStoreSelection(storeIndex)"
                class="mr-2 h-4 w-4 accent-blue-500"
              />
              <span class="font-medium">{{ store.name }}</span>
            </div>
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

          <!-- 店铺内容（可展开/收起） -->
          <transition
            enter-active-class="transition-all duration-300 ease-in-out"
            leave-active-class="transition-all duration-300 ease-in-out"
            enter-from-class="max-h-0 opacity-0"
            enter-to-class="max-h-[2000px] opacity-100"
            leave-from-class="max-h-[2000px] opacity-100"
            leave-to-class="max-h-0 opacity-0"
          >
            <div v-show="store.isExpanded" class="overflow-hidden">
              <!-- 订单信息 -->
              <div
                v-for="(order, orderIndex) in store.orders"
                :key="orderIndex"
              >
                <div class="flex items-center border-b bg-white px-4 py-2">
                  <input
                    type="checkbox"
                    :checked="order.selected"
                    @change="toggleOrderSelection(storeIndex, orderIndex)"
                    class="mr-2 h-4 w-4 accent-blue-500"
                  />
                  <div class="text-sm text-gray-600">
                    <span>销售订单号：{{ order.orderNumber }}</span>
                    <span class="ml-8"
                      >店铺进货总价：¥ {{ order.totalPrice.toFixed(2) }}</span
                    >
                    <span class="ml-8"
                      >店铺进货数量：{{ order.totalQuantity }}</span
                    >
                  </div>
                  <div class="ml-auto flex items-center space-x-2">
                    <button
                      class="rounded border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
                      @click="generateOrder(storeIndex, orderIndex)"
                    >
                      生成进货订单
                    </button>
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

                <!-- 订单商品列表（可展开/收起） -->
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
                      v-for="(product, productIndex) in order.products"
                      :key="productIndex"
                      class="border-b"
                    >
                      <div class="grid grid-cols-12 items-center px-4 py-4">
                        <!-- 商品信息 -->
                        <div class="col-span-6 flex">
                          <input
                            type="checkbox"
                            :checked="product.selected"
                            @change="
                              toggleProductSelection(
                                storeIndex,
                                orderIndex,
                                productIndex,
                              )
                            "
                            class="mr-2 h-4 w-4 self-center accent-blue-500"
                          />
                          <div class="flex">
                            <div class="h-24 w-24 flex-shrink-0 border">
                              <div
                                class="flex h-full w-full items-center justify-center bg-gray-50 text-gray-400"
                              >
                                商品图片
                              </div>
                            </div>
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
                          <div class="flex rounded border">
                            <button
                              @click="
                                decreaseQuantity(
                                  storeIndex,
                                  orderIndex,
                                  productIndex,
                                )
                              "
                              class="border-r px-2 py-1 hover:bg-gray-100"
                              :disabled="product.quantity <= 1"
                              :class="{
                                'cursor-not-allowed opacity-50':
                                  product.quantity <= 1,
                              }"
                            >
                              -
                            </button>
                            <input
                              type="text"
                              v-model="product.quantity"
                              class="w-10 text-center focus:outline-none"
                            />
                            <button
                              @click="
                                increaseQuantity(
                                  storeIndex,
                                  orderIndex,
                                  productIndex,
                                )
                              "
                              class="border-l px-2 py-1 hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <!-- 操作 -->
                        <div class="col-span-2 text-center">
                          <button
                            @click="
                              removeProduct(
                                storeIndex,
                                orderIndex,
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
