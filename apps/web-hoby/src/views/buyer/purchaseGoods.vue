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
      field: 'orderNo',
      title: '销售订单号',
      align: 'center',
    },
    {
      field: 'purchaseUnit',
      title: '采购单位',
      align: 'center',
    },
    {
      field: 'quantity',
      title: '商品数量',
      width: 120,
      align: 'center',
    },
    {
      field: 'totalPrice',
      title: '销售总价',
      width: 180,
      align: 'right',
      formatter: ({ cellValue }) => `¥${cellValue.toFixed(2)}`,
    },
    {
      field: 'productCategoryList',
      title: '产品品类清单',
      width: 180,
      align: 'center',
    },
    {
      field: 'productModelList',
      title: '产品型号清单',
      width: 180,
      align: 'center',
    },

    {
      field: 'date',
      title: '日期',
      width: 120,
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
                  onClick: () => viewGoods(row),
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
  // tableTitle: '待进货销售订单',
});

// 查看待进货商品
function viewGoods(row: OrderItem) {
  // router.push(`/buyer/orderProduct:${row.id}`);
  router.push({
    name: 'BuyerOrderProduct',
    params: { id: row.id },
  });
}

// 获取订单列表数据
async function fetchOrderList(_page: number, pageSize: number) {
  // TODO: 替换为实际的API调用
  return {
    items: Array.from({ length: pageSize }, (_, index) => ({
      id: `${111 + index}`,
      orderNo: `SO1596956696${index + 1}`,
      purchaseUnit: '单位',
      quantity: 2,
      totalPrice: 2000,
      productCategoryList: ['产品品类1', '产品品类2', '产品品类3'],
      productModelList: ['产品型号1', '产品型号2'],
      date: '2025-03-06',
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

<style scoped></style>
