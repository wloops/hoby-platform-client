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
];

export default routes;
