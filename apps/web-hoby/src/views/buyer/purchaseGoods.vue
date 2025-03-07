<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-06 16:00:00
 * @Description: 待进货商品页面
-->
<script setup lang="ts">
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { h, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getUserInfoApi } from '#/api/core';

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

// 计算表格高度
const viewHeight = ref(window.innerHeight);

const searchHeight = ref(0);
// vxe-grid--form-wrapper的高度
const updateSearchHeight = () => {
  const search = document.querySelector(
    '.vxe-grid--form-wrapper',
  ) as HTMLElement;
  if (search) {
    searchHeight.value = search.offsetHeight;
  }
};
updateSearchHeight();
getUserInfoApi();
// const tableHeight = computed(() => {
//   const config = {
//     // headerHeight: 0,
//     // pagerHeight: 40,
//     // paddingTop: 16,
//     // paddingBottom: 16,
//     // toolbarHeight: 32,
//     searchHeight: searchHeight.value, // 搜索区域高度
//     extraOffset: 0,
//   };

//   const totalOffset = Object.values(config).reduce((sum, val) => sum + val, 0);
//   return viewHeight.value - totalOffset;
// });

// 更新视口高度
const updateViewHeight = () => {
  viewHeight.value = window.innerHeight;
  updateSearchHeight();
};

onMounted(() => {
  updateViewHeight();
  window.addEventListener('resize', updateViewHeight);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateViewHeight);
});

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '',
      },
      defaultValue: '',
      fieldName: 'orderNo',
      label: '销售订单号',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '',
      },
      fieldName: 'purchaseUnit',
      label: '采购单位',
    },
    {
      component: 'DatePicker',
      fieldName: 'date',
      label: '日期',
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
  // 是否在字段值改变时提交表单
  submitOnChange: false,
  // 按下回车时是否提交表单
  submitOnEnter: false,
};

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
          },
          className: 'product-image-cell',
        },
        {
          field: 'productInfo',
          title: '商品信息',
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
                '订单详情',
              ),
              h(
                'button',
                {
                  class: 'text-blue-500 hover:text-blue-600',
                  onClick: () => viewOrderDetail(row),
                },
                '待进货商品',
              ),
            ]),
          ];
        },
      },
    },
  ],
  border: true,
  height: 'auto',
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

const [Grid] = useVbenVxeGrid({
  formOptions,
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
  <Page auto-content-height>
    <Grid />
  </Page>
</template>

<style scoped>
/* :deep(.vxe-grid--layout-body-content-wrapper) {
  overflow: hidden;
} */

/* :deep(.vxe-grid) {
  display: flex;
  flex-direction: column;
  height: 100%;
} */

/* :deep(.vxe-table--main-wrapper) {
  flex: 1;
}

:deep(.vxe-table--body-wrapper) {
  overflow-y: auto;
} */

/* :deep(.vxe-pager) {
  position: sticky;
  bottom: 0;
  z-index: 10;
  padding: 8px 0;
  background: white;
  border-top: 1px solid #f0f0f0;
} */

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
