<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-05 13:35:48
 * @Description: 按订单进货页面
-->
<script setup lang="ts">
import type { ColumnsType } from 'ant-design-vue/es/table';

import { computed, h, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { Button, Table, Tag } from 'ant-design-vue';

import GoodsSource from './components/goodsSource.vue';

interface OrderItem {
  id: string;
  productImage: string;
  productName: string;
  manufacturer: string;
  specs: string[];
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: string;
}

const router = useRouter();
const route = useRoute();
const loading = ref(false);
const dataSource = ref<OrderItem[]>([]);
const pagination = ref({
  current: 1,
  pageSize: 20,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
});

const columns: ColumnsType<OrderItem> = [
  {
    title: '商品',
    dataIndex: 'productInfo',
    width: 300,
    customRender: ({ record }) => {
      return h('div', { class: 'flex flex-col gap-1' }, [
        h(
          'div',
          { class: 'font-medium' },
          `${record.manufacturer} · ${record.productName}`,
        ),
        h('div', { class: 'text-sm text-gray-500' }, record.specs.join(' · ')),
      ]);
    },
  },
  {
    title: '需进货数量',
    dataIndex: 'quantity',
    width: 120,
    align: 'center',
  },
  {
    title: '销售数量',
    dataIndex: 'salesQuantity',
    width: 120,
    align: 'center',
  },
  {
    title: '销售单价',
    dataIndex: 'unitPrice',
    width: 180,
    align: 'right',
    customRender: ({ text }) => `¥${text.toFixed(2)}`,
  },
  {
    title: '销售总价',
    dataIndex: 'totalPrice',
    width: 180,
    align: 'right',
    customRender: ({ text }) => `¥${text.toFixed(2)}`,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    align: 'center',
    customRender: ({ text }: { text: string }) => {
      const statusConfig: Record<string, { color: string }> = {
        待进货: { color: 'warning' },
        已进货: { color: 'success' },
        进货中: { color: 'processing' },
      };
      return h(
        Tag,
        { color: statusConfig[text]?.color || 'default' },
        () => text,
      );
    },
  },
  {
    title: '操作',
    width: 80,
    fixed: 'right',
    align: 'center',
    customRender: ({ record }) => {
      return h('div', { class: 'flex justify-center gap-4' }, [
        h(
          Button,
          {
            type: 'link',
            onClick: () => viewSource(record),
          },
          () => '查看货源',
        ),
        // h(
        //   Button,
        //   {
        //     type: 'link',
        //     onClick: () => viewOrderDetail(record),
        //   },
        //   () => '订单详情',
        // ),
      ]);
    },
  },
];

// 表格滚动配置
const scroll = computed(() => ({
  y: window.innerHeight - 280,
}));

// 查看货源
function viewSource(row: OrderItem) {
  console.warn('row', row);
  goodsSourceRef.value?.open();
}

// 查看订单详情
// function viewOrderDetail(row: OrderItem) {
//   router.push(`/buyer/order/${row.id}`);
// }

// 处理表格变化
const handleTableChange = async (pag: any) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
  await fetchOrderList();
};

// 获取订单列表数据
async function fetchOrderList() {
  loading.value = true;
  try {
    // TODO: 替换为实际的API调用
    // const { current, pageSize } = pagination.value;
    const { pageSize } = pagination.value;
    const response = {
      items: Array.from({ length: pageSize }, (_, index) => ({
        id: `${111 + index}`,
        productImage:
          'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp',
        productName: '示例商品',
        manufacturer: '示例厂商',
        specs: ['规格值', '规格值'],
        quantity: 2,
        salesQuantity: 1,
        unitPrice: 1000,
        totalPrice: 2000,
        status: '待进货',
      })),
      total: 100,
    };

    dataSource.value = response.items;
    pagination.value.total = response.total;
  } finally {
    loading.value = false;
  }
}

const goodsSourceRef = ref<InstanceType<typeof GoodsSource>>();

// 初始加载
fetchOrderList();
</script>

<template>
  <Page auto-content-height>
    <div class="flex h-full flex-col overflow-hidden">
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Button
            type="link"
            class="flex items-center gap-1 px-0 text-gray-600"
            @click="router.back()"
          >
            <i class="icon-[lucide--arrow-left] text-lg"></i>
            返回
          </Button>
        </div>
      </div>

      <!-- 订单信息 -->
      <div
        class="mb-4 flex items-center justify-between rounded-lg bg-white p-4 shadow-sm"
      >
        <div class="text-gray-600">销售订单号：{{ route.params.id }}</div>
        <div class="text-gray-600">采购单位：湖南省长沙市第一中学</div>
      </div>

      <div class="flex-1 overflow-hidden rounded-lg bg-white shadow-sm">
        <Table
          :columns="columns"
          :data-source="dataSource"
          :loading="loading"
          :pagination="pagination"
          :scroll="scroll"
          bordered
          size="middle"
          row-key="id"
          @change="handleTableChange"
        />
      </div>
      <GoodsSource ref="goodsSourceRef" />
    </div>
  </Page>
</template>

<style scoped>
:deep(.ant-table-wrapper) {
  height: 100%;
}

:deep(.ant-spin-nested-loading) {
  height: 100%;
}

:deep(.ant-spin-container) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

:deep(.ant-table) {
  flex: 1;
  overflow: hidden;
}

:deep(.ant-table-container) {
  height: 100%;
}

:deep(.ant-table-body) {
  overflow-y: auto !important;
}

:deep(.ant-pagination) {
  position: sticky;
  bottom: 0;
  z-index: 10;
  padding: 8px 0;
  margin: 16px 0 0 !important;
  background: white;
  border-top: 1px solid #f0f0f0;
}

:deep(.ant-select-dropdown) {
  z-index: 11;
}
</style>
