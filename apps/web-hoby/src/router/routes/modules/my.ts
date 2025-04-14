/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-09 21:44:11
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-04-11 14:56:07
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\router\routes\modules\seller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      title: $t('page.my.fundAccount.title'),
      icon: 'solar:money-bag-outline',
      authority: ['my'],
    },
    name: 'MyFundAccount',
    path: '/my',
    children: [
      {
        meta: {
          title: $t('page.my.fundAccount.settlement'),
          icon: 'mdi:account-cash',
          authority: ['my'],
        },
        name: 'MySettlementAccount',
        path: '/my/fund/settlement',
        component: () => import('#/views/my/fund/settlement.vue'),
      },
      {
        meta: {
          title: $t('page.my.fundAccount.voucherWaitPay'),
          icon: 'mdi:cash-multiple',
          authority: ['my'],
        },
        name: 'VoucherWaitPay',
        path: '/my/fund/voucher-waitpay',
        component: () => import('#/views/my/fund/voucher-waitpay.vue'),
      },
      {
        meta: {
          title: $t('page.my.fundAccount.voucherWaitReceive'),
          icon: 'mdi:wallet',
          authority: ['my'],
        },
        name: 'VoucherWaitReceive',
        path: '/my/fund/voucher-waitrecv',
        component: () => import('#/views/my/fund/voucher-waitrecv.vue'),
      },
      {
        meta: {
          title: $t('page.my.fundAccount.voucherWaitConfirm'),
          icon: 'mdi:camera-metering-partial',
          authority: ['my'],
        },
        name: 'VoucherWaitConfirm',
        path: '/my/fund/voucher-waitconfirm',
        component: () => import('#/views/my/fund/voucher-waitconfirm.vue'),
      },
      {
        meta: {
          title: $t('page.my.fundAccount.OpenBankAccount'),
          icon: 'mdi:bank',
          authority: ['my'],
        },
        name: 'OpenBankAccount',
        path: '/my/fund/open-bankacc',
        component: () => import('#/views/my/fund/open-bankacc.vue'),
      },
      {
        meta: {
          title: $t('page.my.fundAccount.voucher.title'),
          icon: 'mdi:card-account-details',
          authority: ['my'],
        },
        name: 'MyVoucher',
        path: '/my/fund/voucher',
        children: [
          {
            meta: {
              title: $t('page.my.fundAccount.voucher.orderSettlement'),
              icon: 'mdi:receipt',
              authority: ['my'],
            },
            name: 'MyOrderSettlement',
            path: '/my/fund/voucher/order-settlement',
            component: () =>
              import('#/views/my/fund/voucher/order-settlement.vue'),
          },
          {
            meta: {
              title: $t('page.my.fundAccount.voucher.paymentSettlement'),
              icon: 'mdi:cash-multiple',
              authority: ['my'],
            },
            name: 'MyPaymentSettlement',
            path: '/my/fund/voucher/payment-settlement',
            component: () =>
              import('#/views/my/fund/voucher/payment-settlement.vue'),
          },
          {
            meta: {
              title: $t('page.my.fundAccount.voucher.receiptSettlement'),
              icon: 'mdi:wallet',
              authority: ['my'],
            },
            name: 'MyReceiptSettlement',
            path: '/my/fund/voucher/receipt-settlement',
            component: () =>
              import('#/views/my/fund/voucher/receipt-settlement.vue'),
          },
        ],
      },
      {
        meta: {
          title: $t('page.my.fundAccount.config.title'),
          icon: 'mdi:cog-pause-outline',
          authority: ['my'],
        },
        name: 'MyConfig',
        path: '/my/config',
        children: [
          {
            meta: {
              title: $t('page.my.fundAccount.config.salesShare'),
              icon: 'mdi:chart-pie',
              authority: ['my'],
            },
            name: 'MySalesShare',
            path: '/my/fund/config/sales-share',
            component: () => import('#/views/my/fund/config/sales-share.vue'),
          },
          {
            meta: {
              title: $t('page.my.fundAccount.config.prepaidPercentage'),
              icon: 'mdi:percent',
              authority: ['my'],
            },
            name: 'MyPrepaidPercentage',
            path: '/my/fund/config/prepaid-percentage',
            component: () =>
              import('#/views/my/fund/config/prepaid-percentage.vue'),
          },
          {
            meta: {
              title: $t('page.my.fundAccount.config.paymentPeriod'),
              icon: 'mdi:calendar-clock',
              authority: ['my'],
            },
            name: 'MyPaymentPeriod',
            path: '/my/fund/config/payment-period',
            component: () =>
              import('#/views/my/fund/config/payment-period.vue'),
          },
          {
            meta: {
              title: $t('page.my.fundAccount.config.defaultPayment'),
              icon: 'mdi:wallet-outline',
              authority: ['my'],
            },
            name: 'MyDefaultPayment',
            path: '/my/fund/config/default-payment',
            component: () =>
              import('#/views/my/fund/config/default-payment.vue'),
          },
        ],
      },
    ],
  },
  {
    meta: {
      title: $t('page.my.creditManagement.title'),
      icon: 'solar:card-2-outline',
      authority: ['my'],
    },
    name: 'MyCreditManagement',
    path: '/my/credit',
    children: [
      {
        meta: {
          title: $t('page.my.creditManagement.applyForGuarantee'),
          icon: 'solar:medal-ribbon-star-linear',
          authority: ['my'],
        },
        name: 'MyApplyForGuarantee',
        path: '/my/credit/apply-for-guarantee',
        component: () => import('#/views/my/credit/apply-for-guarantee.vue'),
      },
      {
        meta: {
          title: $t('page.my.creditManagement.applyForRenewalGuarantee'),
          icon: 'solar:medal-ribbons-star-linear',
          authority: ['my'],
        },
        name: 'MyRenewalGuarantee',
        path: '/my/credit/renewal-guarantee',
        component: () => import('#/views/my/credit/renewal-guarantee.vue'),
      },
      {
        meta: {
          title: $t('page.my.creditManagement.myGuaranteeOrder'),
          icon: 'solar:clipboard-linear',
          authority: ['my'],
        },
        name: 'MyGuaranteeOrder',
        path: '/my/credit/guarantee-order',
        component: () => import('#/views/my/credit/guarantee-order.vue'),
      },
      {
        meta: {
          title: $t('page.my.creditManagement.guaranteeAccount'),
          icon: 'mdi:account-cog',
          authority: ['my'],
        },
        name: 'MyGuaranteeAccount',
        path: '/my/credit/guarantee-account',
        component: () => import('#/views/my/credit/guarantee-account.vue'),
      },
    ],
  },
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
  {
    meta: {
      title: $t('page.my.salesOrder.title'),
      icon: 'solar:clipboard-linear',
      authority: ['my'],
    },
    name: 'MySalesOrder',
    path: '/my/sales-order',
    children: [
      {
        meta: {
          title: $t('page.my.salesOrder.inputSaleOrder.title'),
          icon: 'solar:clipboard-linear',
          authority: ['my'],
        },
        name: 'InputSaleOrder',
        path: '/my/sales-order/input',
        component: () => import('#/views/my/sales-order/input/main.vue'),
      },
      {
        meta: {
          title: $t('page.my.salesOrder.saleOrderManage.title'),
          icon: 'mdi:file-document-arrow-right-outline',
          authority: ['my'],
        },
        name: 'SaleOrderManage',
        path: '/my/sales-order/manage',
        children: [
          {
            meta: {
              title: $t(
                'page.my.salesOrder.saleOrderManage.orderWaitDistribution',
              ),
              icon: 'mdi:truck-alert-outline',
              authority: ['my'],
            },
            name: 'saleOrderWaitDistribution',
            path: '/my/sales-order/manage/pendingShipment',
            component: () => import('#/views/shop/order/pendingShipment.vue'),
          },
          {
            meta: {
              title: $t('page.my.salesOrder.saleOrderManage.orderDelivering'),
              icon: 'mdi:truck-cargo-container',
              authority: ['my'],
            },
            name: 'saleOrderDelivering',
            path: '/my/sales-order/manage/deliveryInProgress',
            component: () =>
              import('#/views/shop/order/deliveryInProgress.vue'),
          },
          {
            meta: {
              title: $t('page.my.salesOrder.saleOrderManage.orderWaitSignFor'),
              icon: 'mdi:timer-edit-outline',
              authority: ['my'],
            },
            name: 'saleOrderWaitSignFor',
            path: '/my/sales-order/manage/toBeSignedFor',
            component: () => import('#/views/shop/order/toBeSignedFor.vue'),
          },
          {
            meta: {
              title: $t('page.my.salesOrder.saleOrderManage.orderCompleted'),
              icon: 'mdi:check-decagram-outline',
              authority: ['my'],
            },
            name: 'saleOrderCompleted',
            path: '/my/sales-order/manage/completed',
            component: () => import('#/views/shop/order/completed.vue'),
          },
          {
            meta: {
              title: $t('page.my.salesOrder.saleOrderManage.allSaleOrder'),
              icon: 'mdi:order-bool-ascending',
              authority: ['my'],
            },
            name: 'AllSaleOrder',
            path: '/my/sales-order/manage/all',
            component: () => import('#/views/shop/order/all.vue'),
          },
          {
            meta: {
              title: $t('page.my.salesOrder.saleOrderManage.logisticsOrder'),
              icon: 'mdi:car-traction-control',
              authority: ['my'],
            },
            name: 'LogisticsOrder',
            path: '/my/sales-order/manage/logistics',
            component: () =>
              import('#/views/my/sales-order/manage/logistics.vue'),
          },
        ],
      },
    ],
  },
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
          icon: 'mdi:office-building',
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
              icon: 'mdi:animation-outline',
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
                'page.my.purchaseOrder.shopPurchaseMng.shopSrlIDForSale',
              ),
              icon: 'mdi:animation-outline',
              authority: ['my'],
            },
            name: 'ShopSrlIDForSale',
            path: '/my/purchase-order/purchase/shop-srlid',
            component: () =>
              import('#/views/my/purchase-order/purchase/shop-srlid.vue'),
          },
          {
            meta: {
              title: $t(
                'page.my.purchaseOrder.shopPurchaseMng.shopGoodsForSale',
              ),
              icon: 'mdi:view-module-outline',
              authority: ['my'],
            },
            name: 'ShopGoodsForSale',
            path: '/my/purchase-order/purchase/shop-goods',
            component: () =>
              import('#/views/my/purchase-order/purchase/shop-goods.vue'),
          },
          {
            meta: {
              title: $t('page.my.purchaseOrder.shopPurchaseMng.myShoppingCart'),
              icon: 'mdi:animation-outline',
              authority: ['my'],
            },
            name: 'MyShoppingCart',
            path: '/my/purchase-order/purchase/cart',
            component: () =>
              import('#/views/my/purchase-order/purchase/cart.vue'),
          },
          {
            meta: {
              title: $t(
                'page.my.purchaseOrder.shopPurchaseMng.shoppingCartGoods',
              ),
              icon: 'mdi:view-module-outline',
              authority: ['my'],
            },
            name: 'ShoppingCartGoods',
            path: '/my/purchase-order/purchase/cart-goods',
            component: () =>
              import('#/views/my/purchase-order/purchase/cart-goods.vue'),
          },
        ],
      },
      {
        meta: {
          title: $t('page.my.purchaseOrder.purchaseOrderMng.title'),
          icon: 'mdi:office-building',
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
              icon: 'mdi:animation-outline',
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
              icon: 'mdi:animation-outline',
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
              icon: 'mdi:animation-outline',
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
              icon: 'mdi:animation-outline',
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
              icon: 'mdi:animation-outline',
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
              icon: 'mdi:animation-outline',
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
              icon: 'mdi:animation-outline',
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
  {
    meta: {
      title: $t('page.my.relationManagement.title'),
      icon: 'solar:user-heart-broken',
      authority: ['my'],
    },
    name: 'MyRelationManagement',
    path: '/my/relation',
    children: [
      {
        meta: {
          title: $t('page.my.relationManagement.title'),
          icon: 'mdi:office-building',
          authority: ['my'],
        },
        name: 'MyRelationMain',
        path: '/my/relation/main',
        component: () => import('#/views/my/relation/main.vue'),
      },
    ],
  },
  {
    meta: {
      title: $t('page.my.basicInfo.title'),
      icon: 'mdi:information-outline',
      authority: ['my'],
    },
    name: 'MyBasicInfo',
    path: '/my/basic',
    children: [
      {
        meta: {
          title: $t('page.my.basicInfo.companyInfo'),
          icon: 'mdi:office-building',
          authority: ['my'],
        },
        name: 'MyCompanyInfo',
        path: '/my/basic/company',
        component: () => import('#/views/my/basic/company.vue'),
      },
      {
        meta: {
          title: $t('page.my.basicInfo.companyAddress'),
          icon: 'mdi:map-marker',
          authority: ['my'],
        },
        name: 'MyCompanyAddress',
        path: '/my/basic/address',
        component: () => import('#/views/my/basic/address.vue'),
      },
      {
        meta: {
          title: $t('page.my.basicInfo.employees'),
          icon: 'mdi:account-group',
          authority: ['my'],
        },
        name: 'MyEmployees',
        path: '/my/basic/employees',
        component: () => import('#/views/my/basic/employees.vue'),
      },
      {
        meta: {
          title: $t('page.my.basicInfo.operationAccounts'),
          icon: 'mdi:account-cog',
          authority: ['my'],
        },
        name: 'MyOperationAccounts',
        path: '/my/basic/accounts',
        component: () => import('#/views/my/basic/accounts.vue'),
      },
    ],
  },
];

export default routes;
