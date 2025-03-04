/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-04 16:17:01
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-04 17:40:35
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
    name: 'BuyerPurchaseGoods',
    path: '/buyer',
    component: () => import('#/views/buyer/purchaseGoods.vue'),
    children: [
      {
        meta: {
          title: $t('page.buyer.purchaseGoods.importOrder'),
        },
        name: 'BuyerPurchaseGoodsImportOrder',
        path: '/buyer/importOrder',
        component: () => import('#/views/buyer/importOrder.vue'),
      },
      {
        meta: {
          title: $t('page.buyer.purchaseGoods.purchaseGoodsByOrder'),
        },
        name: 'BuyerPurchaseGoodsPurchaseGoodsByOrder',
        path: '/buyer/purchaseGoodsByOrder',
        component: () => import('#/views/buyer/purchaseGoodsByOrder.vue'),
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
      order: 1,
      title: $t('page.buyer.orderManagement'),
    },
    name: 'BuyerOrderManagement',
    path: '/buyer/orderManagement',
    component: () => import('#/views/buyer/orderManagement.vue'),
    children: [],
  },
];

export default routes;
