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
  product: string;
  srlID: string;
  skuValue: string;
  allSKU: string;
  distributionPrice: number;
  terminalPrice: number;
  totalInventory: number;
  soldQuantity: number;
  divisionRules: string;
}

const router = useRouter();

// 搜索条件
const searchForm = ref({
  product: '',
  srlID: '',
  skuvalue: '',
});

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    product: '',
    srlID: '',
    skuvalue: '',
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
      field: 'product',
      title: '产品',
      // width: 200,
      align: 'center',
    },
    {
      field: 'srlID',
      title: '型号',
      // width: 300,
    },
    {
      field: 'skuValue',
      title: 'SKU值',
      width: 100,
      align: 'center',
    },
    {
      field: 'allSKU',
      title: '完整的SKU',
      width: 200,
      align: 'center',
    },
    {
      field: 'distributionPrice',
      title: '分销商价格',
      width: 100,
      align: 'center',
      formatter: ({ cellValue }) => `¥${cellValue.toFixed(2)}`,
    },
    {
      field: 'terminalPrice',
      title: '终端价格',
      width: 100,
      align: 'center',
      formatter: ({ cellValue }) => `¥${cellValue.toFixed(2)}`,
    },
    {
      field: 'totalInventory',
      title: '库存总数',
      width: 80,
      align: 'center',
    },
    {
      field: 'soldQuantity',
      title: '已售数',
      width: 80,
      align: 'center',
    },
    {
      field: 'divisionRules',
      title: '分成规则',
      width: 150,
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
            h('div', { class: 'flex gap-4 justify-center' }, [
              h(
                'button',
                {
                  class: 'text-blue-500 hover:text-blue-600',
                  onClick: () => viewOrderDetail(row),
                },
                '查询',
              ),
              h(
                'button',
                {
                  class: 'text-blue-500 hover:text-blue-600',
                  onClick: () => viewOrderDetail(row),
                },
                '更新售价',
              ),
            ]),
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
  tableTitle: '',
});

// 获取订单列表数据
async function fetchOrderList(_page: number, pageSize: number) {
  // TODO: 替换为实际的API调用
  return {
    items: Array.from({ length: pageSize }, (_, index) => ({
      id: `${111 + index}`,
      product: '男士T恤衫',
      srlID: '圆领文化衫',
      skuValue: 'L.白色',
      allSKU: '尺寸=L,颜色=白色',
      distributionPrice: 50,
      terminalPrice: 100,
      totalInventory: '10',
      soldQuantity: '5',
      divisionRules: '厂商50%-经销商49.5%-平台0.5%',
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
          <span class="w-24 text-gray-600">产品</span>
          <input
            v-model="searchForm.product"
            type="text"
            class="flex-1 rounded-md border border-gray-300 px-3 py-1.5 focus:border-blue-500 focus:outline-none"
            placeholder="请输入产品名称"
          />
        </div>
        <div class="flex items-center gap-2">
          <span class="w-24 text-gray-600">型号</span>
          <input
            v-model="searchForm.srlID"
            type="text"
            class="flex-1 rounded-md border border-gray-300 px-3 py-1.5 focus:border-blue-500 focus:outline-none"
            placeholder="请输入产品型号"
          />
        </div>
        <div class="flex items-center gap-2">
          <span class="w-24 text-gray-600">SKU值</span>
          <input
            v-model="searchForm.srlID"
            type="text"
            class="flex-1 rounded-md border border-gray-300 px-3 py-1.5 focus:border-blue-500 focus:outline-none"
            placeholder="请输入产品SKU值"
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
        <template #toolbar-tools> </template>
      </Grid>
    </div>
  </div>
</template>

<style scoped>
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
