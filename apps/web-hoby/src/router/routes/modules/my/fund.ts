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
    path: '/my/fund',
    children: [
      {
        meta: {
          title: $t('page.my.fundAccount.settlement'),
          icon: 'mdi:account-cash',
          authority: ['my'],
          pageParams: {
            pageID: 'mySettlementAccountPage',
          },
        },
        name: 'MySettlementAccount',
        path: '/my/fund/settlement',
        component: () => import('#/views/_core/basic/BasicTablePage.vue'),
      },
      {
        meta: {
          title: $t('page.my.fundAccount.paymentVoucherManage'),
          icon: 'mdi:cash-multiple',
          authority: ['my'],
          pageParams: {
            pageID: 'hobyMyPaymentBillPage',
            isTabs: true,
          },
        },
        name: 'PaymentVoucherManag',
        path: '/my/fund/pay-bill',
        component: () => import('#/views/_core/basic/BasicTablePage.vue'),
      },
      {
        meta: {
          title: $t('page.my.fundAccount.receiptVoucherManage'),
          icon: 'solar:hand-money-linear',
          authority: ['my'],
          pageParams: {
            pageID: 'hobyMyRecvBillPage',
            isTabs: true,
          },
        },
        name: 'ReceiptVoucherManage',
        path: '/my/fund/recv-bill',
        component: () => import('#/views/_core/basic/BasicTablePage.vue'),
      },
      {
        meta: {
          title: $t('page.my.fundAccount.guaranteeVoucherManage'),
          icon: 'mdi:camera-metering-partial',
          authority: ['my'],
          pageParams: {
            pageID: 'hobyMyGuaranteeBillPage',
            isTabs: true,
          },
        },
        name: 'GuaranteeVoucherManage',
        path: '/my/fund/guarant-bill',
        component: () => import('#/views/_core/basic/BasicTablePage.vue'),
      },
      {
        meta: {
          title: $t('page.my.fundAccount.OpenBankAccount'),
          icon: 'mdi:bank',
          authority: ['my'],
          pageParams: {
            pageID: 'memOpenOnlinePaymentServicesPage',
          },
        },
        name: 'OpenBankAccount',
        path: '/my/fund/open-bankacc',
        component: () => import('#/views/_core/basic/BasicTablePage.vue'),
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
              icon: 'solar:clipboard-check-broken',
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
              icon: 'solar:hand-money-linear',
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
              icon: 'mdi:credit-card-marker-outline',
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
