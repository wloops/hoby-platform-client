/*
 * @Author: Loong wentloop@gmail.com
 * @Date: 2025-03-09 21:44:11
 * @LastEditors: Loong wentloop@gmail.com
 * @LastEditTime: 2025-03-10 14:44:08
 * @FilePath: \hoby-platform-client\apps\web-hoby\src\router\routes\modules\seller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      title: $t('page.seller.directSales.title'),
      icon: 'mdi:storefront',
      order: 1,
      authority: ['seller'],
    },
    name: 'SellerDirectSales',
    path: '/seller',
    children: [
      {
        meta: {
          title: $t('page.seller.directSales.selectGoods'),
          icon: 'mdi:selection-search',
        },
        name: 'DirectSalesSelectGoods',
        path: '/seller/direct-sales/select-goods',
        component: () => import('#/views/seller/direct-sales/select-goods.vue'),
      },
      {
        meta: {
          title: $t('page.seller.directSales.goods'),
          icon: 'mdi:apps',
        },
        name: 'DirectSalesGoods',
        path: '/seller/direct-sales/goods',
        component: () => import('#/views/seller/direct-sales/goods.vue'),
      },
      {
        meta: {
          title: $t('page.seller.directSales.goodsModel'),
          icon: 'mdi:format-text-rotation-down-vertical',
        },
        name: 'DirectSalesGoodsModel',
        path: '/seller/direct-sales/goods-model',
        component: () => import('#/views/seller/direct-sales/goods-model.vue'),
      },
      {
        meta: {
          title: $t('page.seller.directSales.goodsSku'),
          icon: 'mdi:credit-card-marker-outline',
        },
        name: 'DirectSalesGoodsSku',
        path: '/seller/direct-sales/goods-sku',
        component: () => import('#/views/seller/direct-sales/goods-sku.vue'),
      },
    ],
  },
  {
    meta: {
      title: $t('page.seller.selfSales.title'),
      icon: 'mdi:storefront-check',
    },
    name: 'SellerSelfSales',
    path: '/seller/self-sales',
    children: [
      {
        meta: {
          title: $t('page.seller.selfSales.goods'),
          icon: 'mdi:selection-search',
        },
        name: 'SellerSelfSalesGoods',
        path: '/seller/self-sales/goods',
        component: () => import('#/views/seller/self-sales/goods.vue'),
      },
      {
        meta: {
          title: $t('page.seller.selfSales.goodsModel'),
          icon: 'mdi:format-text-rotation-down-vertical',
        },
        name: 'SellerSelfSalesGoodsModel',
        path: '/seller/self-sales/goods-model',
        component: () => import('#/views/seller/self-sales/goods-model.vue'),
      },
      {
        meta: {
          title: $t('page.seller.selfSales.goodsSku'),
          icon: 'mdi:credit-card-marker-outline',
        },
        name: 'SellerSelfSalesGoodsSku',
        path: '/seller/self-sales/goods-sku',
        component: () => import('#/views/seller/self-sales/goods-sku.vue'),
      },
    ],
  },
  {
    meta: {
      title: $t('page.seller.applyToOpenStore.title'),
      icon: 'mdi:storefront-plus',
    },
    name: 'SellerApplyToOpenStore',
    path: '/seller/apply-to-open-store',
    children: [
      {
        meta: {
          title: $t('page.seller.applyToOpenStore.submitApply'),
          icon: 'mdi:arrow-up-bold-circle',
        },
        name: 'SellerApplyToOpenStoreSubmitApply',
        path: '/seller/apply-to-open-store/submit-apply',
        component: () =>
          import('#/views/seller/apply-to-open-store/submit-apply.vue'),
      },
      {
        meta: {
          title: $t('page.seller.applyToOpenStore.myApply'),
          icon: 'mdi:view-list',
        },
        name: 'SellerApplyToOpenStoreMyApply',
        path: '/seller/apply-to-open-store/my-apply',
        component: () =>
          import('#/views/seller/apply-to-open-store/my-apply.vue'),
      },
    ],
  },
];

export default routes;
