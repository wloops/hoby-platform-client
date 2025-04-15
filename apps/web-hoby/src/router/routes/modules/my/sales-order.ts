import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      title: $t('page.my.salesOrder.title'),
      icon: 'solar:clipboard-linear',
      authority: ['my'],
    },
    name: 'MySalesOrder',
    path: '/my/sales-order',
    children: [
      {
        meta: {
          title: $t('page.my.salesOrder.inputSaleOrder.title'),
          icon: 'solar:clipboard-linear',
          authority: ['my'],
        },
        name: 'InputSaleOrder',
        path: '/my/sales-order/input',
        component: () => import('#/views/my/sales-order/input/main.vue'),
      },
      {
        meta: {
          title: $t('page.my.salesOrder.salesOrderManagement'),
          icon: 'solar:clipboard-linear',
          authority: ['my'],
        },
        name: 'SalesOrderManagement',
        path: '/my/sales-order/management',
        component: () => import('#/views/my/sales-order/management.vue'),
      },
    ],
  },
];

export default routes;
