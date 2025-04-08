/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-09 21:44:11
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-04-08 15:10:42
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\router\routes\modules\seller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      title: $t('page.shop.saleOrder.title'),
      icon: 'mdi:file-document-arrow-right-outline',
      authority: ['shop'],
    },
    name: 'ShopSaleOrder',
    path: '/shop',
    children: [
      {
        meta: {
          title: $t('page.shop.saleOrder.pendingOrders'),
          icon: 'mdi:folder-plus-outline',
          authority: ['shop'],
        },
        name: 'ShopOrderPendingOrders',
        path: '/shop/order',
        component: () => import('#/views/shop/order/pendingOrders.vue'),
      },
      {
        meta: {
          title: $t('page.shop.saleOrder.pendingShipment'),
          icon: 'mdi:truck-alert-outline',
          authority: ['shop'],
        },
        name: 'ShopOrderPendingShipment',
        path: '/shop/order/pendingShipment',
        component: () => import('#/views/shop/order/pendingShipment.vue'),
      },
      {
        meta: {
          title: $t('page.shop.saleOrder.deliveryInProgress'),
          icon: 'mdi:truck-cargo-container',
          authority: ['shop'],
        },
        name: 'ShopOrderDeliveryInProgress',
        path: '/shop/order/deliveryInProgress',
        component: () => import('#/views/shop/order/deliveryInProgress.vue'),
      },
      {
        meta: {
          title: $t('page.shop.saleOrder.toBeSignedFor'),
          icon: 'mdi:timer-edit-outline',
          authority: ['shop'],
        },
        name: 'ShopOrderToBeSignedFor',
        path: '/shop/order/toBeSignedFor',
        component: () => import('#/views/shop/order/toBeSignedFor.vue'),
      },
      {
        meta: {
          title: $t('page.shop.saleOrder.pendingPayment'),
          icon: 'solar:wallet-money-broken',
          authority: ['shop'],
        },
        name: 'ShopOrderPendingPayment',
        path: '/shop/order/pendingPayment',
        component: () => import('#/views/shop/order/pendingPayment.vue'),
      },
      {
        meta: {
          title: $t('page.shop.saleOrder.completed'),
          icon: 'mdi:check-decagram-outline',
          authority: ['shop'],
        },
        name: 'ShopOrderCompleted',
        path: '/shop/order/completed',
        component: () => import('#/views/shop/order/completed.vue'),
      },
      {
        meta: {
          title: $t('page.shop.saleOrder.all'),
          icon: 'mdi:order-bool-ascending',
          authority: ['shop'],
        },
        name: 'ShopOrderAll',
        path: '/shop/order/all',
        component: () => import('#/views/shop/order/all.vue'),
      },
    ],
  },
  {
    meta: {
      title: $t('page.shop.myPrivateWarehouse.title'),
      icon: 'mdi:storefront',
      authority: ['shop'],
    },
    name: 'ShopPrivateWarehouse',
    path: '/shop/private',
    children: [
      {
        meta: {
          title: $t('page.shop.myPrivateWarehouse.shop'),
          icon: 'solar:shop-minimalistic-bold',
          authority: ['shop'],
        },
        name: 'ShopPrivateWarehouseShop',
        path: '/shop/private',
        component: () => import('#/views/shop/private/shop.vue'),
      },
      {
        meta: {
          title: $t('page.shop.myPrivateWarehouse.products'),
          icon: 'solar:layers-bold-duotone',
          authority: ['shop'],
        },
        name: 'ShopPrivateWarehouseProducts',
        path: '/shop/private/products',
        component: () => import('#/views/shop/private/products.vue'),
      },
      {
        meta: {
          title: $t('page.shop.myPrivateWarehouse.model'),
          icon: 'solar:arrow-right-up-bold',
          authority: ['shop'],
        },
        name: 'ShopPrivateWarehouseModel',
        path: '/shop/private/model',
        component: () => import('#/views/shop/private/model.vue'),
      },
      {
        meta: {
          title: $t('page.shop.myPrivateWarehouse.sku'),
          icon: 'solar:palette-round-bold-duotone',
          authority: ['shop'],
        },
        name: 'ShopPrivateWarehouseSku',
        path: '/shop/private/sku',
        component: () => import('#/views/shop/private/sku.vue'),
      },
    ],
  },
  {
    meta: {
      title: $t('page.shop.myBranchWarehouse.title'),
      icon: 'mdi:storefront',
      authority: ['shop'],
    },
    name: 'ShopBranchWarehouse',
    path: '/shop/branch',
    children: [
      {
        meta: {
          title: $t('page.shop.myBranchWarehouse.shop'),
          icon: 'solar:shop-minimalistic-bold',
          authority: ['shop'],
        },
        name: 'ShopBranchWarehouseShop',
        path: '/shop/branch',
        component: () => import('#/views/shop/branch/shop.vue'),
      },
      {
        meta: {
          title: $t('page.shop.myBranchWarehouse.products'),
          icon: 'solar:layers-bold-duotone',
          authority: ['shop'],
        },
        name: 'ShopBranchWarehouseProducts',
        path: '/shop/branch/products',
        component: () => import('#/views/shop/branch/products.vue'),
      },
      {
        meta: {
          title: $t('page.shop.myBranchWarehouse.model'),
          icon: 'solar:arrow-right-up-bold',
          authority: ['shop'],
        },
        name: 'ShopBranchWarehouseModel',
        path: '/shop/branch/model',
        component: () => import('#/views/shop/branch/model.vue'),
      },
      {
        meta: {
          title: $t('page.shop.myBranchWarehouse.sku'),
          icon: 'solar:palette-round-bold-duotone',
          authority: ['shop'],
        },
        name: 'ShopBranchWarehouseSku',
        path: '/shop/branch/sku',
        component: () => import('#/views/shop/branch/sku.vue'),
      },
    ],
  },
];

export default routes;
