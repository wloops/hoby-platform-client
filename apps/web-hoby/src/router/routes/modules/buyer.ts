/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-04 16:17:01
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-05 16:42:32
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
      title: $t('page.buyer.orderManagement'),
      hideChildrenInMenu: true,
    },
    name: 'Buyer',
    path: '/buyer',
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
];

export default routes;
