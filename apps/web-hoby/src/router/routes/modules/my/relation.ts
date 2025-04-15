/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-04-15 10:52:25
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-04-15 10:52:51
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\router\routes\modules\my\relation.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
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
];

export default routes;
