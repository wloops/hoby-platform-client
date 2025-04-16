/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-04-15 10:45:50
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-04-16 18:03:35
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\router\routes\modules\my\product.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      title: $t('page.my.productManagement.title'),
      icon: 'solar:archive-broken',
      authority: ['my'],
    },
    name: 'MyProductManagement',
    path: '/my',
    children: [
      {
        meta: {
          title: $t('page.my.productManagement.productStandard'),
          icon: 'mdi:office-building',
          authority: ['my'],
        },
        name: 'MyProductStandard',
        path: '/my/product/standard',
        component: () => import('#/views/products/productStandards.vue'),
      },
      {
        meta: {
          title: $t('page.my.productManagement.productModel'),
          icon: 'mdi:map-marker',
          authority: ['my'],
        },
        name: 'MyProductModel',
        path: '/my/product/model',
        component: () => import('#/views/products/productModel.vue'),
      },
      {
        meta: {
          title: $t('page.my.productManagement.specStandards'),
          icon: 'mdi:account-group',
          authority: ['my'],
        },
        name: 'MySpecStandards',
        path: '/my/product/spec-standards',
        component: () => import('#/views/products/specStandards.vue'),
      },
      {
        meta: {
          title: $t('page.my.productManagement.productCatalog'),
          icon: 'mdi:account-cog',
          authority: ['my'],
        },
        name: 'MyProductCatalog',
        path: '/my/product/catalog',
        component: () => import('#/views/products/mySKU.vue'),
      },
    ],
  },
];

export default routes;
