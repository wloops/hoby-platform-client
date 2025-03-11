/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-04 16:17:01
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-11 13:15:27
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\router\routes\modules\buyer.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-04 16:17:01
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-04 16:17:41
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\router\routes\modules\buyer.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:layout-dashboard',
      order: 1,
      title: $t('page.products.productStandards.title'),
      authority: ['products'],
    },
    name: 'Products',
    path: '/products',
    children: [
      // {
      //   meta: {
      //     title: $t('page.buyer.purchaseGoods.importOrder'),
      //   },
      //   name: 'BuyerImportOrder',
      //   path: '/buyer/importOrder',
      //   component: () => import('#/views/buyer/importOrder.vue'),
      // },
      {
        meta: {
          title: $t('page.products.productStandards.productStandards'),
        },
        name: 'ProductProductStandards',
        path: '/products/productStandards',
        component: () => import('#/views/products/productStandards.vue'),
      },
      {
        meta: {
          title: $t('page.products.productStandards.productModel'),
        },
        name: 'ProductProductModel',
        path: '/products/productModel',
        component: () => import('#/views/products/productModel.vue'),
      },
      {
        meta: {
          title: $t('page.products.productStandards.mySKU'),
        },
        name: 'ProductMySKU',
        path: '/products/mySKU',
        component: () => import('#/views/products/mySKU.vue'),
      },
      {
        meta: {
          title: $t('page.products.productStandards.specStandards'),
        },
        name: 'ProductSpecStandards',
        path: '/products/specStandards',
        component: () => import('#/views/products/specStandards.vue'),
      },
    ],
  },
  {
    meta: {
      icon: 'lucide:layout-dashboard',
      order: 1,
      title: $t('page.products.agentAuthByMe'),
      authority: ['products'],
    },
    name: 'ProductAgentAuthByMe',
    path: '/products/agentAuthByMe',
    component: () => import('#/views/products/agentAuthByMe.vue'),
    children: [],
  },
  {
    meta: {
      icon: 'lucide:layout-dashboard',
      order: 2,
      title: $t('page.products.wareTraderByMe'),
      authority: ['products'],
    },
    name: 'ProductWareTraderByMe',
    path: '/products/wareTraderByMe',
    children: [
      // {
      //   meta: {
      //     title: '订单管理',
      //   },
      //   name: 'BuyerOrderManagement',
      //   path: '/buyer/orderManagement',
      //   component: () => import('#/views/buyer/orderManagement.vue'),
      // },
      // {
      //   meta: {
      //     title: '订单详情',
      //   },
      //   name: 'BuyerOrderDetail',
      //   path: '/buyer/orderDetail:id',
      //   component: () => import('#/views/buyer/orderDetail.vue'),
      // },
    ],
  },
];

export default routes;
