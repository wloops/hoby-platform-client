/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-04 16:17:01
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-15 23:18:29
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
      title: $t('page.buyer.genSaleOrder.title'),
      order: -1,
      authority: ['buyer'],
    },
    name: 'Buyer',
    path: '/buyer',
    children: [
      {
        meta: {
          title: $t('page.buyer.genSaleOrder.importOrder'),
          authority: ['buyer'],
          ignoreAccess: true,
        },
        name: 'BuyerImportOrder',
        path: '/buyer/importOrder',
        component: () => import('#/views/buyer/gen-order/developing.vue'),
      },
      {
        meta: {
          title: $t('page.buyer.genSaleOrder.inputOrder'),
          authority: ['buyer'],
          ignoreAccess: true,
        },
        name: 'BuyerInputOrder',
        path: '/buyer/inputOrder',
        component: () => import('#/views/buyer/gen-order/developing.vue'),
      },
    ],
  },
  {
    meta: {
      icon: 'lucide:layout-dashboard',
      order: 1,
      title: $t('page.buyer.purchaseGoods.title'),
      authority: ['buyer'],
    },
    name: 'BuyerPurchaseGoodsPage',
    path: '/buyer/purchaseGoodsPage',
    redirect: '/buyer/purchaseGoods',
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
          title: $t('page.buyer.purchaseGoods.purchaseGoodsByOrder'),
          authority: ['buyer'],
        },
        name: 'BuyerPurchaseGoods',
        path: '/buyer/purchaseGoods',
        component: () => import('#/views/buyer/purchaseGoods.vue'),
      },
      {
        meta: {
          title: $t('page.buyer.purchaseGoods.generateOrder'),
          authority: ['buyer'],
        },
        name: 'BuyerGenerateOrder',
        path: '/buyer/generateOrder',
        component: () => import('#/views/buyer/generateOrder.vue'),
      },
      {
        meta: {
          title: $t('page.buyer.purchaseGoods.orderDetail'),
          authority: ['buyer'],
          hideInMenu: true,
        },
        name: 'BuyerPurchaseGoodsDetail',
        path: '/buyer/orderDetail/:id',
        component: () => import('#/views/buyer/orderDetail.vue'),
      },
      {
        meta: {
          title: $t('page.buyer.purchaseGoods.orderProduct'),
          authority: ['buyer'],
          hideInMenu: true,
        },
        name: 'BuyerOrderProduct',
        path: '/buyer/orderProduct',
        component: () => import('#/views/buyer/orderProduct.vue'),
      },
    ],
  },
  {
    meta: {
      icon: 'lucide:layout-dashboard',
      order: 1,
      title: $t('page.buyer.settlement'),
      authority: ['buyer'],
    },
    name: 'BuyerSettlement',
    path: '/buyer/settlement',
    redirect: '/buyer/settlement',
    component: () => import('#/views/buyer/settlement.vue'),
    children: [],
  },
  {
    meta: {
      icon: 'lucide:layout-dashboard',
      order: 2,
      title: $t('page.buyer.orderManagement'),
      authority: ['buyer'],
      hideChildrenInMenu: true,
    },
    name: 'BuyerOrder',
    path: '/buyer/orderManagement',
    redirect: '/buyer/orderManagement',
    children: [
      {
        meta: {
          title: '订单管理',
          authority: ['buyer'],
        },
        name: 'BuyerOrderManagement',
        path: '/buyer/orderManagement',
        component: () => import('#/views/buyer/orderManagement.vue'),
      },
      {
        meta: {
          title: '订单详情',
          authority: ['buyer'],
        },
        name: 'BuyerOrderDetail',
        path: '/buyer/orderDetail/:id',
        component: () => import('#/views/buyer/orderDetail.vue'),
      },
    ],
  },
];

export default routes;
