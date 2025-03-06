<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-05 13:35:48
 * @Description: 订单管理页面
-->
<script setup lang="ts">
import type { VxeGridProps } from '#/adapter/vxe-table';

import { computed, h, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

interface OrderItem {
  id: string;
  orderNo: string;
  purchaseUnit: string;
  quantity: number;
  totalPrice: number;
  date: string;
  status: string;
}

const router = useRouter();

// 搜索条件
const searchForm = ref({
  orderNo: '',
  purchaseUnit: '',
  date: '',
});

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    orderNo: '',
    purchaseUnit: '',
    date: '',
  };
  handleSearch();
};

// 搜索
const handleSearch = () => {
  // 重置到第一页
  if (gridApi?.grid) {
    gridApi.grid.commitProxy('query', { page: { currentPage: 1 } });
  }
};

// 计算表格高度
const viewHeight = ref(window.innerHeight);
const tableHeight = computed(() => {
  const config = {
    headerHeight: 0,
    pagerHeight: 40,
    paddingTop: 8,
    paddingBottom: 8,
    toolbarHeight: 32,
    searchHeight: 140, // 搜索区域高度
    extraOffset: 10,
  };

  const totalOffset = Object.values(config).reduce((sum, val) => sum + val, 0);
  return viewHeight.value - totalOffset;
});

// 更新视口高度
const updateViewHeight = () => {
  viewHeight.value = window.innerHeight;
};

onMounted(() => {
  updateViewHeight();
  window.addEventListener('resize', updateViewHeight);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateViewHeight);
});

// 查看订单详情
const viewOrderDetail = (row: OrderItem) => {
  router.push(`/buyer/orderDetail:${row.id}`);
};

const gridOptions: VxeGridProps<OrderItem> = {
  columns: [
    {
      field: 'orderNo',
      title: '销售订单号',
      // width: 200,
      align: 'center',
    },
    {
      field: 'purchaseUnit',
      title: '采购单位',
      // width: 300,
    },
    {
      field: 'quantity',
      title: '商品数量',
      width: 100,
      align: 'center',
    },
    {
      field: 'totalPrice',
      title: '销售总价',
      width: 150,
      align: 'right',
      formatter: ({ cellValue }) => `¥${cellValue.toFixed(2)}`,
    },
    {
      field: 'date',
      title: '日期',
      width: 150,
      align: 'center',
    },
    {
      field: 'status',
      title: '状态',
      width: 100,
      align: 'center',
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      align: 'center',
      slots: {
        default: ({ row }) => {
          return [
            h(
              'button',
              {
                class: 'text-blue-500 hover:text-blue-600',
                onClick: () => viewOrderDetail(row),
              },
              '订单详情',
            ),
          ];
        },
      },
    },
  ],
  border: true,
  height: tableHeight.value,
  rowConfig: {
    keyField: 'id',
    height: 50,
  },
  emptyText: '暂无数据',
  emptyRender: {
    name: 'EmptyContent',
  },
  pagerConfig: {
    pageSize: 20,
    pageSizes: [10, 20, 50, 100],
  },
  proxyConfig: {
    autoLoad: true,
    ajax: {
      query: async ({ page }) => {
        const response = await fetchOrderList(page.currentPage, page.pageSize);
        return {
          items: response.items,
          total: response.total,
        };
      },
    },
    props: {
      result: 'result',
      total: 'total',
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
  tableTitle: '销售订单管理',
});

// 获取订单列表数据
async function fetchOrderList(_page: number, pageSize: number) {
  // TODO: 替换为实际的API调用
  return {
    items: Array.from({ length: pageSize }, (_, index) => ({
      id: `${111 + index}`,
      orderNo: `147524081311232${index.toString().padStart(5, '0')}`,
      purchaseUnit: '湖南省长沙市第一中学',
      quantity: Math.floor(Math.random() * 10) + 1,
      totalPrice: Number((Math.random() * 10_000).toFixed(2)),
      date: '2024-03-06',
      status: '待进货',
    })),
    total: 100,
  };
}
</script>

<template>
  <div class="flex h-full flex-col overflow-hidden">
    <!-- 搜索区域 -->
    <div class="mb-4 rounded-lg bg-white p-4 shadow-sm">
      <div class="grid grid-cols-3 gap-4">
        <div class="flex items-center gap-2">
          <span class="w-24 text-gray-600">销售订单号</span>
          <input
            v-model="searchForm.orderNo"
            type="text"
            class="flex-1 rounded-md border border-gray-300 px-3 py-1.5 focus:border-blue-500 focus:outline-none"
            placeholder="请输入订单号"
          />
        </div>
        <div class="flex items-center gap-2">
          <span class="w-24 text-gray-600">采购单位</span>
          <input
            v-model="searchForm.purchaseUnit"
            type="text"
            class="flex-1 rounded-md border border-gray-300 px-3 py-1.5 focus:border-blue-500 focus:outline-none"
            placeholder="请输入采购单位"
          />
        </div>
        <div class="flex items-center gap-2">
          <span class="w-24 text-gray-600">日期</span>
          <input
            v-model="searchForm.date"
            type="date"
            class="flex-1 rounded-md border border-gray-300 px-3 py-1.5 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>
      <div class="mt-4 flex justify-end gap-3">
        <button
          class="rounded-md bg-blue-500 px-4 py-1.5 text-white transition-colors hover:bg-blue-600"
          @click="handleSearch"
        >
          搜索
        </button>
        <button
          class="rounded-md border border-gray-300 px-4 py-1.5 text-gray-600 transition-colors hover:bg-gray-50"
          @click="resetSearch"
        >
          重置
        </button>
      </div>
    </div>

    <!-- 表格区域 -->
    <div class="flex-1 overflow-hidden rounded-lg bg-white shadow-sm">
      <Grid class="h-full">
        <template #toolbar-tools>
          <div class="py-1 text-gray-500">共 100 条记录</div>
        </template>
      </Grid>
    </div>
  </div>
</template>

<style scoped>
:deep(.vxe-grid--layout-body-content-wrapper) {
  overflow-y: hidden;
}

:deep(.vxe-grid) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

:deep(.vxe-table--main-wrapper) {
  flex: 1;
}

:deep(.vxe-pager) {
  position: sticky;
  bottom: 0;
  z-index: 10;
  padding: 8px 0;
  background: white;
  border-top: 1px solid #f0f0f0;
}

:deep(.vxe-table--render-default .vxe-table--body-wrapper) {
  background-color: #fff;
}
</style>
