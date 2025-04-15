/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-04-15 10:45:09
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-04-15 11:25:17
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\router\routes\modules\my\credit.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { RouteRecordRaw } from 'vue-router';

import basic from './my/basic';
import credit from './my/credit';
import fund from './my/fund';
import product from './my/product';
import purchaseOrder from './my/purchase-order';
import relation from './my/relation';
import salesOrder from './my/sales-order';
import shop from './my/shop';

const routes: RouteRecordRaw[] = [
  ...fund,
  ...credit,
  ...product,
  ...shop,
  ...salesOrder,
  ...purchaseOrder,
  ...relation,
  ...basic,
];

export default routes;
