<!--
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-04 17:24:16
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-07 12:13:22
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\views\buyer\settlement.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page } from '@vben/common-ui';

import { Button, Image, Switch, Tag } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

interface RowType {
  category: string;
  color: string;
  id: string;
  imageUrl: string;
  open: boolean;
  price: string;
  productName: string;
  releaseDate: string;
  status: 'error' | 'success' | 'warning';
}

// 模拟数据生成
async function fetchTableData(page: number, pageSize: number) {
  return {
    items: Array.from({ length: pageSize }, (_, index) => {
      return {
        id: `${page * pageSize + index}`,
        purchaseOrderNo: `PO${index + 1}`,
        voucherType: '采购订单',
        payee: '供应商A',
        amount: `¥${(Math.random() * 1000).toFixed(2)}`,
        accountPeriod: '30天',
        interestRate: '5%',
        interestAmount: `¥${(Math.random() * 100).toFixed(2)}`,
        performanceDate: '2025-03-01',
        status: 'success',
        paidAmount: `¥${(Math.random() * 1000).toFixed(2)}`,
      };
    }),
    total: 100,
  };
}

const gridOptions: VxeGridProps<RowType> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'name',
  },
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    { field: 'purchaseOrderNo', title: '进货订单号' },
    { field: 'voucherType', title: '凭证类型' },
    { field: 'payee', title: '收款单位' },
    { field: 'amount', title: '结算金额', width: 100 },
    { field: 'accountPeriod', title: '账期', width: 100 },
    { field: 'interestRate', title: '利率', width: 100 },
    { field: 'interestAmount', title: '预计利息', width: 100 },
    { field: 'performanceDate', title: '履约日期', width: 100 },
    { field: 'status', title: '付款状态', width: 100 },
    { field: 'paidAmount', title: '已付金额', width: 100 },
    {
      cellRender: { name: 'CellLink', props: { text: '完成付款' } },
      field: 'action',
      fixed: 'right',
      title: '操作',
      width: 120,
    },
  ],
  height: 'auto',
  keepSource: true,
  pagerConfig: {
    pageSize: 20,
    pageSizes: [10, 20, 50, 100],
  },
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        const response = await fetchTableData(page.currentPage, page.pageSize);
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
  showOverflow: false,
};

const [Grid] = useVbenVxeGrid({ gridOptions });
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #image-url="{ row }">
        <Image :src="row.imageUrl" height="30" width="30" />
      </template>
      <template #open="{ row }">
        <Switch v-model:checked="row.open" />
      </template>
      <template #status="{ row }">
        <Tag :color="row.color">{{ row.status }}</Tag>
      </template>
      <template #action>
        <Button type="link">编辑</Button>
      </template>
    </Grid>
  </Page>
</template>
