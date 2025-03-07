<script lang="ts" setup>
import type { TablePaginationConfig } from 'ant-design-vue';
import type { Key } from 'ant-design-vue/es/table/interface';

import { h, ref } from 'vue';

import { Badge, Button, Input, Table, Tabs } from 'ant-design-vue';

interface ProductItem {
  key: string;
  name: string;
  spec: string;
  price: number;
  quantity: number;
  totalPrice: number;
  imageUrl: string;
}

interface OrderItem {
  key: number | string;
  date: string;
  purchaseOrderNo: string;
  salesOrderNo: string;
  purchaseStore: string;
  quantity: number;
  totalPrice: number;
  status: string;
  products?: ProductItem[];
}

// 订单状态类型
const OrderStatus = [
  { key: 'ALL', text: '全部', count: 99 },
  { key: 'PENDING', text: '未完成', count: 20 },
  { key: 'WAIT_PAY', text: '待付款', count: 15 },
  { key: 'WAIT_DELIVER', text: '待配货', count: 25 },
  { key: 'DELIVERING', text: '配送中', count: 18 },
  { key: 'RECEIVED', text: '已签收', count: 10 },
  { key: 'COMPLETED', text: '已完成', count: 2 },
] as const;

// 当前选中的状态
const activeStatus = ref('ALL');

// 搜索条件
const searchForm = ref({
  purchaseStore: '', // 进货店铺
  purchaseOrderNo: '', // 进货订单号
  salesOrderNo: '', // 销售订单号
  status: 'ALL', // 订单状态
});

// 状态统计
// const statusStats = ref({
//   pending: 20,
//   waitPay: 15,
//   waitDeliver: 25,
//   delivering: 18,
//   received: 10,
//   completed: 2,
// });

// 主表列定义
const columns = [
  {
    title: '日期',
    dataIndex: 'date',
    key: 'date',
    align: 'center' as const,
    width: 120,
  },
  {
    title: '进货订单号',
    dataIndex: 'purchaseOrderNo',
    key: 'purchaseOrderNo',
    align: 'center' as const,
    width: 180,
  },
  {
    title: '进货店铺',
    dataIndex: 'purchaseStore',
    key: 'purchaseStore',
    width: 150,
  },
  {
    title: '店铺进货数量',
    dataIndex: 'quantity',
    key: 'quantity',
    align: 'center' as const,
    width: 120,
  },
  {
    title: '店铺进货总价',
    dataIndex: 'totalPrice',
    key: 'totalPrice',
    align: 'right' as const,
    width: 150,
    customRender: ({ text }: { text: number }) => `¥${text.toFixed(2)}`,
  },
  {
    title: '销售订单号',
    dataIndex: 'salesOrderNo',
    key: 'salesOrderNo',
    align: 'center' as const,
    width: 180,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    align: 'center' as const,
    width: 100,
  },
  {
    title: '操作',
    key: 'operation',
    fixed: 'right' as const,
    align: 'center' as const,
    width: 180,
    customRender: ({ record }: { record: OrderItem }) => {
      return h('div', { class: 'flex items-center gap-2' }, [
        h(
          Button,
          {
            type: 'link',
            size: 'small',
            onClick: () => viewOrderDetail(record),
          },
          { default: () => '订单详情' },
        ),
        h(
          Button,
          {
            type: 'link',
            size: 'small',
            onClick: () => requestInvoice(record),
          },
          { default: () => '申请开发票' },
        ),
      ]);
    },
  },
];

// 子表列定义
const expandedColumns = [
  {
    title: '商品信息',
    dataIndex: 'productInfo',
    key: 'productInfo',
    customRender: ({ record }: { record: ProductItem }) => {
      return h('div', { class: 'flex items-center' }, [
        h('img', {
          src: record.imageUrl,
          class: 'mr-3 h-12 w-12 object-cover',
          alt: '商品图片',
        }),
        h('div', [
          h('div', record.name),
          h('div', { class: 'text-sm text-gray-500' }, record.spec),
        ]),
      ]);
    },
  },
  {
    title: '数量',
    dataIndex: 'quantity',
    key: 'quantity',
    align: 'center' as const,
    width: 100,
  },
  {
    title: '单价',
    dataIndex: 'price',
    key: 'price',
    align: 'right' as const,
    width: 120,
    customRender: ({ text }: { text: number }) => `¥${text.toFixed(2)}`,
  },
  {
    title: '总价',
    dataIndex: 'totalPrice',
    key: 'totalPrice',
    align: 'right' as const,
    width: 120,
    customRender: ({ text }: { text: number }) => `¥${text.toFixed(2)}`,
  },
  {
    title: '售后',
    key: 'afterSale',
    align: 'center' as const,
    width: 100,
    customRender: ({ record }: { record: ProductItem }) => {
      return h(
        Button,
        {
          type: 'link',
          onClick: () => handleAfterSale(record),
        },
        { default: () => '申请售后' },
      );
    },
  },
];

// 获取订单列表数据
const orderData = ref<OrderItem[]>([]);
const loading = ref(false);
const pagination = ref({
  total: 100,
  current: 1,
  pageSize: 10,
});

// 切换订单状态
const handleStatusChange = (key: Key) => {
  activeStatus.value = String(key);
  searchForm.value.status = String(key);
  fetchOrderList();
};

// 获取订单列表数据
const fetchOrderList = async () => {
  loading.value = true;
  try {
    // 模拟API调用
    const items = Array.from(
      { length: pagination.value.pageSize },
      (_, index) => ({
        key: index,
        date: '2024-03-06',
        purchaseOrderNo: `PO${index.toString().padStart(8, '0')}`,
        salesOrderNo: `SO${index.toString().padStart(8, '0')}`,
        purchaseStore: ['美的旗舰店', '格力旗舰店', '海尔旗舰店'][index % 3],
        quantity: Math.floor(Math.random() * 10) + 1,
        totalPrice: Number((Math.random() * 10_000).toFixed(2)),
        // 根据当前选中状态筛选数据
        status:
          searchForm.value.status === 'ALL'
            ? OrderStatus[index % 7]?.text || ''
            : OrderStatus.find((s) => s.key === searchForm.value.status)
                ?.text || '',
        products: Array.from(
          { length: Math.floor(Math.random() * 2) + 1 },
          (_, pIndex) => ({
            key: `${index}-${pIndex}`,
            name: ['空调', '冰箱', '洗衣机'][pIndex % 3],
            spec: ['1.5匹', '双开门', '滚筒'][pIndex % 3],
            price: Number((Math.random() * 5000).toFixed(2)),
            quantity: Math.floor(Math.random() * 3) + 1,
            get totalPrice() {
              return Number((this.price * this.quantity).toFixed(2));
            },
            imageUrl:
              'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp',
          }),
        ),
      }),
    );

    // 如果不是全部状态，则过滤数据
    const filteredItems: any =
      searchForm.value.status === 'ALL'
        ? items
        : items.filter(
            (item) =>
              item.status ===
              OrderStatus.find((s) => s.key === searchForm.value.status)?.text,
          );

    orderData.value = filteredItems;
  } finally {
    loading.value = false;
  }
};

// 页面加载时获取数据
fetchOrderList();

// 处理表格变化
const handleTableChange = (pag: TablePaginationConfig) => {
  pagination.value.current = pag.current || 1;
  pagination.value.pageSize = pag.pageSize || 10;
  fetchOrderList();
};

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    purchaseStore: '',
    purchaseOrderNo: '',
    salesOrderNo: '',
    status: 'ALL',
  };
  handleSearch();
};

// 搜索
const handleSearch = () => {
  pagination.value.current = 1;
  fetchOrderList();
};

// 查看订单详情
const viewOrderDetail = (record: OrderItem) => {
  console.warn('查看订单详情', record);
};

// 申请开发票
const requestInvoice = (record: OrderItem) => {
  console.warn('申请开发票', record);
};

// 申请售后
const handleAfterSale = (record: ProductItem) => {
  console.warn('申请售后', record);
};
</script>

<template>
  <div class="order-management">
    <!-- 搜索区域 -->
    <div class="search-area">
      <div class="search-form">
        <div class="form-item">
          <span class="label">进货店铺：</span>
          <Input
            v-model:value="searchForm.purchaseStore"
            placeholder="请输入进货店铺"
            class="input"
          />
        </div>
        <div class="form-item">
          <span class="label">进货订单号：</span>
          <Input
            v-model:value="searchForm.purchaseOrderNo"
            placeholder="请输入进货订单号"
            class="input"
          />
        </div>
        <div class="form-item">
          <span class="label">销售订单号：</span>
          <Input
            v-model:value="searchForm.salesOrderNo"
            placeholder="请输入销售订单号"
            class="input"
          />
        </div>
      </div>
      <div class="search-buttons">
        <Button class="reset-btn" @click="resetSearch">重置</Button>
        <Button type="primary" class="search-btn" @click="handleSearch">
          搜索
        </Button>
      </div>
    </div>

    <!-- 状态导航 -->
    <div class="status-nav">
      <Tabs
        v-model:active-key="activeStatus"
        type="card"
        @change="handleStatusChange"
      >
        <Tabs.TabPane v-for="status in OrderStatus" :key="status.key">
          <template #tab>
            <span class="tab-text">{{ status.text }}</span>
            <Badge
              :count="status.count"
              class="status-badge"
              :class="{ 'status-badge-active': activeStatus === status.key }"
              :number-style="{
                backgroundColor:
                  activeStatus === status.key ? '#1BD0FD' : '#999999',
              }"
            />
          </template>
        </Tabs.TabPane>
      </Tabs>
    </div>

    <!-- 表格区域 -->
    <div class="table-area">
      <Table
        :columns="columns"
        :data-source="orderData"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        bordered
      >
        <template #expandedRowRender="{ record }">
          <Table
            :columns="expandedColumns"
            :data-source="record.products"
            :pagination="false"
            bordered
            class="sub-table"
          />
        </template>
      </Table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.order-management {
  min-height: 100vh;
  padding: 24px;
  background: #f0f2f5;

  .search-area {
    padding: 24px;
    margin-bottom: 24px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 2px rgb(0 0 0 / 3%);

    .search-form {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;

      .form-item {
        display: flex;
        align-items: center;

        .label {
          width: 100px;
          font-size: 14px;
          color: #666;
        }

        .input {
          flex: 1;
        }
      }
    }

    .search-buttons {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 24px;

      .reset-btn {
        &:hover {
          color: #1890ff;
          border-color: #1890ff;
        }
      }

      .search-btn {
        min-width: 80px;
      }
    }
  }

  .status-nav {
    // padding: 8px 12px;
    // margin-bottom: 24px;
    // background: white;
    border-radius: 8px;
    box-shadow: 0 1px 2px rgb(0 0 0 / 3%);

    :deep(.ant-tabs-nav) {
      margin-bottom: 0;
    }

    :deep(.ant-tabs-tab) {
      // padding: 12px 24px;
      margin: 0 8px 0 0;
      border-radius: 4px 4px 0 0;
      transition: all 0.3s;

      &:hover {
        color: #1890ff;
      }

      &.ant-tabs-tab-active {
        background: #1890ff;
        border-color: #1890ff;

        .ant-tabs-tab-btn {
          color: white;
        }
      }
    }

    .tab-text {
      font-size: 14px;
    }

    .status-badge {
      margin-left: 8px;
      color: #666;
      // background: #f5f5f5;
      // border: 1px solid #d9d9d9;
      transition: all 0.3s;

      &-active {
        color: white;
        background: #1890ff;
        border-color: #1890ff;
      }
    }
  }

  .table-area {
    padding: 0;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 2px rgb(0 0 0 / 3%);

    :deep(.ant-table-wrapper) {
      .ant-table {
        border-radius: 8px;
      }

      .ant-table-thead > tr > th {
        font-weight: 600;
        background: #fafafa;
      }

      .ant-table-row {
        &:hover {
          cursor: pointer;

          td {
            background: #e6f7ff !important;
          }
        }
      }
    }

    .sub-table {
      :deep(.ant-table-thead > tr > th) {
        background: #f5f5f5;
      }
    }
  }
}
</style>
