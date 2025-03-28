/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-09 21:44:11
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-09 22:39:12
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\router\routes\modules\seller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'mdi:storefront',
      order: 1,
      title: $t('page.shopping.title'),
      authority: ['shopping'],
    },
    name: 'Shopping',
    path: '/shopping',
    children: [
      {
        meta: {
          title: $t('page.shopping.home'),
          icon: 'mdi:storefront',
          authority: ['shopping'],
        },
        name: 'ShoppingIndex',
        path: '/shopping',
        component: () => import('#/views/shopping/index.vue'),
      },
    ],
  },
];

export default routes;
