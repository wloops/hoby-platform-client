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
    path: '/my/product',
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
