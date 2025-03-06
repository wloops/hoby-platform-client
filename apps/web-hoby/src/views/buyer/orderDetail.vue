<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-05 13:35:48
 * @Description: 按订单进货页面
-->
<script setup lang="ts">
import type { VxeGridProps } from '#/adapter/vxe-table';

import { computed, h, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

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

// const gridContainerRef = ref<HTMLElement>();
// const { height: containerHeight } = useElementSize(gridContainerRef);
const viewHeight = ref(window.innerHeight);

// 计算表格高度
const tableHeight = computed(() => {
  const config = {
    headerHeight: 0,
    pagerHeight: 40,
    paddingTop: 8,
    paddingBottom: 8,
    toolbarHeight: 32,
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

const gridOptions: VxeGridProps<OrderItem> = {
  columns: [
    {
      title: '商品',
      width: 400,
      children: [
        {
          field: 'productImage',
          title: '图片',
          width: 120,
          cellRender: {
            name: 'CellImage',
            // props: {
            //   fit: 'cover',
            // },
          },
          // align: 'center',
          className: 'product-image-cell',
        },
        {
          field: 'productInfo',
          title: '商品信息',
          // width: 320,
          slots: {
            default: ({ row }) => {
              return [
                h('div', { class: 'flex flex-col gap-1' }, [
                  h(
                    'div',
                    { class: 'font-medium' },
                    `${row.manufacturer} · ${row.productName}`,
                  ),
                  h(
                    'div',
                    { class: 'text-gray-500 text-sm' },
                    row.specs.join(' · '),
                  ),
                ]),
              ];
            },
          },
        },
      ],
    },
    {
      field: 'quantity',
      title: '数量',
      width: 120,
      align: 'center',
    },
    {
      field: 'unitPrice',
      title: '销售单价',
      width: 180,
      align: 'right',
      formatter: ({ cellValue }) => `¥${cellValue.toFixed(2)}`,
    },
    {
      field: 'totalPrice',
      title: '销售总价',
      width: 180,
      align: 'right',
      formatter: ({ cellValue }) => `¥${cellValue.toFixed(2)}`,
    },
    {
      field: 'status',
      title: '状态',
      width: 100,
      align: 'center',
    },
    {
      title: '操作',
      width: 180,
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
                  onClick: () => viewSource(row),
                },
                '查看货源',
              ),
              h(
                'button',
                {
                  class: 'text-blue-500 hover:text-blue-600',
                  onClick: () => viewOrderDetail(row),
                },
                '订单详情',
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
    height: 80,
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

// const [Grid, gridApi] = useVbenVxeGrid({
const [Grid] = useVbenVxeGrid({
  gridOptions,
  tableTitle: '待进货销售订单',
});

// 查看货源
function viewSource(row: OrderItem) {
  router.push(`/buyer/source/${row.id}`);
}

// 查看订单详情
function viewOrderDetail(row: OrderItem) {
  router.push(`/buyer/order/${row.id}`);
}

// 获取订单列表数据
async function fetchOrderList(_page: number, pageSize: number) {
  // TODO: 替换为实际的API调用

  return {
    items: Array.from({ length: pageSize }, (_, index) => ({
      id: `${111 + index}`,
      productImage:
        'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp',
      productName: '示例商品',
      manufacturer: '示例厂商',
      specs: ['规格值', '规格值'],
      quantity: 2,
      unitPrice: 1000,
      totalPrice: 2000,
      status: '待进货',
    })),
    total: 100,
  };
}
</script>

<template>
  <div class="flex h-full flex-col overflow-hidden">
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <button
          class="flex items-center gap-1 text-gray-600 hover:text-blue-500"
          @click="router.back()"
        >
          <i class="i-ion:arrow-back-outline text-lg"></i>
          返回列表
        </button>
        <span class="text-xl font-medium">订单详情</span>
      </div>
    </div>

    <div class="flex-1 overflow-hidden rounded-lg bg-white shadow-sm">
      <Grid class="h-full">
        <template #toolbar-tools>
          <div class="py-1 text-gray-500">
            销售订单号：{{ $route.params.id }}
          </div>
        </template>
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

:deep(.product-image-cell) {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  padding: 10px;
}

:deep(.product-image-cell img) {
  width: 65px;
  height: 65px;
  object-fit: cover;
  border-radius: 4px;
}
</style>
