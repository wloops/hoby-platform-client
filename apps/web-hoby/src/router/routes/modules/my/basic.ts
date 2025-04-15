/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-04-15 10:52:25
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-04-15 11:59:38
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\router\routes\modules\my\relation.ts
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
