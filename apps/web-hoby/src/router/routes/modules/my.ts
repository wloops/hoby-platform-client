/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-09 21:44:11
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-04-11 14:10:27
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\router\routes\modules\seller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      title: $t('page.my.creditManagement.title'),
      icon: 'solar:card-2-outline',
      authority: ['my'],
    },
    name: 'MyCreditManagement',
    path: '/my',
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
      title: $t('page.my.fundAccount.title'),
      icon: 'solar:money-bag-outline',
      authority: ['my'],
    },
    name: 'MyFundAccount',
    path: '/my/fund',
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
        component: () => import('#/views/my/product/model.vue'),
      },
      {
        meta: {
          title: $t('page.my.productManagement.specStandards'),
          icon: 'mdi:account-group',
          authority: ['my'],
        },
        name: 'MySpecStandards',
        path: '/my/product/spec-standards',
        component: () => import('#/views/my/product/spec-standards.vue'),
      },
      {
        meta: {
          title: $t('page.my.productManagement.productCatalog'),
          icon: 'mdi:account-cog',
          authority: ['my'],
        },
        name: 'MyProductCatalog',
        path: '/my/product/catalog',
        component: () => import('#/views/my/product/catalog.vue'),
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
          title: $t('page.my.shopManagement.title'),
          icon: 'mdi:office-building',
          authority: ['my'],
        },
        name: 'MyShopMain',
        path: '/my/shop/main',
        component: () => import('#/views/my/shop/main.vue'),
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
          title: $t('page.my.salesOrder.title'),
          icon: 'solar:clipboard-linear',
          authority: ['my'],
        },
        name: 'MyOrderMain',
        path: '/my/sales-order/main',
        component: () => import('#/views/my/sales-order/main.vue'),
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
          title: $t('page.my.purchaseOrder.title'),
          icon: 'solar:clipboard-check-broken',
          authority: ['my'],
        },
        name: 'MyOrderMain',
        path: '/my/purchase-order/main',
        component: () => import('#/views/my/purchase-order/main.vue'),
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
