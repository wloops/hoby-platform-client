/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-04 16:17:01
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-09 16:27:34
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
      title: $t('page.buyer.purchaseGoods.title'),
    },
    name: 'Buyer',
    path: '/buyer',
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
        },
        name: 'BuyerPurchaseGoods',
        path: '/buyer/purchaseGoods',
        component: () => import('#/views/buyer/purchaseGoods.vue'),
      },
      {
        meta: {
          title: $t('page.buyer.purchaseGoods.generateOrder'),
        },
        name: 'BuyerGenerateOrder',
        path: '/buyer/generateOrder',
        component: () => import('#/views/buyer/generateOrder.vue'),
      },
      {
        meta: {
          title: $t('page.buyer.purchaseGoods.orderDetail'),
          hideInMenu: true,
        },
        name: 'BuyerPurchaseGoodsDetail',
        path: '/buyer/orderDetail/:id',
        component: () => import('#/views/buyer/orderDetail.vue'),
      },
      {
        meta: {
          title: $t('page.buyer.purchaseGoods.orderProduct'),
          hideInMenu: true,
        },
        name: 'BuyerOrderProduct',
        path: '/buyer/orderProduct/:id',
        component: () => import('#/views/buyer/orderProduct.vue'),
      },
    ],
  },
  {
    meta: {
      icon: 'lucide:layout-dashboard',
      order: 1,
      title: $t('page.buyer.settlement'),
    },
    name: 'BuyerSettlement',
    path: '/buyer/settlement',
    component: () => import('#/views/buyer/settlement.vue'),
    children: [],
  },
  {
    meta: {
      icon: 'lucide:layout-dashboard',
      order: 2,
      title: $t('page.buyer.orderManagement'),
      hideChildrenInMenu: true,
    },
    name: 'BuyerOrder',
    path: '/buyer/orderManagement',
    children: [
      {
        meta: {
          title: '订单管理',
        },
        name: 'BuyerOrderManagement',
        path: '/buyer/orderManagement',
        component: () => import('#/views/buyer/orderManagement.vue'),
      },
      {
        meta: {
          title: '订单详情',
        },
        name: 'BuyerOrderDetail',
        path: '/buyer/orderDetail:id',
        component: () => import('#/views/buyer/orderDetail.vue'),
      },
    ],
  },
];

export default routes;
