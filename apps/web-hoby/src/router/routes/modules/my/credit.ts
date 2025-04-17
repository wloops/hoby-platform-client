/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-04-15 10:45:09
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-04-16 13:18:40
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\router\routes\modules\my\credit.ts
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
    path: '/my/credit',
    children: [
      {
        meta: {
          title: $t('page.my.creditManagement.applyForGuarantee'),
          icon: 'solar:medal-ribbon-star-linear',
          authority: ['my'],
          pageParams: {
            pageID: 'applySettlementGuaranteePage',
          },
        },
        name: 'MyApplyForGuarantee',
        path: '/my/credit/apply-for-guarantee',
        component: () => import('#/views/_core/basic/BasicTablePage.vue'),
      },
      {
        meta: {
          title: $t('page.my.creditManagement.applyForRenewalGuarantee'),
          icon: 'solar:medal-ribbons-star-linear',
          authority: ['my'],
          pageParams: {
            pageID: 'applyPerformanceGuaranteePage',
          },
        },
        name: 'MyRenewalGuarantee',
        path: '/my/credit/renewal-guarantee',
        component: () => import('#/views/_core/basic/BasicTablePage.vue'),
      },
      {
        meta: {
          title: $t('page.my.creditManagement.myGuaranteeOrder'),
          icon: 'solar:clipboard-linear',
          authority: ['my'],
          pageParams: {
            pageID: 'myGuaranteeOrder',
          },
        },
        name: 'MyGuaranteeOrder',
        path: '/my/credit/guarantee-order',
        component: () => import('#/views/_core/basic/BasicTablePage.vue'),
      },
      {
        meta: {
          title: $t('page.my.creditManagement.guaranteeAccount'),
          icon: 'mdi:currency-usd-circle-outline',
          authority: ['my'],
          pageParams: {
            pageID: 'myGuaranteeAccount',
          },
        },
        name: 'MyGuaranteeAccount',
        path: '/my/credit/guarantee-account',
        component: () => import('#/views/_core/basic/BasicTablePage.vue'),
      },
      {
        meta: {
          title: $t('page.my.creditManagement.defaultCreditAccount'),
          icon: 'mdi:credit-card-marker-outline',
          authority: ['my'],
          pageParams: {
            pageID: 'myDefaultCreditAccPage',
          },
        },
        name: 'DefaultCreditAccount',
        path: '/my/credit/credit-account',
        component: () => import('#/views/_core/basic/BasicTablePage.vue'),
      },
    ],
  },
];

export default routes;
