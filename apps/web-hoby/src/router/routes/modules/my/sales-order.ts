/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-04-16 00:02:40
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-04-16 13:25:31
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\router\routes\modules\my\sales-order.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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
          icon: 'mdi:pencil-minus-outline',
          authority: ['my'],
        },
        name: 'InputSaleOrder',
        path: '/my/sales-order/input',
        component: () => import('#/views/my/sales-order/input/main.vue'),
      },
      {
        meta: {
          title: $t('page.my.salesOrder.salesOrderManagement'),
          icon: 'mdi:file-table-box-multiple-outline',
          authority: ['my'],
          pageParams: {
            pageID: 'hobyMySaleOrderPage',
            isTabs: true,
          },
        },
        name: 'SalesOrderManagement',
        path: '/my/sales-order/management',
        component: () => import('#/views/_core/basic/BasicTablePage.vue'),
      },
    ],
  },
];

export default routes;
