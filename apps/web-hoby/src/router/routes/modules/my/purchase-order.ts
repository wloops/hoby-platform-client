import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      title: $t('page.my.purchaseOrder.title'),
      icon: 'solar:clipboard-check-broken',
      authority: ['my'],
    },
    name: 'MyPurchaseOrder',
    path: '/my/purchase-order',
    children: [
      {
        meta: {
          title: $t('page.my.purchaseOrder.shopPurchaseMng.title'),
          icon: 'solar:shop-minimalistic-broken',
          authority: ['my'],
        },
        name: 'ShopPurchaseMng',
        path: '/my/purchase-order/purchase',
        children: [
          {
            meta: {
              title: $t(
                'page.my.purchaseOrder.shopPurchaseMng.wareShopSrlIDForSale',
              ),
              icon: 'mdi:animation-outline',
              authority: ['my'],
            },
            name: 'WareShopSrlIDForSale',
            path: '/my/purchase-order/purchase/ware-srlid',
            component: () =>
              import('#/views/my/purchase-order/purchase/ware-srlid.vue'),
          },
          {
            meta: {
              title: $t(
                'page.my.purchaseOrder.shopPurchaseMng.wareShopGoodsForSale',
              ),
              icon: 'mdi:view-module-outline',
              authority: ['my'],
            },
            name: 'WareShopGoodsForSale',
            path: '/my/purchase-order/purchase/ware-goods',
            component: () =>
              import('#/views/my/purchase-order/purchase/ware-goods.vue'),
          },
          {
            meta: {
              title: $t(
                'page.my.purchaseOrder.shopPurchaseMng.myShoppingCartGoods',
              ),
              icon: 'solar:cart-large-4-broken',
              authority: ['my'],
            },
            name: 'MyShoppingCartGoods',
            path: '/my/purchase-order/purchase/myCart-goods',
            component: () =>
              import('#/views/my/purchase-order/purchase/myCart-goods.vue'),
          },
          // {
          //   meta: {
          //     title: $t('page.my.purchaseOrder.shopPurchaseMng.myShoppingCart'),
          //     icon: 'solar:cart-large-4-broken',
          //     authority: ['my'],
          //   },
          //   name: 'MyShoppingCart',
          //   path: '/my/purchase-order/purchase/cart',
          //   component: () =>
          //     import('#/views/my/purchase-order/purchase/cart.vue'),
          // },
          // {
          //   meta: {
          //     title: $t(
          //       'page.my.purchaseOrder.shopPurchaseMng.shoppingCartGoods',
          //     ),
          //     icon: 'solar:cart-3-outline',
          //     authority: ['my'],
          //   },
          //   name: 'ShoppingCartGoods',
          //   path: '/my/purchase-order/purchase/cart-goods',
          //   component: () =>
          //     import('#/views/my/purchase-order/purchase/cart-goods.vue'),
          // },
        ],
      },
      {
        meta: {
          title: $t('page.my.purchaseOrder.purchaseOrderManagement'),
          icon: 'solar:diploma-verified-linear',
          authority: ['my'],
          pageParams: {
            pageID: 'hobyMyPurchaseOrderPage',
            isTabs: true,
          },
        },
        name: 'hobyMyPurchaseOrderPage',
        path: '/my/purchase-order/management',
        component: () => import('#/views/_core/basic/BasicTablePage.vue'),
      },
      {
        meta: {
          title: $t('page.my.purchaseOrder.purchaseOrderMng.title'),
          icon: 'solar:diploma-verified-linear',
          authority: ['my'],
        },
        name: 'PurchaseOrderMng',
        path: '/my/purchase-order/order',
        children: [
          {
            meta: {
              title: $t(
                'page.my.purchaseOrder.purchaseOrderMng.purchaseOrderWaitPay',
              ),
              icon: 'mdi:alpha-y-circle-outline',
              authority: ['my'],
            },
            name: 'PurchaseOrderWaitPay',
            path: '/my/purchase-order/order/waitpay',
            component: () =>
              import('#/views/my/purchase-order/order/waitpay.vue'),
          },
          {
            meta: {
              title: $t(
                'page.my.purchaseOrder.purchaseOrderMng.purchaseOrderWaitSendOut',
              ),
              icon: 'mdi:car-select',
              authority: ['my'],
            },
            name: 'PurchaseOrderWaitSendOut',
            path: '/my/purchase-order/order/waitsend',
            component: () =>
              import('#/views/my/purchase-order/order/waitsend.vue'),
          },
          {
            meta: {
              title: $t(
                'page.my.purchaseOrder.purchaseOrderMng.purchaseOrderWaitSign',
              ),
              icon: 'mdi:order-bool-descending-variant',
              authority: ['my'],
            },
            name: 'PurchaseOrderWaitSign',
            path: '/my/purchase-order/order/waitsign',
            component: () =>
              import('#/views/my/purchase-order/order/waitsign.vue'),
          },
          {
            meta: {
              title: $t(
                'page.my.purchaseOrder.purchaseOrderMng.purchaseOrderSigned',
              ),
              icon: 'mdi:order-bool-ascending-variant',
              authority: ['my'],
            },
            name: 'PurchaseOrderSigned',
            path: '/my/purchase-order/order/signed',
            component: () =>
              import('#/views/my/purchase-order/order/signed.vue'),
          },
          {
            meta: {
              title: $t(
                'page.my.purchaseOrder.purchaseOrderMng.purchaseOrderInStock',
              ),
              icon: 'mdi:sort-clock-ascending',
              authority: ['my'],
            },
            name: 'PurchaseOrderInStock',
            path: '/my/purchase-order/order/instock',
            component: () =>
              import('#/views/my/purchase-order/order/instock.vue'),
          },
          {
            meta: {
              title: $t(
                'page.my.purchaseOrder.purchaseOrderMng.purchaseOrderWaitStorage',
              ),
              icon: 'mdi:sort-clock-ascending-outline',
              authority: ['my'],
            },
            name: 'PurchaseOrderWaitStorage',
            path: '/my/purchase-order/order/waitstorage',
            component: () =>
              import('#/views/my/purchase-order/order/waitstorage.vue'),
          },
          {
            meta: {
              title: $t(
                'page.my.purchaseOrder.purchaseOrderMng.purchaseOrderAll',
              ),
              icon: 'mdi:alarm-panel-outline',
              authority: ['my'],
            },
            name: 'PurchaseOrderAll',
            path: '/my/purchase-order/order/all',
            component: () => import('#/views/my/purchase-order/order/all.vue'),
          },
        ],
      },
    ],
  },
];

export default routes;
