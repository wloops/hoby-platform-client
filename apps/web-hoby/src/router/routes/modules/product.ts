/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-04 16:17:01
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-06 15:52:48
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
      title: $t('page.product.productStandards.title'),
    },
    name: 'Product',
    path: '/product',
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
          title: $t('page.product.productStandards.productStandards'),
        },
        name: 'ProductProductStandards',
        path: '/product/productStandards',
        component: () => import('#/views/product/productStandards.vue'),
      },
      {
        meta: {
          title: $t('page.product.productStandards.productModel'),
        },
        name: 'ProductProductModel',
        path: '/product/productModel',
        component: () => import('#/views/product/productModel.vue'),
      },
      {
        meta: {
          title: $t('page.product.productStandards.mySKU1'),
        },
        name: 'ProductMySKU1',
        path: '/product/mySKU1',
        component: () => import('#/views/product/mySKU1.vue'),
      },
      {
        meta: {
          title: $t('page.product.productStandards.specStandards'),
        },
        name: 'ProductSpecStandards',
        path: '/product/specStandards',
        component: () => import('#/views/product/specStandards.vue'),
      },
    ],
  },
  {
    meta: {
      icon: 'lucide:layout-dashboard',
      order: 1,
      title: $t('page.product.agentAuthByMe'),
    },
    name: 'ProductAgentAuthByMe',
    path: '/product/agentAuthByMe',
    component: () => import('#/views/product/agentAuthByMe.vue'),
    children: [],
  },
  {
    meta: {
      icon: 'lucide:layout-dashboard',
      order: 2,
      title: $t('page.product.wareTraderByMe'),
      hideChildrenInMenu: true,
    },
    name: 'ProductWareTraderByMe',
    path: '/product/wareTraderByMe',
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
