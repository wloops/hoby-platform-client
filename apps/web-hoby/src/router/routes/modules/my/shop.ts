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
          icon: 'mdi:google-circles-extended',
          authority: ['my'],
        },
        name: 'MyPriWareGoodsMng',
        path: '/my/shop/ware-goods',
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
            path: '/my/shop/ware-goods/open',
            component: () => import('#/views/my/shop/ware-goods/open.vue'),
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
            path: '/my/shop/ware-goods/products',
            component: () => import('#/views/my/shop/ware-goods/products.vue'),
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
            path: '/my/shop/ware-goods/model',
            component: () => import('#/views/my/shop/ware-goods/model.vue'),
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
            path: '/my/shop/ware-goods/sku',
            component: () => import('#/views/my/shop/ware-goods/sku.vue'),
          },
        ],
      },
      {
        meta: {
          title: $t('page.my.shopManagement.priWareShopMng.title'),
          icon: 'mdi:google-drive',
          authority: ['my'],
        },
        name: 'MyPriWareShopMng',
        path: '/my/shop/ware-shop',
        children: [
          {
            meta: {
              title: $t('page.my.shopManagement.priWareShopMng.priWareShop'),
              icon: 'solar:shop-minimalistic-bold',
              authority: ['my'],
            },
            name: 'PriWareShop',
            path: '/my/shop/ware-shop',
            component: () => import('#/views/my/shop/ware-shop/shop.vue'),
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
            path: '/my/shop/ware-shop/products',
            component: () => import('#/views/my/shop/ware-shop/products.vue'),
          },
          {
            meta: {
              title: $t('page.my.shopManagement.priWareShopMng.shopSrlIDList'),
              icon: 'mdi:animation-outline',
              authority: ['my'],
            },
            name: 'ShopSrlIDList',
            path: '/my/shop/ware-shop/model',
            component: () => import('#/views/my/shop/ware-shop/model.vue'),
          },
          {
            meta: {
              title: $t('page.my.shopManagement.priWareShopMng.shopGoodsList'),
              icon: 'mdi:view-module-outline',
              authority: ['my'],
            },
            name: 'ShopGoodsList',
            path: '/my/shop/ware-shop/sku',
            component: () => import('#/views/my/shop/ware-shop/sku.vue'),
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
        path: '/my/shop/my-warehouse',
        children: [
          {
            meta: {
              title: $t('page.my.shopManagement.myWarehouseMng.myWarehouse'),
              authority: ['my'],
              icon: 'mdi:warehouse',
            },
            name: 'MyWarehouse',
            path: '/my/shop/my-warehouse/management',
            component: () =>
              import('#/views/my/shop/my-warehouse/management.vue'),
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
            path: '/my/shop/my-warehouse/deficit',
            component: () => import('#/views/my/shop/my-warehouse/deficit.vue'),
          },
        ],
      },
    ],
  },
];

export default routes;
