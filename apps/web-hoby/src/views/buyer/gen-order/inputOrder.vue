<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue';

interface Platform {
  id: string;
  name: string;
}

interface Product {
  name: string;
  sku: string;
  quantity: number;
  price: number;
}

interface Customer {
  name: string;
  phone: string;
  email: string;
  address: string;
}

interface Payment {
  method: string;
  status: string;
  transactionId: string;
  paymentTime: string;
}

interface Amount {
  subtotal: string;
  shippingFee: number;
  tax: number;
  discount: number;
  total: string;
}

interface OrderForm {
  platform: string;
  orderNumber: string;
  orderTime: string;
  status: string;
  customer: Customer;
  products: Product[];
  payment: Payment;
  amount: Amount;
  notes: string;
}

interface RecentOrder {
  orderNumber: string;
  customer: string;
  platform: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface ProductCatalog {
  name: string;
  sku: string;
  price: number;
}

export default defineComponent({
  name: 'ManualOrderEntryPage',
  setup() {
    const platforms = ref<Platform[]>([
      { id: 'taobao', name: '淘宝' },
      { id: 'jd', name: '京东' },
      { id: 'pdd', name: '拼多多' },
      { id: 'wechat', name: '微信小程序' },
      { id: 'douyin', name: '抖音' },
      { id: 'other', name: '其他平台' },
    ]);

    const orderForm = reactive<OrderForm>({
      platform: '',
      orderNumber: '',
      orderTime: new Date().toISOString().slice(0, 16),
      status: '',
      customer: {
        name: '',
        phone: '',
        email: '',
        address: '',
      },
      products: [],
      payment: {
        method: '',
        status: '',
        transactionId: '',
        paymentTime: '',
      },
      amount: {
        subtotal: '0.00',
        shippingFee: 0,
        tax: 0,
        discount: 0,
        total: '0.00',
      },
      notes: '',
    });

    const recentOrders = ref<RecentOrder[]>([
      {
        orderNumber: 'TB123456789',
        customer: '张三',
        platform: '淘宝',
        amount: 3999,
        status: 'paid',
        createdAt: '2023-03-15 14:30:25',
      },
      {
        orderNumber: 'JD987654321',
        customer: '李四',
        platform: '京东',
        amount: 299,
        status: 'processing',
        createdAt: '2023-03-15 15:20:10',
      },
      {
        orderNumber: 'PDD123123123',
        customer: '王五',
        platform: '拼多多',
        amount: 1299,
        status: 'shipped',
        createdAt: '2023-03-15 16:45:30',
      },
    ]);

    const productCatalog = ref<ProductCatalog[]>([
      { name: '智能手机', sku: 'SP001', price: 3999 },
      { name: '蓝牙耳机', sku: 'BT001', price: 299 },
      { name: '智能手表', sku: 'SW001', price: 1299 },
      { name: '平板电脑', sku: 'TB001', price: 2499 },
      { name: '笔记本电脑', sku: 'LT001', price: 5999 },
      { name: '智能音箱', sku: 'SS001', price: 499 },
      { name: '无线充电器', sku: 'WC001', price: 129 },
      { name: '移动电源', sku: 'PB001', price: 199 },
    ]);

    const showProductSelector = ref(false);
    const currentProductIndex = ref(0);
    const productSearchQuery = ref('');

    const filteredProducts = computed(() => {
      if (!productSearchQuery.value) {
        return productCatalog.value;
      }

      const query = productSearchQuery.value.toLowerCase();
      return productCatalog.value.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query),
      );
    });

    const addProduct = () => {
      orderForm.products.push({
        name: '',
        sku: '',
        quantity: 1,
        price: 0,
      });
      calculateTotals();
    };

    const removeProduct = (index: number) => {
      orderForm.products.splice(index, 1);
      calculateTotals();
    };

    const openProductSelector = (index: number) => {
      currentProductIndex.value = index;
      showProductSelector.value = true;
    };

    const selectProduct = (product: ProductCatalog) => {
      const index = currentProductIndex.value;
      if (orderForm.products[index]) {
        orderForm.products[index].name = product.name;
        orderForm.products[index].sku = product.sku;
        orderForm.products[index].price = product.price;
      }
      showProductSelector.value = false;
      calculateTotals();
    };

    const calculateTotals = () => {
      // 计算商品小计
      const subtotal = orderForm.products.reduce((sum, product) => {
        return sum + product.price * product.quantity;
      }, 0);

      orderForm.amount.subtotal = subtotal.toFixed(2);

      // 计算订单总额
      const total =
        subtotal +
        orderForm.amount.shippingFee +
        orderForm.amount.tax -
        orderForm.amount.discount;
      orderForm.amount.total = total.toFixed(2);
    };

    const resetForm = () => {
      orderForm.platform = '';
      orderForm.orderNumber = '';
      orderForm.orderTime = new Date().toISOString().slice(0, 16);
      orderForm.status = '';
      orderForm.customer.name = '';
      orderForm.customer.phone = '';
      orderForm.customer.email = '';
      orderForm.customer.address = '';
      orderForm.products = [];
      orderForm.payment.method = '';
      orderForm.payment.status = '';
      orderForm.payment.transactionId = '';
      orderForm.payment.paymentTime = '';
      orderForm.amount.subtotal = '0.00';
      orderForm.amount.shippingFee = 0;
      orderForm.amount.tax = 0;
      orderForm.amount.discount = 0;
      orderForm.amount.total = '0.00';
      orderForm.notes = '';
    };

    const submitOrder = () => {
      // 这里可以添加表单验证逻辑

      // 模拟提交订单
      // alert('订单已保存！');

      // 重置表单
      resetForm();
    };

    const getStatusClass = (status: string) => {
      switch (status) {
        case 'cancelled': {
          return 'bg-red-100 text-red-800';
        }
        case 'completed': {
          return 'bg-green-100 text-green-800';
        }
        case 'paid': {
          return 'bg-green-100 text-green-800';
        }
        case 'pending_payment': {
          return 'bg-yellow-100 text-yellow-800';
        }
        case 'processing': {
          return 'bg-blue-100 text-blue-800';
        }
        case 'refunded': {
          return 'bg-gray-100 text-gray-800';
        }
        case 'shipped': {
          return 'bg-purple-100 text-purple-800';
        }
        default: {
          return 'bg-gray-100 text-gray-800';
        }
      }
    };

    const getStatusText = (status: string) => {
      switch (status) {
        case 'cancelled': {
          return '已取消';
        }
        case 'completed': {
          return '已完成';
        }
        case 'paid': {
          return '已付款';
        }
        case 'pending_payment': {
          return '待付款';
        }
        case 'processing': {
          return '处理中';
        }
        case 'refunded': {
          return '已退款';
        }
        case 'shipped': {
          return '已发货';
        }
        default: {
          return '未知状态';
        }
      }
    };

    return {
      platforms,
      orderForm,
      recentOrders,
      showProductSelector,
      currentProductIndex,
      productSearchQuery,
      filteredProducts,
      addProduct,
      removeProduct,
      openProductSelector,
      selectProduct,
      calculateTotals,
      resetForm,
      submitOrder,
      getStatusClass,
      getStatusText,
    };
  },
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 justify-between">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900">后台管理系统</h1>
          </div>
          <div class="flex items-center">
            <div class="relative ml-3">
              <div class="flex items-center">
                <span class="mr-2 text-sm text-gray-700">管理员</span>
                <div
                  class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-lg font-medium text-gray-900">录入第三方订单</h2>
          <nav class="flex" aria-label="Breadcrumb">
            <ol class="flex items-center space-x-2">
              <li>
                <div class="flex items-center">
                  <a
                    href="#"
                    class="text-sm font-medium text-gray-500 hover:text-gray-700"
                    >首页</a
                  >
                </div>
              </li>
              <li>
                <div class="flex items-center">
                  <svg
                    class="h-5 w-5 flex-shrink-0 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <a
                    href="#"
                    class="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                    >订单管理</a
                  >
                </div>
              </li>
              <li>
                <div class="flex items-center">
                  <svg
                    class="h-5 w-5 flex-shrink-0 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span
                    class="ml-2 text-sm font-medium text-gray-900"
                    aria-current="page"
                    >录入第三方订单</span
                  >
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <div class="rounded-lg bg-white shadow">
          <div class="border-b border-gray-200 px-4 py-5 sm:px-6">
            <h3 class="text-lg font-medium leading-6 text-gray-900">
              订单信息
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              请填写第三方平台订单的详细信息
            </p>
          </div>

          <form @submit.prevent="submitOrder">
            <div class="px-4 py-5 sm:p-6">
              <div class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
                <!-- 基本信息 -->
                <div class="sm:col-span-6">
                  <h4 class="mb-3 text-sm font-medium text-gray-900">
                    基本信息
                  </h4>
                  <div class="rounded-md bg-gray-50 p-4">
                    <div
                      class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6"
                    >
                      <div class="sm:col-span-3">
                        <label
                          for="platform"
                          class="block text-sm font-medium text-gray-700"
                          >来源平台 <span class="text-red-500">*</span></label
                        >
                        <select
                          id="platform"
                          v-model="orderForm.platform"
                          class="focus:ring-primary-500 focus:border-primary-500 mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none sm:text-sm"
                          required
                        >
                          <option value="">请选择平台</option>
                          <option
                            v-for="platform in platforms"
                            :key="platform.id"
                            :value="platform.id"
                          >
                            {{ platform.name }}
                          </option>
                        </select>
                      </div>

                      <div class="sm:col-span-3">
                        <label
                          for="order-number"
                          class="block text-sm font-medium text-gray-700"
                          >第三方订单号
                          <span class="text-red-500">*</span></label
                        >
                        <div class="mt-1">
                          <input
                            type="text"
                            id="order-number"
                            v-model="orderForm.orderNumber"
                            class="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                            placeholder="请输入第三方平台的订单号"
                            required
                          />
                        </div>
                      </div>

                      <div class="sm:col-span-3">
                        <label
                          for="order-time"
                          class="block text-sm font-medium text-gray-700"
                          >下单时间 <span class="text-red-500">*</span></label
                        >
                        <div class="mt-1">
                          <input
                            type="datetime-local"
                            id="order-time"
                            v-model="orderForm.orderTime"
                            class="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                            required
                          />
                        </div>
                      </div>

                      <div class="sm:col-span-3">
                        <label
                          for="order-status"
                          class="block text-sm font-medium text-gray-700"
                          >订单状态 <span class="text-red-500">*</span></label
                        >
                        <select
                          id="order-status"
                          v-model="orderForm.status"
                          class="focus:ring-primary-500 focus:border-primary-500 mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none sm:text-sm"
                          required
                        >
                          <option value="">请选择状态</option>
                          <option value="pending_payment">待付款</option>
                          <option value="paid">已付款</option>
                          <option value="processing">处理中</option>
                          <option value="shipped">已发货</option>
                          <option value="completed">已完成</option>
                          <option value="cancelled">已取消</option>
                          <option value="refunded">已退款</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 客户信息 -->
                <div class="sm:col-span-6">
                  <h4 class="mb-3 text-sm font-medium text-gray-900">
                    客户信息
                  </h4>
                  <div class="rounded-md bg-gray-50 p-4">
                    <div
                      class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6"
                    >
                      <div class="sm:col-span-3">
                        <label
                          for="customer-name"
                          class="block text-sm font-medium text-gray-700"
                          >客户姓名 <span class="text-red-500">*</span></label
                        >
                        <div class="mt-1">
                          <input
                            type="text"
                            id="customer-name"
                            v-model="orderForm.customer.name"
                            class="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                            required
                          />
                        </div>
                      </div>

                      <div class="sm:col-span-3">
                        <label
                          for="customer-phone"
                          class="block text-sm font-medium text-gray-700"
                          >联系电话 <span class="text-red-500">*</span></label
                        >
                        <div class="mt-1">
                          <input
                            type="tel"
                            id="customer-phone"
                            v-model="orderForm.customer.phone"
                            class="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                            required
                          />
                        </div>
                      </div>

                      <div class="sm:col-span-3">
                        <label
                          for="customer-email"
                          class="block text-sm font-medium text-gray-700"
                          >电子邮箱</label
                        >
                        <div class="mt-1">
                          <input
                            type="email"
                            id="customer-email"
                            v-model="orderForm.customer.email"
                            class="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                          />
                        </div>
                      </div>

                      <div class="sm:col-span-6">
                        <label
                          for="customer-address"
                          class="block text-sm font-medium text-gray-700"
                          >收货地址 <span class="text-red-500">*</span></label
                        >
                        <div class="mt-1">
                          <textarea
                            id="customer-address"
                            v-model="orderForm.customer.address"
                            rows="3"
                            class="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                            required
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 商品信息 -->
                <div class="sm:col-span-6">
                  <div class="mb-3 flex items-center justify-between">
                    <h4 class="text-sm font-medium text-gray-900">商品信息</h4>
                    <button
                      type="button"
                      class="text-primary-700 bg-primary-100 hover:bg-primary-200 focus:ring-primary-500 inline-flex items-center rounded-md border border-transparent px-3 py-1 text-sm font-medium leading-4 focus:outline-none focus:ring-2 focus:ring-offset-2"
                      @click="addProduct"
                    >
                      添加商品
                    </button>
                  </div>

                  <div class="rounded-md bg-gray-50 p-4">
                    <div
                      v-if="orderForm.products.length === 0"
                      class="py-6 text-center text-gray-500"
                    >
                      请添加商品
                    </div>

                    <div
                      v-for="(product, index) in orderForm.products"
                      :key="index"
                      class="mb-4 rounded-md border border-gray-200 p-4"
                    >
                      <div class="mb-4 flex items-start justify-between">
                        <h5 class="text-sm font-medium text-gray-900">
                          商品 #{{ index + 1 }}
                        </h5>
                        <button
                          type="button"
                          class="text-red-600 hover:text-red-900"
                          @click="removeProduct(index)"
                        >
                          删除
                        </button>
                      </div>

                      <div
                        class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6"
                      >
                        <div class="sm:col-span-6">
                          <label
                            :for="`product-name-${index}`"
                            class="block text-sm font-medium text-gray-700"
                            >商品名称 <span class="text-red-500">*</span></label
                          >
                          <div class="mt-1 flex rounded-md shadow-sm">
                            <div
                              class="relative flex flex-grow items-stretch focus-within:z-10"
                            >
                              <input
                                :id="`product-name-${index}`"
                                v-model="product.name"
                                type="text"
                                class="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-none rounded-l-md border-gray-300 sm:text-sm"
                                required
                              />
                            </div>
                            <button
                              type="button"
                              class="focus:ring-primary-500 focus:border-primary-500 relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1"
                              @click="openProductSelector(index)"
                            >
                              <span>选择商品</span>
                            </button>
                          </div>
                        </div>

                        <div class="sm:col-span-2">
                          <label
                            :for="`product-sku-${index}`"
                            class="block text-sm font-medium text-gray-700"
                            >SKU</label
                          >
                          <div class="mt-1">
                            <input
                              :id="`product-sku-${index}`"
                              v-model="product.sku"
                              type="text"
                              class="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                            />
                          </div>
                        </div>

                        <div class="sm:col-span-1">
                          <label
                            :for="`product-quantity-${index}`"
                            class="block text-sm font-medium text-gray-700"
                            >数量 <span class="text-red-500">*</span></label
                          >
                          <div class="mt-1">
                            <input
                              :id="`product-quantity-${index}`"
                              v-model.number="product.quantity"
                              type="number"
                              min="1"
                              class="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                              required
                            />
                          </div>
                        </div>

                        <div class="sm:col-span-1">
                          <label
                            :for="`product-price-${index}`"
                            class="block text-sm font-medium text-gray-700"
                            >单价 <span class="text-red-500">*</span></label
                          >
                          <div class="relative mt-1 rounded-md shadow-sm">
                            <div
                              class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                            >
                              <span class="text-gray-500 sm:text-sm">¥</span>
                            </div>
                            <input
                              :id="`product-price-${index}`"
                              v-model.number="product.price"
                              type="number"
                              min="0"
                              step="0.01"
                              class="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-md border-gray-300 pl-7 sm:text-sm"
                              required
                              @input="calculateTotals"
                            />
                          </div>
                        </div>

                        <div class="sm:col-span-2">
                          <label
                            :for="`product-subtotal-${index}`"
                            class="block text-sm font-medium text-gray-700"
                            >小计</label
                          >
                          <div class="relative mt-1 rounded-md shadow-sm">
                            <div
                              class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                            >
                              <span class="text-gray-500 sm:text-sm">¥</span>
                            </div>
                            <input
                              :id="`product-subtotal-${index}`"
                              :value="
                                (product.price * product.quantity).toFixed(2)
                              "
                              type="text"
                              class="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-md border-gray-300 bg-gray-50 pl-7 sm:text-sm"
                              readonly
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 支付信息 -->
                <div class="sm:col-span-6">
                  <h4 class="mb-3 text-sm font-medium text-gray-900">
                    支付信息
                  </h4>
                  <div class="rounded-md bg-gray-50 p-4">
                    <div
                      class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6"
                    >
                      <div class="sm:col-span-3">
                        <label
                          for="payment-method"
                          class="block text-sm font-medium text-gray-700"
                          >支付方式 <span class="text-red-500">*</span></label
                        >
                        <select
                          id="payment-method"
                          v-model="orderForm.payment.method"
                          class="focus:ring-primary-500 focus:border-primary-500 mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none sm:text-sm"
                          required
                        >
                          <option value="">请选择支付方式</option>
                          <option value="alipay">支付宝</option>
                          <option value="wechat">微信支付</option>
                          <option value="bank_transfer">银行转账</option>
                          <option value="cod">货到付款</option>
                          <option value="other">其他</option>
                        </select>
                      </div>

                      <div class="sm:col-span-3">
                        <label
                          for="payment-status"
                          class="block text-sm font-medium text-gray-700"
                          >支付状态 <span class="text-red-500">*</span></label
                        >
                        <select
                          id="payment-status"
                          v-model="orderForm.payment.status"
                          class="focus:ring-primary-500 focus:border-primary-500 mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none sm:text-sm"
                          required
                        >
                          <option value="">请选择支付状态</option>
                          <option value="unpaid">未支付</option>
                          <option value="paid">已支付</option>
                          <option value="partially_paid">部分支付</option>
                          <option value="refunded">已退款</option>
                          <option value="partially_refunded">部分退款</option>
                        </select>
                      </div>

                      <div class="sm:col-span-3">
                        <label
                          for="payment-transaction-id"
                          class="block text-sm font-medium text-gray-700"
                          >交易号</label
                        >
                        <div class="mt-1">
                          <input
                            type="text"
                            id="payment-transaction-id"
                            v-model="orderForm.payment.transactionId"
                            class="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                            placeholder="第三方支付平台的交易号"
                          />
                        </div>
                      </div>

                      <div class="sm:col-span-3">
                        <label
                          for="payment-time"
                          class="block text-sm font-medium text-gray-700"
                          >支付时间</label
                        >
                        <div class="mt-1">
                          <input
                            type="datetime-local"
                            id="payment-time"
                            v-model="orderForm.payment.paymentTime"
                            class="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 金额信息 -->
                <div class="sm:col-span-6">
                  <h4 class="mb-3 text-sm font-medium text-gray-900">
                    金额信息
                  </h4>
                  <div class="rounded-md bg-gray-50 p-4">
                    <div
                      class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6"
                    >
                      <div class="sm:col-span-2">
                        <label
                          for="subtotal"
                          class="block text-sm font-medium text-gray-700"
                          >商品小计</label
                        >
                        <div class="relative mt-1 rounded-md shadow-sm">
                          <div
                            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                          >
                            <span class="text-gray-500 sm:text-sm">¥</span>
                          </div>
                          <input
                            id="subtotal"
                            v-model="orderForm.amount.subtotal"
                            type="text"
                            class="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-md border-gray-300 bg-gray-50 pl-7 sm:text-sm"
                            readonly
                          />
                        </div>
                      </div>

                      <div class="sm:col-span-2">
                        <label
                          for="shipping-fee"
                          class="block text-sm font-medium text-gray-700"
                          >运费</label
                        >
                        <div class="relative mt-1 rounded-md shadow-sm">
                          <div
                            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                          >
                            <span class="text-gray-500 sm:text-sm">¥</span>
                          </div>
                          <input
                            id="shipping-fee"
                            v-model.number="orderForm.amount.shippingFee"
                            type="number"
                            min="0"
                            step="0.01"
                            class="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-md border-gray-300 pl-7 sm:text-sm"
                            @input="calculateTotals"
                          />
                        </div>
                      </div>

                      <div class="sm:col-span-2">
                        <label
                          for="tax"
                          class="block text-sm font-medium text-gray-700"
                          >税费</label
                        >
                        <div class="relative mt-1 rounded-md shadow-sm">
                          <div
                            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                          >
                            <span class="text-gray-500 sm:text-sm">¥</span>
                          </div>
                          <input
                            id="tax"
                            v-model.number="orderForm.amount.tax"
                            type="number"
                            min="0"
                            step="0.01"
                            class="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-md border-gray-300 pl-7 sm:text-sm"
                            @input="calculateTotals"
                          />
                        </div>
                      </div>

                      <div class="sm:col-span-2">
                        <label
                          for="discount"
                          class="block text-sm font-medium text-gray-700"
                          >折扣</label
                        >
                        <div class="relative mt-1 rounded-md shadow-sm">
                          <div
                            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                          >
                            <span class="text-gray-500 sm:text-sm">¥</span>
                          </div>
                          <input
                            id="discount"
                            v-model.number="orderForm.amount.discount"
                            type="number"
                            min="0"
                            step="0.01"
                            class="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-md border-gray-300 pl-7 sm:text-sm"
                            @input="calculateTotals"
                          />
                        </div>
                      </div>

                      <div class="sm:col-span-2 sm:col-start-5">
                        <label
                          for="total"
                          class="block text-sm font-medium text-gray-700"
                          >订单总额</label
                        >
                        <div class="relative mt-1 rounded-md shadow-sm">
                          <div
                            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                          >
                            <span class="text-gray-500 sm:text-sm">¥</span>
                          </div>
                          <input
                            id="total"
                            v-model="orderForm.amount.total"
                            type="text"
                            class="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-md border-gray-300 bg-gray-50 pl-7 text-lg font-medium sm:text-sm"
                            readonly
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 备注信息 -->
                <div class="sm:col-span-6">
                  <label
                    for="notes"
                    class="block text-sm font-medium text-gray-700"
                    >备注信息</label
                  >
                  <div class="mt-1">
                    <textarea
                      id="notes"
                      v-model="orderForm.notes"
                      rows="3"
                      class="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                      placeholder="订单的其他备注信息"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div class="rounded-b-lg bg-gray-50 px-4 py-3 text-right sm:px-6">
              <button
                type="button"
                class="focus:ring-primary-500 mr-3 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
                @click="resetForm"
              >
                重置
              </button>
              <button
                type="submit"
                class="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                保存订单
              </button>
            </div>
          </form>
        </div>

        <!-- 最近录入的订单 -->
        <div class="mt-8">
          <h3 class="mb-4 text-lg font-medium text-gray-900">最近录入的订单</h3>
          <div class="overflow-x-auto rounded-lg border shadow">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    订单号
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    客户
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    平台
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    金额
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    状态
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    创建时间
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    操作
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr
                  v-for="(order, index) in recentOrders"
                  :key="index"
                  :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
                >
                  <td
                    class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900"
                  >
                    {{ order.orderNumber }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {{ order.customer }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {{ order.platform }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    ¥ {{ order.amount }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    <span
                      class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                      :class="getStatusClass(order.status)"
                    >
                      {{ getStatusText(order.status) }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {{ order.createdAt }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    <button
                      class="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      查看
                    </button>
                    <button class="text-red-600 hover:text-red-900">
                      删除
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>

    <!-- 商品选择弹窗 -->
    <div
      v-if="showProductSelector"
      class="fixed inset-0 z-10 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          @click="showProductSelector = false"
        ></div>

        <span
          class="hidden sm:inline-block sm:h-screen sm:align-middle"
          aria-hidden="true"
          >&#8203;</span
        >

        <div
          class="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
        >
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3
                  class="text-lg font-medium leading-6 text-gray-900"
                  id="modal-title"
                >
                  选择商品
                </h3>
                <div class="mt-4">
                  <div class="mb-4">
                    <input
                      type="text"
                      placeholder="搜索商品..."
                      class="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                      v-model="productSearchQuery"
                    />
                  </div>

                  <div class="max-h-60 overflow-y-auto rounded-md border">
                    <ul class="divide-y divide-gray-200">
                      <li
                        v-for="(product, idx) in filteredProducts"
                        :key="idx"
                        class="cursor-pointer px-4 py-3 hover:bg-gray-50"
                        @click="selectProduct(product)"
                      >
                        <div class="flex items-center">
                          <div class="min-w-0 flex-1">
                            <p
                              class="truncate text-sm font-medium text-gray-900"
                            >
                              {{ product.name }}
                            </p>
                            <p class="truncate text-sm text-gray-500">
                              SKU: {{ product.sku }} | 价格: ¥{{
                                product.price
                              }}
                            </p>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              class="focus:ring-primary-500 mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
              @click="showProductSelector = false"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-primary-50 {
  background-color: rgb(59 130 246 / 5%);
}

.bg-primary-100 {
  background-color: rgb(59 130 246 / 10%);
}

.bg-primary-200 {
  background-color: rgb(59 130 246 / 20%);
}

.bg-primary-600 {
  background-color: rgb(37 99 235);
}

.bg-primary-700 {
  background-color: rgb(29 78 216);
}

.border-primary-500 {
  border-color: rgb(59 130 246);
}

.text-primary-500 {
  color: rgb(59 130 246);
}

.text-primary-600 {
  color: rgb(37 99 235);
}

.text-primary-700 {
  color: rgb(29 78 216);
}

.text-primary-900 {
  color: rgb(30 58 138);
}

.focus-ring-primary-500:focus {
  --tw-ring-color: rgb(59 130 246);
}

.focus-border-primary-500:focus {
  border-color: rgb(59 130 246);
}
</style>
