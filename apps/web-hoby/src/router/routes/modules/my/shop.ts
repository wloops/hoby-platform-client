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
              pageParams: {
                pageID: 'privateWareActivatedPage',
              },
            },
            name: 'MyPriWareService',
            path: '/my/shop/ware-goods/open',
            component: () => import('#/views/_core/basic/BasicTablePage.vue'),
          },
          {
            meta: {
              title: $t(
                'page.my.shopManagement.priWareGoodsMng.priWareProductList',
              ),
              icon: 'solar:box-minimalistic-outline',
              authority: ['my'],
              pageParams: {
                pageID: 'privateWareStoreProductPage',
              },
            },
            name: 'PriWareProductList',
            path: '/my/shop/ware-goods/products',
            component: () => import('#/views/_core/basic/BasicTablePage.vue'),
          },
          {
            meta: {
              title: $t(
                'page.my.shopManagement.priWareGoodsMng.priWareSrlIDList',
              ),
              icon: 'mdi:animation-outline',
              authority: ['my'],
              pageParams: {
                pageID: 'privateWareStoreSrlIDPage',
              },
            },
            name: 'PriWareSrlIDList',
            path: '/my/shop/ware-goods/model',
            component: () => import('#/views/_core/basic/BasicTablePage.vue'),
          },
          {
            meta: {
              title: $t(
                'page.my.shopManagement.priWareGoodsMng.priWareGoodsList',
              ),
              icon: 'mdi:view-module-outline',
              authority: ['my'],
              pageParams: {
                pageID: 'privateWareStoreSKUPage',
              },
            },
            name: 'PriWareGoodsList',
            path: '/my/shop/ware-goods/sku',
            component: () => import('#/views/_core/basic/BasicTablePage.vue'),
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
              pageParams: {
                pageID: 'myPrivateWareShopPage',
              },
            },
            name: 'PriWareShop',
            path: '/my/shop/ware-shop',
            component: () => import('#/views/_core/basic/BasicTablePage.vue'),
          },
          {
            meta: {
              title: $t(
                'page.my.shopManagement.priWareShopMng.shopProductList',
              ),
              icon: 'solar:box-minimalistic-outline',
              authority: ['my'],
              pageParams: {
                pageID: 'myPrivateWareShopProductPage',
              },
            },
            name: 'ShopProductList',
            path: '/my/shop/ware-shop/products',
            component: () => import('#/views/_core/basic/BasicTablePage.vue'),
          },
          {
            meta: {
              title: $t('page.my.shopManagement.priWareShopMng.shopSrlIDList'),
              icon: 'mdi:animation-outline',
              authority: ['my'],
              pageParams: {
                pageID: 'myPrivateWareShopSrlIDPage',
              },
            },
            name: 'ShopSrlIDList',
            path: '/my/shop/ware-shop/model',
            component: () => import('#/views/_core/basic/BasicTablePage.vue'),
          },
          {
            meta: {
              title: $t('page.my.shopManagement.priWareShopMng.shopGoodsList'),
              icon: 'mdi:view-module-outline',
              authority: ['my'],
              pageParams: {
                pageID: 'myPrivateWareShopSKUPage',
              },
            },
            name: 'ShopGoodsList',
            path: '/my/shop/ware-shop/sku',
            component: () => import('#/views/_core/basic/BasicTablePage.vue'),
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
              pageParams: {
                pageID: 'myWarehouseInformationPage',
              },
            },
            name: 'MyWarehouse',
            path: '/my/shop/my-warehouse/management',
            component: () => import('#/views/_core/basic/BasicTablePage.vue'),
          },
          {
            meta: {
              title: $t(
                'page.my.shopManagement.myWarehouseMng.defaultWarehouse',
              ),
              authority: ['my'],
              icon: 'solar:home-smile-bold-duotone',
              pageParams: {
                pageID: 'myDefaultWarehouseInformationPage',
              },
            },
            name: 'DefaultWarehouse',
            path: '/my/shop/my-warehouse/deficit',
            component: () => import('#/views/_core/basic/BasicTablePage.vue'),
          },
        ],
      },
    ],
  },
];

export default routes;
