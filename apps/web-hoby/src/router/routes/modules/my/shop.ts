import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      title: $t('page.my.shopManagement.title'),
      icon: 'solar:shop-2-line-duotone',
      authority: ['my'],
    },
    name: 'MyShopManagement',
    path: '/my/shop',
    children: [
      {
        meta: {
          title: $t('page.my.shopManagement.priWareGoodsMng.title'),
          icon: 'mdi:office-building',
          authority: ['my'],
        },
        name: 'MyPriWareGoodsMng',
        path: '/my/warehouse/private/general-ledger',
        children: [
          {
            meta: {
              title: $t(
                'page.my.shopManagement.priWareGoodsMng.myPriWareService',
              ),
              icon: 'mdi:arrange-send-to-back',
              authority: ['my'],
            },
            name: 'MyPriWareService',
            path: '/my/warehouse/private/general-ledger/open',
            component: () =>
              import('#/views/warehouse/private/general-ledger/open.vue'),
          },
          {
            meta: {
              title: $t(
                'page.my.shopManagement.priWareGoodsMng.priWareProductList',
              ),
              icon: 'solar:box-minimalistic-outline',
              authority: ['my'],
            },
            name: 'PriWareProductList',
            path: '/my/warehouse/private/general-ledger/products',
            component: () =>
              import('#/views/warehouse/private/general-ledger/products.vue'),
          },
          {
            meta: {
              title: $t(
                'page.my.shopManagement.priWareGoodsMng.priWareSrlIDList',
              ),
              icon: 'mdi:animation-outline',
              authority: ['my'],
            },
            name: 'PriWareSrlIDList',
            path: '/my/warehouse/private/general-ledger/model',
            component: () =>
              import('#/views/warehouse/private/general-ledger/model.vue'),
          },
          {
            meta: {
              title: $t(
                'page.my.shopManagement.priWareGoodsMng.priWareGoodsList',
              ),
              icon: 'mdi:view-module-outline',
              authority: ['my'],
            },
            name: 'PriWareGoodsList',
            path: '/my/warehouse/private/general-ledger/sku',
            component: () =>
              import('#/views/warehouse/private/general-ledger/sku.vue'),
          },
        ],
      },
      {
        meta: {
          title: $t('page.my.shopManagement.priWareShopMng.title'),
          icon: 'mdi:office-building',
          authority: ['my'],
        },
        name: 'MyPriWareShopMng',
        path: '/my/shop/private',
        children: [
          {
            meta: {
              title: $t('page.my.shopManagement.priWareShopMng.priWareShop'),
              icon: 'solar:shop-minimalistic-bold',
              authority: ['my'],
            },
            name: 'PriWareShop',
            path: '/my/shop/private',
            component: () => import('#/views/shop/private/shop.vue'),
          },
          {
            meta: {
              title: $t(
                'page.my.shopManagement.priWareShopMng.shopProductList',
              ),
              icon: 'solar:box-minimalistic-outline',
              authority: ['my'],
            },
            name: 'ShopProductList',
            path: '/my/shop/private/products',
            component: () => import('#/views/shop/private/products.vue'),
          },
          {
            meta: {
              title: $t('page.my.shopManagement.priWareShopMng.shopSrlIDList'),
              icon: 'mdi:animation-outline',
              authority: ['my'],
            },
            name: 'ShopSrlIDList',
            path: '/my/shop/private/model',
            component: () => import('#/views/shop/private/model.vue'),
          },
          {
            meta: {
              title: $t('page.my.shopManagement.priWareShopMng.shopGoodsList'),
              icon: 'mdi:view-module-outline',
              authority: ['my'],
            },
            name: 'ShopGoodsList',
            path: '/my/shop/private/sku',
            component: () => import('#/views/shop/private/sku.vue'),
          },
        ],
      },
      {
        meta: {
          title: $t('page.my.shopManagement.myWarehouseMng.title'),
          icon: 'mdi:home-battery-outline',
          authority: ['my'],
        },
        name: 'MyWarehouseMng',
        path: '/my/warehouse/info',
        children: [
          {
            meta: {
              title: $t('page.my.shopManagement.myWarehouseMng.myWarehouse'),
              authority: ['my'],
              icon: 'mdi:warehouse',
            },
            name: 'MyWarehouse',
            path: '/my/warehouse/info/management',
            component: () => import('#/views/warehouse/info/management.vue'),
          },
          {
            meta: {
              title: $t(
                'page.my.shopManagement.myWarehouseMng.defaultWarehouse',
              ),
              authority: ['my'],
              icon: 'solar:home-smile-bold-duotone',
            },
            name: 'DefaultWarehouse',
            path: '/my/warehouse/info/deficit',
            component: () => import('#/views/warehouse/info/deficit.vue'),
          },
        ],
      },
    ],
  },
];

export default routes;
