/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-09 21:44:11
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-31 18:37:58
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\router\routes\modules\seller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      title: $t('page.my.basicInfo.title'),
      icon: 'mdi:information-outline',
      authority: ['my'],
    },
    name: 'MyBasicInfo',
    path: '/my',
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
  {
    meta: {
      title: $t('page.my.fundAccount.title'),
      icon: 'mdi:bank',
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
          title: $t('page.my.fundAccount.credit'),
          icon: 'mdi:credit-card',
          authority: ['my'],
        },
        name: 'MyCreditAccount',
        path: '/my/fund/credit',
        component: () => import('#/views/my/fund/credit.vue'),
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
        path: '/my/fund/config',
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
];

export default routes;
